import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

const COOKIE = "visit_counted";
const ROW_ID = "default";

function json(body: object, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...init?.headers },
  });
}

async function withSql<T>(fn: (sql: ReturnType<typeof getSql>) => Promise<T>) {
  const sql = getSql();
  try {
    await sql`
      create table if not exists site_visits (
        id text primary key,
        total bigint not null default 0
      )
    `;
    await sql.unsafe(`
      do $migrate$
      begin
        if exists (
          select 1 from information_schema.columns
          where table_schema = 'public'
            and table_name = 'site_visits'
            and column_name = 'count'
        ) and not exists (
          select 1 from information_schema.columns
          where table_schema = 'public'
            and table_name = 'site_visits'
            and column_name = 'total'
        ) then
          alter table site_visits rename column count to total;
        end if;
      end
      $migrate$;
    `);
    return await fn(sql);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function currentCount(sql: ReturnType<typeof getSql>) {
  const rows = await sql<{ total: string | number }[]>`
    select total from site_visits where id = ${ROW_ID}
  `;
  return Number(rows[0]?.total ?? 0);
}

async function incrementCount(sql: ReturnType<typeof getSql>) {
  const rows = await sql<{ total: string | number }[]>`
    insert into site_visits (id, total)
    values (${ROW_ID}, 1)
    on conflict (id) do update
    set total = site_visits.total + 1
    returning total
  `;
  return Number(rows[0]?.total ?? 1);
}

export async function GET() {
  try {
    const count = await withSql(currentCount);
    return json({ count });
  } catch {
    return json({ error: "visits_unavailable" }, { status: 502 });
  }
}

export async function POST() {
  try {
    const jar = await cookies();
    const alreadyCounted = jar.get(COOKIE)?.value === "1";
    const count = await withSql(alreadyCounted ? currentCount : incrementCount);
    const res = json({ count });
    res.cookies.set(COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return res;
  } catch {
    return json({ error: "visits_unavailable" }, { status: 502 });
  }
}

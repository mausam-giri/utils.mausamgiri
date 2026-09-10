import postgres from "postgres";

function connectionString() {
  return (
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ""
  );
}

export function getSql() {
  const url = connectionString();
  if (!url) {
    throw new Error("visits_not_configured");
  }

  return postgres(url, {
    ssl: "require",
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
  });
}

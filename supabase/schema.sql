create table if not exists site_visits (
  id text primary key,
  total bigint not null default 0
);

insert into site_visits (id, total)
values ('default', 0)
on conflict (id) do nothing;

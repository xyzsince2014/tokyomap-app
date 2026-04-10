create table if not exists public.t_tweet (
  tweet_id bigserial primary key
  , sub character varying(128) not null
  , message character varying(255) not null
  , lat numeric(21, 18) not null
  , lng numeric(21, 18) not null
  , disappear_at timestamp not null
  , created_at timestamp not null
  , updated_at timestamp not null
);

create index if not exists idx_t_tweet_sub on public.t_tweet (sub);

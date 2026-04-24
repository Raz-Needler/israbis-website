-- ═══════════════════════════════════════════════════════════════
-- IsraBis Admin Portal · Analytics Schema
-- Apply AFTER 001_admin_schema.sql
-- ═══════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS analytics;

-- ══════════════════════════════════════
-- analytics.events — main event stream
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics.events (
  id                BIGSERIAL PRIMARY KEY,
  event_id          TEXT NOT NULL UNIQUE,
  event_name        TEXT NOT NULL,
  event_category    TEXT NOT NULL,
  event_version     SMALLINT NOT NULL DEFAULT 1,
  occurred_at       TIMESTAMPTZ NOT NULL,
  received_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  day               DATE NOT NULL,
  user_id           TEXT,
  anonymous_id      TEXT NOT NULL,
  session_id        TEXT,
  device_id         TEXT,
  platform          TEXT,
  app_version       TEXT,
  os_version        TEXT,
  locale            TEXT,
  subscription_tier TEXT,
  family_id         TEXT,
  props             JSONB,
  ip_hash           TEXT,
  customer_id       TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_day           ON analytics.events(day);
CREATE INDEX IF NOT EXISTS idx_events_name_day      ON analytics.events(event_name, day);
CREATE INDEX IF NOT EXISTS idx_events_category_day  ON analytics.events(event_category, day);
CREATE INDEX IF NOT EXISTS idx_events_user_time     ON analytics.events(user_id, occurred_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_anon_time     ON analytics.events(anonymous_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session       ON analytics.events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_props_gin     ON analytics.events USING GIN (props);
CREATE INDEX IF NOT EXISTS idx_events_customer_day  ON analytics.events(customer_id, day) WHERE customer_id IS NOT NULL;

-- ══════════════════════════════════════
-- analytics.events_rejected — debug log
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics.events_rejected (
  id           BIGSERIAL PRIMARY KEY,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason       TEXT NOT NULL,
  raw          TEXT
);

CREATE INDEX IF NOT EXISTS idx_rejected_time ON analytics.events_rejected(received_at DESC);

-- ══════════════════════════════════════
-- analytics.user_timeline — per-anonymous first/last seen
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics.user_timeline (
  anonymous_id     TEXT PRIMARY KEY,
  first_seen_at    TIMESTAMPTZ NOT NULL,
  last_seen_at     TIMESTAMPTZ NOT NULL,
  first_platform   TEXT,
  first_user_id    TEXT,
  current_user_id  TEXT,
  total_events     INT NOT NULL DEFAULT 0,
  total_sessions   INT NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_user    ON analytics.user_timeline(current_user_id) WHERE current_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_timeline_last    ON analytics.user_timeline(last_seen_at DESC);

-- ══════════════════════════════════════
-- analytics.daily_snapshot — pre-aggregated KPIs
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics.daily_snapshot (
  day                 DATE PRIMARY KEY,
  dau                 INT NOT NULL DEFAULT 0,
  unique_anon         INT NOT NULL DEFAULT 0,
  new_signups         INT NOT NULL DEFAULT 0,
  total_events        BIGINT NOT NULL DEFAULT 0,
  total_sessions      INT NOT NULL DEFAULT 0,
  carts_built         INT NOT NULL DEFAULT 0,
  carts_compared      INT NOT NULL DEFAULT 0,
  purchases_confirmed INT NOT NULL DEFAULT 0,
  ai_messages         INT NOT NULL DEFAULT 0,
  scans_performed     INT NOT NULL DEFAULT 0,
  crashes             INT NOT NULL DEFAULT 0,
  paid_conversions    INT NOT NULL DEFAULT 0,
  refreshed_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_snapshot_day ON analytics.daily_snapshot(day DESC);

-- ══════════════════════════════════════
-- analytics.fact_intent_basket — crown jewel
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS analytics.fact_intent_basket (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  TEXT,
  anonymous_id             TEXT,
  family_id                TEXT,
  built_at                 TIMESTAMPTZ NOT NULL,
  compared_at              TIMESTAMPTZ,
  switched_at              TIMESTAMPTZ,
  purchased_at             TIMESTAMPTZ,
  abandoned_at             TIMESTAMPTZ,
  item_count               INT,
  total_nis_by_chain       JSONB,
  cheapest_chain           TEXT,
  user_chose_chain         TEXT,
  chose_cheapest           BOOLEAN,
  delta_nis_vs_cheapest    NUMERIC(10,2),
  eventually_purchased     BOOLEAN DEFAULT FALSE,
  purchase_chain           TEXT,
  time_to_purchase_seconds INT
);

CREATE INDEX IF NOT EXISTS idx_intent_basket_time     ON analytics.fact_intent_basket(built_at DESC);
CREATE INDEX IF NOT EXISTS idx_intent_basket_user     ON analytics.fact_intent_basket(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_intent_basket_chain    ON analytics.fact_intent_basket(user_chose_chain);
CREATE INDEX IF NOT EXISTS idx_intent_basket_purchase ON analytics.fact_intent_basket(purchase_chain) WHERE eventually_purchased;

-- ══════════════════════════════════════
-- Row-level security
-- ══════════════════════════════════════
ALTER TABLE analytics.events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.events_rejected     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.user_timeline       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.daily_snapshot      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.fact_intent_basket  ENABLE ROW LEVEL SECURITY;

-- No policies = no access except service role. Wire up customer-scoped policies in v2.1.

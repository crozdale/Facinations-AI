-- analytics.sql — saved queries for Facinations analytics

-- Daily swap volume by day
SELECT
  date,
  swap_count,
  ROUND(swap_volume_xer, 4)    AS swap_volume_xer,
  ROUND(xer_fees_collected, 4) AS xer_fees_collected,
  active_vault_count
FROM analytics_daily
ORDER BY date DESC
LIMIT 30;

-- Vault TVL over time (derived from trades net flow per vault)
SELECT
  date_trunc('day', timestamp)::DATE AS date,
  fraction_id                        AS vault_id,
  SUM(xer_amount)                    AS xer_inflow,
  COUNT(*)                           AS trade_count
FROM trades
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;

-- XER fee accumulation (cumulative)
SELECT
  date,
  ROUND(xer_fees_collected, 4)                          AS daily_fees_xer,
  ROUND(SUM(xer_fees_collected) OVER (ORDER BY date), 4) AS cumulative_fees_xer
FROM analytics_daily
ORDER BY date DESC;

-- Top traders by volume
SELECT
  "user",
  COUNT(*)           AS trade_count,
  SUM(xer_amount)    AS total_xer_volume,
  SUM(xer_amount * 0.003) AS fees_generated
FROM trades
GROUP BY "user"
ORDER BY total_xer_volume DESC
LIMIT 20;

-- User position summary
SELECT
  vault_id,
  COUNT(DISTINCT "user")   AS unique_holders,
  SUM(fraction_balance)    AS total_fractions_outstanding,
  SUM(entry_xer_amount)    AS total_entry_value_xer
FROM user_positions
WHERE fraction_balance > 0
GROUP BY vault_id
ORDER BY total_entry_value_xer DESC;

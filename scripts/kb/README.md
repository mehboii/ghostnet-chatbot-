# Chatbot knowledge base seeds

Version-controlled source for entries in the `chatbot_knowledge` table of the
Supabase project. Each file is a JSON array of `{ content, metadata }` objects;
`metadata.source` identifies the batch so it can be found or removed as a unit.

These entries were ingested into the live table (July 2026) from the
"GhostNet Product & Technology Reference v1.0" PDF, after deduplicating against
knowledge already present — only sections adding new information were kept.

## Re-ingesting

Each entry can be posted to the `kb-ingest` edge function (service_role key
required), which embeds it with the built-in gte-small model:

```sh
curl -X POST "$SUPABASE_URL/functions/v1/kb-ingest" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "content": "...", "metadata": { "source": "..." } }'
```

Alternatively, insert rows with a NULL `embedding` directly in SQL and invoke
the `kb-backfill` function until it reports `{"embedded": 0}` — it embeds up to
50 pending rows per call with the same model.

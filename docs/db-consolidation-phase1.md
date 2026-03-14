# Demo to Horasan consolidation phase 1

This phase merges only shared and control data from `demo` into `horasan`.

Included:
- `layer_layer`
- `roles_property_roles_property`
- `roles_roles`
- `roles_roles_PROPERTY_ID`
- `users_user`
- `users_user_layer_name`
- `user_settings_user_settings`
- `resources_types_resources_types`
- `code_list_code_list`
- `type_type`
- `type_property_type_property`
- `uom_uom`
- `resources_drawer_resources_drawer`
- `resources_drawer_resources_drawer_CHILD`

Not included:
- `item_item`
- `tags_tags`
- `tags_calculated_tags_calculated`
- dashboard tables

Run order:

1. Backup `horasan`

```bash
docker exec -i ligeiaai-postgres-1 pg_dump -U postgres -d horasan > horasan-before-shared-merge.sql
```

2. Compare `demo` and `horasan`

```bash
docker exec -i ligeiaai-postgres-1 psql -U postgres -d horasan -f - < scripts/compare-demo-into-horasan-phase1.sql
```

3. Merge shared rows

```bash
docker exec -i ligeiaai-postgres-1 psql -U postgres -d horasan -f - < scripts/merge-demo-into-horasan-shared.sql
```

4. Run compare again

```bash
docker exec -i ligeiaai-postgres-1 psql -U postgres -d horasan -f - < scripts/compare-demo-into-horasan-phase1.sql
```

5. Smoke test:
- login
- switch `STD <-> Horasan`
- drawer
- overview
- diagnostics

Important:
- `type_type` is keyed by `TYPE`, not by `(TYPE, LAYER_NAME)`
- if the same `TYPE` already exists in `horasan`, phase 1 will not overwrite it
- full physical DB cutover should be done only after separate review of items, tags, and dashboards

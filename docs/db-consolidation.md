## Demo vs Horasan

`demo` в текущей схеме не выглядит как случайная "тестовая база, которую забыли удалить".

По коду проект работает как multi-layer система:

- `STD` это базовый слой, через который идут login, user lookup, layer lookup и часть shared settings
- `Horasan` это отдельный layer со своими данными

Это видно в:

- [backend/apps/middleware/change_db.py](D:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/middleware/change_db.py)
- [backend/apps/layer/helpers.py](D:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/layer/helpers.py)
- [backend/apps/users/auth_views.py](D:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/users/auth_views.py)
- [backend/apps/users/update_views.py](D:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/users/update_views.py)

По `demo_dump.sql` слой `STD` прямо указывает на физическую БД `demo`, а `Horasan` на физическую БД `horasan`.

Это не значит, что нужны две логические базы навсегда. Это значит, что приложению нужен слой `STD`.

## Можно ли объединить

Да, но безопасно только так:

1. Не удалять `STD` как логический слой.
2. Если нужна одна физическая PostgreSQL база, объединять надо в новую merged-базу.
3. После объединения можно оставить две записи в `layer_layer`:
   - `STD`
   - `Horasan`
   но обе могут смотреть на одну и ту же физическую БД.

То есть:

- логических layer останется два
- физическая PostgreSQL база может стать одна

## Почему нельзя просто "убрать demo"

Сейчас код регулярно делает:

- `to_layerDb("STD")`
- читает пользователя
- читает `layer_layer`
- потом переключается в активный layer

Если просто снести `demo`, без переноса `STD`-данных, отвалятся:

- login
- active layer update
- user layers
- часть user settings
- drawer/resources/code list/shared metadata

## Что переносить из demo

В первую очередь это shared/control данные:

- `layer_layer`
- `users_user`
- `users_user_layer_name`
- `user_settings_user_settings`
- `resources_drawer_resources_drawer`
- `resources_types_resources_types`
- `roles_roles`
- `code_list_code_list`
- `type_type`
- `type_property_type_property`
- `uom_uom`

Потом уже смотреть бизнес-данные:

- `item_item`
- `tags_tags`
- `tags_calculated_tags_calculated`
- `bi_dashbord_bi_dashboard`
- `bi_widgets_bi_widget`
- `bi_layouts_bi_layout`
- `bi_widget_property_bi_widget_property`

## Что я бы рекомендовал

Самый безопасный путь:

1. Оставить текущее состояние как working baseline.
2. Сравнить `demo` и `horasan` helper-скриптом [scripts/compare-demo-vs-horasan.sql](D:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/compare-demo-vs-horasan.sql).
3. Если действительно нужен один physical DB:
   - создать новую БД, например `ligeia_merged`
   - взять `horasan` как основу
   - дозалить в неё missing shared rows из `demo`
   - затем поменять `DB_SETTINGS.NAME` у `STD` и `Horasan` на `ligeia_merged`
4. Прогнать smoke test:
   - login
   - layer switch `STD <-> Horasan`
   - drawer
   - overview
   - diagnostics

## Важное наблюдение по дампам

`demo_dump.sql` выглядит консистентно:

- `STD -> demo`
- `Horasan -> horasan`

`horasan_dump.sql` выглядит более "грязным" исторически:

- там есть ссылки на `Inkai`
- слой `Horasan` внутри dump указывает не на `horasan`, а на `inkai`

Это ещё одна причина не делать blind merge без сравнения.

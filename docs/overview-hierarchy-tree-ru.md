# Как добавлять и корректировать данные в overview hierarchy tree

Этот документ про левое дерево на странице overview:

- корневые компании
- площадки и установки под ними
- узлы вроде `THC №1`, `THC №2`
- конечные элементы вроде `THC 1 - P1`, `THC 2 - BP4`
- зелёные кружки статуса у конечных элементов

Это дерево не захардкожено во фронте. Оно собирается из PostgreSQL через backend.

## Что откуда берётся

Основная цепочка такая:

- frontend загружает дерево через `/item-link/hierarchy/`
- backend начинает с `item` типа `COMPANY`
- дочерние узлы строятся по связям `item_link`
- отображаемые названия берутся из `item_property` с `PROPERTY_TYPE='NAME'`
- зелёный статус берётся из `item_event`
- цвет и подпись статуса берутся из `code_list` для `PUMP_STATUS`

Код:

- [collapsableMenu.jsx](d:/ligeaai_backup_2025-05-11/ligeia.ai/frontend/src/components/treeMenu/collapsableMenu.jsx)
- [collapseMenu.js](d:/ligeaai_backup_2025-05-11/ligeia.ai/frontend/src/services/actions/collapseMenu/collapseMenu.js)
- [item_link/views.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/item_link/views.py)
- [item_event/views.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/item_event/views.py)
- [code_list/views.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/code_list/views.py)

Модели:

- [item/models.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/item/models.py)
- [item_property/models.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/item_property/models.py)
- [item_link/models.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/item_link/models.py)
- [code_list/models.py](d:/ligeaai_backup_2025-05-11/ligeia.ai/backend/apps/code_list/models.py)

## Что именно менять для каждого типа правки

Если нужно:

- переименовать узел: меняй `item_property.PROPERTY_STRING` у строки с `PROPERTY_TYPE='NAME'`
- добавить новый узел: создавай `item`, затем `item_property(NAME)`, затем связь в `item_link`
- переместить узел под другого родителя: меняй `item_link.TO_ITEM_ID`
- изменить статус кружка: меняй `item_event`
- изменить подпись или цвет статуса: меняй `code_list` у `LIST_TYPE='PUMP_STATUS'`

## Важные ограничения текущей реализации

Есть несколько нюансов, о которых лучше знать заранее:

- корни дерева сейчас берутся только из `item` с `ITEM_TYPE='COMPANY'`
- backend берёт первую запись `NAME` по `START_DATETIME`, а не последнюю
- поэтому для переименования безопаснее обновлять существующую запись `NAME`, а не добавлять новую
- дочерние узлы сортируются по алфавиту по `FROM_ITEM_NAME`
- ручного порядка без правки backend-кода сейчас нет
- зелёный кружок ставится не всем узлам, а только тем, у кого backend проставляет `ACTIVE`
- в текущем коде это происходит для `LINK_TYPE='BATTERY_ITEM'`

## Самый безопасный способ править: Django shell

На сервере открой shell внутри `django` контейнера:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml exec django bash -lc "cd backend && python manage.py shell"
```

Если удобнее работать напрямую в PostgreSQL, ниже есть и SQL-примеры.

## 1. Как найти нужный узел

Сначала почти всегда нужно найти `ITEM_ID`.

Через Django shell:

```python
from apps.item_property.models import item_property

list(
    item_property.objects
    .filter(PROPERTY_TYPE="NAME", PROPERTY_STRING__icontains="THC")
    .values("ITEM_ID", "ITEM_TYPE", "PROPERTY_STRING")[:50]
)
```

Если нужно посмотреть тип узла:

```python
from apps.item.models import item

item.objects.filter(ITEM_ID="PUT_ITEM_ID_HERE").values("ITEM_ID", "ITEM_TYPE", "LAYER_NAME").first()
```

## 2. Как переименовать узел

Пример: поменять `THC №2` на другое имя.

```python
from apps.item_property.models import item_property

obj = (
    item_property.objects
    .filter(ITEM_ID="PUT_ITEM_ID_HERE", PROPERTY_TYPE="NAME")
    .order_by("START_DATETIME")
    .first()
)

obj.PROPERTY_STRING = "THC №2 (новое имя)"
obj.save(update_fields=["PROPERTY_STRING"])
```

После этого:

- обнови страницу overview
- если был открыт старый deep link, заново выбери узел в дереве

Почему это важно:

- path в overview строится из имени узла
- после rename старый URL может уже не совпадать

## 3. Как переместить узел под другого родителя

Пример: перенести `THC 2 - BP4` под другой `THC`.

Сначала посмотри текущую связь:

```python
from apps.item_link.models import item_link

list(
    item_link.objects
    .filter(FROM_ITEM_ID="CHILD_ITEM_ID")
    .exclude(LINK_TYPE="TAG_ITEM")
    .values("LINK_ID", "FROM_ITEM_ID", "FROM_ITEM_TYPE", "TO_ITEM_ID", "TO_ITEM_TYPE", "LINK_TYPE")
)
```

Потом обнови родителя:

```python
from apps.item_link.models import item_link

link = (
    item_link.objects
    .filter(FROM_ITEM_ID="CHILD_ITEM_ID")
    .exclude(LINK_TYPE="TAG_ITEM")
    .first()
)

link.TO_ITEM_ID = "NEW_PARENT_ITEM_ID"
link.save(update_fields=["TO_ITEM_ID"])
```

Если хочешь убедиться, что новый родитель правильного типа:

```python
from apps.item.models import item

item.objects.filter(ITEM_ID="NEW_PARENT_ITEM_ID").values("ITEM_ID", "ITEM_TYPE", "LAYER_NAME").first()
```

## 4. Как добавить новый конечный узел

Самый безопасный способ:

1. найти существующий соседний узел
2. скопировать у него `FROM_ITEM_TYPE`, `TO_ITEM_TYPE`, `LINK_TYPE`
3. создать новый `item`
4. создать ему `NAME`
5. создать связь в `item_link`

Пример:

```python
from uuid import uuid4
from time import time
from apps.item.models import item
from apps.item_property.models import item_property
from apps.item_link.models import item_link

parent_id = "PARENT_ITEM_ID"
parent_type = "PUT_PARENT_ITEM_TYPE_HERE"
child_type = "BATTERY_ITEM"
layer_name = "Horasan"
node_name = "THC 2 - BP5"

now = int(time() * 1000)
item_id = uuid4().hex

item.objects.create(
    ITEM_ID=item_id,
    ITEM_TYPE=child_type,
    START_DATETIME=now,
    END_DATETIME=9999999999999,
    VERSION=uuid4().hex,
    ROW_ID=uuid4().hex,
    STATUS="A",
    LAYER_NAME=layer_name,
)

item_property.objects.create(
    ITEM_ID=item_id,
    ITEM_TYPE=child_type,
    LAYER_NAME=layer_name,
    START_DATETIME=now,
    END_DATETIME=9999999999999,
    PROPERTY_TYPE="NAME",
    PROPERTY_INFO="NAME",
    PROPERTY_DATE=now,
    PROPERTY_STRING=node_name,
    LAST_UPDT_DATE=now,
    VERSION=uuid4().hex,
    ROW_ID=uuid4().hex,
    STATUS="A",
)

item_link.objects.create(
    LINK_ID=uuid4().hex,
    LINK_TYPE=child_type,
    START_DATETIME=now,
    END_DATETIME=9999999999999,
    FROM_ITEM_ID=item_id,
    FROM_ITEM_TYPE=child_type,
    TO_ITEM_ID=parent_id,
    TO_ITEM_TYPE=parent_type,
    LAST_UPDT_DATE=now,
    LAYER_NAME=layer_name,
    VERSION=uuid4().hex,
    ROW_ID=uuid4().hex,
    STATUS="A",
)

print(item_id)
```

Лучше перед этим посмотреть существующего соседа и скопировать типы:

```python
from apps.item_link.models import item_link

list(
    item_link.objects
    .filter(TO_ITEM_ID="PARENT_ITEM_ID")
    .exclude(LINK_TYPE="TAG_ITEM")
    .values("FROM_ITEM_ID", "FROM_ITEM_TYPE", "TO_ITEM_ID", "TO_ITEM_TYPE", "LINK_TYPE")
)
```

## 5. Как удалить узел

Если удаляешь узел полностью, обычно надо удалить:

- связь из `item_link`
- `NAME` и другие свойства из `item_property`
- сам `item`
- при необходимости связанные статусы из `item_event`

Через Django shell:

```python
from apps.item.models import item
from apps.item_property.models import item_property
from apps.item_link.models import item_link
from apps.item_event.models import item_event

item_id = "PUT_ITEM_ID_HERE"

item_link.objects.filter(FROM_ITEM_ID=item_id).delete()
item_property.objects.filter(ITEM_ID=item_id).delete()
item_event.objects.filter(ITEM_ID=item_id).delete()
item.objects.filter(ITEM_ID=item_id).delete()
```

Если у узла есть дети, сначала проверь это:

```python
from apps.item_link.models import item_link

list(
    item_link.objects
    .filter(TO_ITEM_ID="PUT_ITEM_ID_HERE")
    .exclude(LINK_TYPE="TAG_ITEM")
    .values("FROM_ITEM_ID", "FROM_ITEM_TYPE")
)
```

## 6. Как менять зелёные кружки статуса

### Самый простой способ

В UI:

1. открой overview
2. правый клик по конечному узлу
3. `Status`
4. выбери нужный статус

Это использует:

- `/item-event/get/`
- `/item-event/save/status/`

### Если менять через backend/БД

Сначала посмотри текущий статус:

```python
from apps.item_event.models import item_event

list(
    item_event.objects
    .filter(ITEM_ID="PUT_ITEM_ID_HERE")
    .values("ROW_ID", "ITEM_ID", "EVENT_TYPE", "CHAR1", "START_DATETIME", "END_DATETIME")
    .order_by("-END_DATETIME")[:20]
)
```

`CHAR1` здесь это код статуса.

Но есть важная тонкость:

- нужный `EVENT_TYPE` зависит от типа узла
- frontend получает его через `type-ref/get/<ITEM_TYPE>/read/`

Поэтому если меняешь статус вручную, safest путь такой:

1. посмотри статус у соседнего такого же узла
2. используй тот же `EVENT_TYPE`
3. меняй только `CHAR1`

## 7. Как менять текст и цвет статусов

Текст и цвет берутся не из `item_event`, а из `code_list` по `PUMP_STATUS`.

Во фронте:

- `currentStatus.CHAR1` это код статуса
- потом ищется строка `code_list` с таким `CODE`
- `CODE_TEXT` показывается в меню
- `CHAR1` используется как цвет кружка

Посмотреть статусы:

```python
from apps.code_list.models import code_list

list(
    code_list.objects
    .filter(LIST_TYPE="PUMP_STATUS", CULTURE="ru-RU")
    .values("CODE", "CODE_TEXT", "CHAR1", "LAYER_NAME")
    .order_by("CODE")
)
```

Изменить подпись или цвет:

```python
from apps.code_list.models import code_list

obj = code_list.objects.get(LIST_TYPE="PUMP_STATUS", CULTURE="ru-RU", CODE="RUN")
obj.CODE_TEXT = "Работает"
obj.CHAR1 = "#0a8f08"
obj.save(update_fields=["CODE_TEXT", "CHAR1"])
```

## 8. Как работать через SQL

Если удобнее править напрямую в PostgreSQL:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml exec postgres psql -U postgres -d demo
```

Типовые таблицы Django здесь обычно такие:

- `item_item`
- `item_property_item_property`
- `item_link_item_link`
- `item_event_item_event`
- `code_list_code_list`

### Найти узел по имени

```sql
select
  ip."ITEM_ID",
  i."ITEM_TYPE",
  ip."PROPERTY_STRING"
from item_property_item_property ip
join item_item i on i."ITEM_ID" = ip."ITEM_ID"
where ip."PROPERTY_TYPE" = 'NAME'
  and ip."PROPERTY_STRING" ilike '%THC%'
order by ip."PROPERTY_STRING";
```

### Переименовать узел

```sql
update item_property_item_property
set "PROPERTY_STRING" = 'THC №2 (новое имя)'
where "ITEM_ID" = 'PUT_ITEM_ID_HERE'
  and "PROPERTY_TYPE" = 'NAME';
```

### Переместить узел

```sql
update item_link_item_link
set "TO_ITEM_ID" = 'NEW_PARENT_ITEM_ID'
where "FROM_ITEM_ID" = 'CHILD_ITEM_ID'
  and "LINK_TYPE" <> 'TAG_ITEM';
```

### Посмотреть статус узла

```sql
select
  "ROW_ID",
  "ITEM_ID",
  "EVENT_TYPE",
  "CHAR1",
  "START_DATETIME",
  "END_DATETIME"
from item_event_item_event
where "ITEM_ID" = 'PUT_ITEM_ID_HERE'
order by "END_DATETIME" desc;
```

### Посмотреть справочник цветов статусов

```sql
select
  "CODE",
  "CODE_TEXT",
  "CHAR1"
from code_list_code_list
where "LIST_TYPE" = 'PUMP_STATUS'
  and "CULTURE" = 'ru-RU'
order by "CODE";
```

## 9. Что проверить после изменений

После любой правки:

1. обнови страницу overview
2. проверь поиск по новому имени
3. проверь, что узел открылся в правильной ветке
4. проверь, что кружок статуса соответствует ожидаемому цвету
5. проверь, что при клике открывается правильный overview path

Если меняли только данные в БД, пересобирать фронт или backend не нужно.

## 10. Практический safe workflow

Если нужно внести изменения без лишнего риска, держись такого порядка:

1. Найди узел по имени.
2. Сохрани текущие строки `item`, `item_property`, `item_link`, `item_event`.
3. Сначала сделай rename или move на одном тестовом узле.
4. Обнови overview и проверь UI.
5. Только потом добавляй новые узлы пачкой.

Самое безопасное правило здесь:

- названия меняем в `item_property`
- структуру меняем в `item_link`
- статусы меняем в `item_event`
- цвета и подписи статусов меняем в `code_list`

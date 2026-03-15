\set demo_conn 'host=postgres port=5432 dbname=demo user=postgres password=manager'

CREATE EXTENSION IF NOT EXISTS dblink;

\echo Comparing key/shared tables between current DB and demo...

SELECT 'layer_layer' AS table_name,
       (SELECT count(*) FROM public.layer_layer) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "LAYER_NAME" from public.layer_layer')
               AS t("LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "LAYER_NAME" from public.layer_layer')
               AS t("LAYER_NAME" text)
          LEFT JOIN public.layer_layer h
                 ON h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."LAYER_NAME" IS NULL) AS only_in_demo;

SELECT 'users_user' AS table_name,
       (SELECT count(*) FROM public.users_user) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select email from public.users_user')
               AS t(email text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select email from public.users_user')
               AS t(email text)
          LEFT JOIN public.users_user h
                 ON h.email = t.email
         WHERE h.email IS NULL) AS only_in_demo;

SELECT 'user_settings_user_settings' AS table_name,
       (SELECT count(*) FROM public.user_settings_user_settings) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "USER" from public.user_settings_user_settings')
               AS t("USER" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "USER" from public.user_settings_user_settings')
               AS t("USER" text)
          LEFT JOIN public.user_settings_user_settings h
                 ON h."USER" = t."USER"
         WHERE h."USER" IS NULL) AS only_in_demo;

SELECT 'resources_drawer_resources_drawer' AS table_name,
       (SELECT count(*) FROM public.resources_drawer_resources_drawer) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROW_ID" from public.resources_drawer_resources_drawer')
               AS t("ROW_ID" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROW_ID" from public.resources_drawer_resources_drawer')
               AS t("ROW_ID" text)
          LEFT JOIN public.resources_drawer_resources_drawer h
                 ON h."ROW_ID" = t."ROW_ID"
         WHERE h."ROW_ID" IS NULL) AS only_in_demo;

SELECT 'code_list_code_list' AS table_name,
       (SELECT count(*) FROM public.code_list_code_list) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "LIST_TYPE","CULTURE","CODE","LAYER_NAME" from public.code_list_code_list')
               AS t("LIST_TYPE" text, "CULTURE" text, "CODE" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "LIST_TYPE","CULTURE","CODE","LAYER_NAME" from public.code_list_code_list')
               AS t("LIST_TYPE" text, "CULTURE" text, "CODE" text, "LAYER_NAME" text)
          LEFT JOIN public.code_list_code_list h
                 ON h."LIST_TYPE" = t."LIST_TYPE"
                AND h."CULTURE" = t."CULTURE"
                AND h."CODE" = t."CODE"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."CODE" IS NULL) AS only_in_demo;

SELECT 'resources_types_resources_types' AS table_name,
       (SELECT count(*) FROM public.resources_types_resources_types) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ID","CULTURE","LAYER_NAME" from public.resources_types_resources_types')
               AS t("ID" text, "CULTURE" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ID","CULTURE","LAYER_NAME" from public.resources_types_resources_types')
               AS t("ID" text, "CULTURE" text, "LAYER_NAME" text)
          LEFT JOIN public.resources_types_resources_types h
                 ON h."ID" = t."ID"
                AND h."CULTURE" = t."CULTURE"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."ID" IS NULL) AS only_in_demo;

SELECT 'roles_roles' AS table_name,
       (SELECT count(*) FROM public.roles_roles) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROLES_NAME","LAYER_NAME" from public.roles_roles')
               AS t("ROLES_NAME" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROLES_NAME","LAYER_NAME" from public.roles_roles')
               AS t("ROLES_NAME" text, "LAYER_NAME" text)
          LEFT JOIN public.roles_roles h
                 ON h."ROLES_NAME" = t."ROLES_NAME"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."ROLES_NAME" IS NULL) AS only_in_demo;

SELECT 'type_type' AS table_name,
       (SELECT count(*) FROM public.type_type) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TYPE","LAYER_NAME" from public.type_type')
               AS t("TYPE" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TYPE","LAYER_NAME" from public.type_type')
               AS t("TYPE" text, "LAYER_NAME" text)
          LEFT JOIN public.type_type h
                 ON h."TYPE" = t."TYPE"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."TYPE" IS NULL) AS only_in_demo;

SELECT 'type_property_type_property' AS table_name,
       (SELECT count(*) FROM public.type_property_type_property) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TYPE","PROPERTY_NAME","LAYER_NAME" from public.type_property_type_property')
               AS t("TYPE" text, "PROPERTY_NAME" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TYPE","PROPERTY_NAME","LAYER_NAME" from public.type_property_type_property')
               AS t("TYPE" text, "PROPERTY_NAME" text, "LAYER_NAME" text)
          LEFT JOIN public.type_property_type_property h
                 ON h."TYPE" = t."TYPE"
                AND h."PROPERTY_NAME" = t."PROPERTY_NAME"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."PROPERTY_NAME" IS NULL) AS only_in_demo;

SELECT 'uom_uom' AS table_name,
       (SELECT count(*) FROM public.uom_uom) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "CULTURE","NAME","LAYER_NAME" from public.uom_uom')
               AS t("CULTURE" text, "NAME" text, "LAYER_NAME" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "CULTURE","NAME","LAYER_NAME" from public.uom_uom')
               AS t("CULTURE" text, "NAME" text, "LAYER_NAME" text)
          LEFT JOIN public.uom_uom h
                 ON h."CULTURE" = t."CULTURE"
                AND h."NAME" = t."NAME"
                AND h."LAYER_NAME" = t."LAYER_NAME"
         WHERE h."NAME" IS NULL) AS only_in_demo;

SELECT 'item_item' AS table_name,
       (SELECT count(*) FROM public.item_item) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ITEM_ID" from public.item_item')
               AS t("ITEM_ID" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ITEM_ID" from public.item_item')
               AS t("ITEM_ID" text)
          LEFT JOIN public.item_item h
                 ON h."ITEM_ID" = t."ITEM_ID"
         WHERE h."ITEM_ID" IS NULL) AS only_in_demo;

SELECT 'tags_tags' AS table_name,
       (SELECT count(*) FROM public.tags_tags) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TAG_ID" from public.tags_tags')
               AS t("TAG_ID" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "TAG_ID" from public.tags_tags')
               AS t("TAG_ID" text)
          LEFT JOIN public.tags_tags h
                 ON h."TAG_ID" = t."TAG_ID"
         WHERE h."TAG_ID" IS NULL) AS only_in_demo;

SELECT 'bi_dashbord_bi_dashboard' AS table_name,
       (SELECT count(*) FROM public.bi_dashbord_bi_dashboard) AS horasan_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROW_ID" from public.bi_dashbord_bi_dashboard')
               AS t("ROW_ID" text)) AS demo_count,
       (SELECT count(*)
          FROM dblink(:'demo_conn', 'select "ROW_ID" from public.bi_dashbord_bi_dashboard')
               AS t("ROW_ID" text)
          LEFT JOIN public.bi_dashbord_bi_dashboard h
                 ON h."ROW_ID" = t."ROW_ID"
         WHERE h."ROW_ID" IS NULL) AS only_in_demo;

\echo Example of demo rows missing in horasan...

SELECT *
FROM dblink(
       :'demo_conn',
       'select "LAYER_NAME", "DB_SETTINGS"::text from public.layer_layer order by 1'
     ) AS t("LAYER_NAME" text, "DB_SETTINGS" text);

SELECT t.email
FROM dblink(:'demo_conn', 'select email from public.users_user order by email')
     AS t(email text)
LEFT JOIN public.users_user h
       ON h.email = t.email
WHERE h.email IS NULL
ORDER BY t.email
LIMIT 50;

SELECT t."LIST_TYPE", t."CULTURE", t."CODE", t."LAYER_NAME"
FROM dblink(
       :'demo_conn',
       'select "LIST_TYPE","CULTURE","CODE","LAYER_NAME" from public.code_list_code_list order by 1,2,3,4'
     ) AS t("LIST_TYPE" text, "CULTURE" text, "CODE" text, "LAYER_NAME" text)
LEFT JOIN public.code_list_code_list h
       ON h."LIST_TYPE" = t."LIST_TYPE"
      AND h."CULTURE" = t."CULTURE"
      AND h."CODE" = t."CODE"
      AND h."LAYER_NAME" = t."LAYER_NAME"
WHERE h."CODE" IS NULL
ORDER BY 1,2,3,4
LIMIT 50;

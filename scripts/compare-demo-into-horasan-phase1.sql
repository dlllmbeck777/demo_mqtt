\set ON_ERROR_STOP on
\set demo_conn 'host=postgres port=5432 dbname=demo user=postgres password=manager'

CREATE EXTENSION IF NOT EXISTS dblink;

DO $$
BEGIN
    IF current_database() <> 'horasan' THEN
        RAISE EXCEPTION 'Run this script against horasan. Current database is %', current_database();
    END IF;
END $$;

SELECT *
FROM (
    SELECT 'layer_layer' AS table_name,
           (SELECT count(*) FROM public.layer_layer) AS horasan_count,
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "LAYER_NAME" from public.layer_layer') AS t("LAYER_NAME" text)) AS demo_count,
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "LAYER_NAME" from public.layer_layer') AS t("LAYER_NAME" text)
              LEFT JOIN public.layer_layer h ON h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h."LAYER_NAME" IS NULL) AS only_in_demo
    UNION ALL
    SELECT 'roles_property_roles_property',
           (SELECT count(*) FROM public.roles_property_roles_property),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "ROW_ID" from public.roles_property_roles_property') AS t("ROW_ID" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "ROW_ID" from public.roles_property_roles_property') AS t("ROW_ID" text)
              LEFT JOIN public.roles_property_roles_property h ON h."ROW_ID" = t."ROW_ID"
             WHERE h."ROW_ID" IS NULL)
    UNION ALL
    SELECT 'roles_roles',
           (SELECT count(*) FROM public.roles_roles),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "ROLES_NAME","LAYER_NAME" from public.roles_roles') AS t("ROLES_NAME" text, "LAYER_NAME" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "ROLES_NAME","LAYER_NAME" from public.roles_roles') AS t("ROLES_NAME" text, "LAYER_NAME" text)
              LEFT JOIN public.roles_roles h
                     ON h."ROLES_NAME" = t."ROLES_NAME"
                    AND h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h."ROLES_ID" IS NULL)
    UNION ALL
    SELECT 'users_user',
           (SELECT count(*) FROM public.users_user),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select email from public.users_user') AS t(email text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select email from public.users_user') AS t(email text)
              LEFT JOIN public.users_user h ON h.email = t.email
             WHERE h.email IS NULL)
    UNION ALL
    SELECT 'users_user_layer_name',
           (SELECT count(*) FROM public.users_user_layer_name),
           (SELECT count(*)
              FROM dblink(
                     :'demo_conn',
                     'select u.email, l.layer_id from public.users_user_layer_name l join public.users_user u on u.id = l.user_id'
                   ) AS t(email text, layer_id text)),
           (SELECT count(*)
              FROM dblink(
                     :'demo_conn',
                     'select u.email, l.layer_id from public.users_user_layer_name l join public.users_user u on u.id = l.user_id'
                   ) AS t(email text, layer_id text)
              JOIN public.users_user u ON u.email = t.email
              LEFT JOIN public.users_user_layer_name h
                     ON h.user_id = u.id
                    AND h.layer_id = t.layer_id
             WHERE h.id IS NULL)
    UNION ALL
    SELECT 'user_settings_user_settings',
           (SELECT count(*) FROM public.user_settings_user_settings),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "USER" from public.user_settings_user_settings') AS t("USER" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "USER" from public.user_settings_user_settings') AS t("USER" text)
              LEFT JOIN public.user_settings_user_settings h ON h."USER" = t."USER"
             WHERE h."USER" IS NULL)
    UNION ALL
    SELECT 'resources_types_resources_types',
           (SELECT count(*) FROM public.resources_types_resources_types),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "ID","CULTURE","LAYER_NAME" from public.resources_types_resources_types') AS t("ID" text, "CULTURE" text, "LAYER_NAME" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "ID","CULTURE","LAYER_NAME" from public.resources_types_resources_types') AS t("ID" text, "CULTURE" text, "LAYER_NAME" text)
              LEFT JOIN public.resources_types_resources_types h
                     ON h."ID" = t."ID"
                    AND h."CULTURE" = t."CULTURE"
                    AND h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h.id IS NULL)
    UNION ALL
    SELECT 'code_list_code_list',
           (SELECT count(*) FROM public.code_list_code_list),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "LIST_TYPE","CULTURE","CODE","LAYER_NAME" from public.code_list_code_list') AS t("LIST_TYPE" text, "CULTURE" text, "CODE" text, "LAYER_NAME" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "LIST_TYPE","CULTURE","CODE","LAYER_NAME" from public.code_list_code_list') AS t("LIST_TYPE" text, "CULTURE" text, "CODE" text, "LAYER_NAME" text)
              LEFT JOIN public.code_list_code_list h
                     ON h."LIST_TYPE" = t."LIST_TYPE"
                    AND h."CULTURE" = t."CULTURE"
                    AND h."CODE" = t."CODE"
                    AND h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h."ROW_ID" IS NULL)
    UNION ALL
    SELECT 'type_type',
           (SELECT count(*) FROM public.type_type),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "TYPE" from public.type_type') AS t("TYPE" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "TYPE" from public.type_type') AS t("TYPE" text)
              LEFT JOIN public.type_type h ON h."TYPE" = t."TYPE"
             WHERE h."TYPE" IS NULL)
    UNION ALL
    SELECT 'type_property_type_property',
           (SELECT count(*) FROM public.type_property_type_property),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "TYPE","PROPERTY_NAME","LAYER_NAME" from public.type_property_type_property') AS t("TYPE" text, "PROPERTY_NAME" text, "LAYER_NAME" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "TYPE","PROPERTY_NAME","LAYER_NAME" from public.type_property_type_property') AS t("TYPE" text, "PROPERTY_NAME" text, "LAYER_NAME" text)
              LEFT JOIN public.type_property_type_property h
                     ON h."TYPE" = t."TYPE"
                    AND h."PROPERTY_NAME" = t."PROPERTY_NAME"
                    AND h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h.id IS NULL)
    UNION ALL
    SELECT 'uom_uom',
           (SELECT count(*) FROM public.uom_uom),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "CULTURE","NAME","LAYER_NAME" from public.uom_uom') AS t("CULTURE" text, "NAME" text, "LAYER_NAME" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "CULTURE","NAME","LAYER_NAME" from public.uom_uom') AS t("CULTURE" text, "NAME" text, "LAYER_NAME" text)
              LEFT JOIN public.uom_uom h
                     ON h."CULTURE" IS NOT DISTINCT FROM t."CULTURE"
                    AND h."NAME" = t."NAME"
                    AND h."LAYER_NAME" = t."LAYER_NAME"
             WHERE h."ROW_ID" IS NULL)
    UNION ALL
    SELECT 'resources_drawer_resources_drawer',
           (SELECT count(*) FROM public.resources_drawer_resources_drawer),
           (SELECT count(*) FROM dblink(:'demo_conn', 'select "ROW_ID" from public.resources_drawer_resources_drawer') AS t("ROW_ID" text)),
           (SELECT count(*)
              FROM dblink(:'demo_conn', 'select "ROW_ID" from public.resources_drawer_resources_drawer') AS t("ROW_ID" text)
              LEFT JOIN public.resources_drawer_resources_drawer h ON h."ROW_ID" = t."ROW_ID"
             WHERE h."ROW_ID" IS NULL)
) AS counts
ORDER BY table_name;

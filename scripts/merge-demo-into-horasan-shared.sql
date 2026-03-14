\set ON_ERROR_STOP on
\set demo_conn 'host=postgres port=5432 dbname=demo user=postgres password=manager'

CREATE EXTENSION IF NOT EXISTS dblink;

DO $$
BEGIN
    IF current_database() <> 'horasan' THEN
        RAISE EXCEPTION 'Run this script against horasan. Current database is %', current_database();
    END IF;
END $$;

BEGIN;

\echo Inserting missing layer rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "LAYER_NAME","DATA_SOURCE","LAYER_LEVEL","DB_SETTINGS"::text,"LAST_UPDT_USER","LAST_UPDT_DATE","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
          from public.layer_layer$$
    ) AS t(
        "LAYER_NAME" text,
        "DATA_SOURCE" text,
        "LAYER_LEVEL" text,
        "DB_SETTINGS" text,
        "LAST_UPDT_USER" text,
        "LAST_UPDT_DATE" bigint,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "REV_GRP_ID" text
    )
),
inserted AS (
    INSERT INTO public.layer_layer (
        "LAYER_NAME","DATA_SOURCE","LAYER_LEVEL","DB_SETTINGS","LAST_UPDT_USER",
        "LAST_UPDT_DATE","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
    )
    SELECT
        s."LAYER_NAME",
        s."DATA_SOURCE",
        s."LAYER_LEVEL",
        CASE WHEN s."DB_SETTINGS" IS NULL THEN NULL ELSE s."DB_SETTINGS"::jsonb END,
        s."LAST_UPDT_USER",
        s."LAST_UPDT_DATE",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."REV_GRP_ID"
    FROM src s
    LEFT JOIN public.layer_layer h
           ON h."LAYER_NAME" = s."LAYER_NAME"
    WHERE h."LAYER_NAME" IS NULL
    RETURNING 1
)
SELECT 'layer_layer' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing roles_property rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "ROLES_TYPES","ROLES_INFO","CREATE","READ","UPDATE","DELETE","LAST_UPDT_DATE","PARENT","ROW_ID"
          from public.roles_property_roles_property$$
    ) AS t(
        "ROLES_TYPES" text,
        "ROLES_INFO" text,
        "CREATE" boolean,
        "READ" boolean,
        "UPDATE" boolean,
        "DELETE" boolean,
        "LAST_UPDT_DATE" bigint,
        "PARENT" text,
        "ROW_ID" text
    )
),
inserted AS (
    INSERT INTO public.roles_property_roles_property (
        "ROLES_TYPES","ROLES_INFO","CREATE","READ","UPDATE","DELETE",
        "LAST_UPDT_DATE","PARENT","ROW_ID"
    )
    SELECT
        s."ROLES_TYPES",
        s."ROLES_INFO",
        s."CREATE",
        s."READ",
        s."UPDATE",
        s."DELETE",
        s."LAST_UPDT_DATE",
        s."PARENT",
        s."ROW_ID"
    FROM src s
    LEFT JOIN public.roles_property_roles_property h
           ON h."ROW_ID" = s."ROW_ID"
    WHERE h."ROW_ID" IS NULL
    RETURNING 1
)
SELECT 'roles_property_roles_property' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing roles rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "ROLES_ID","ROLES_NAME","LAYER_NAME","LAST_UPDATE_USER","LAST_UPDT_DATE"
          from public.roles_roles$$
    ) AS t(
        "ROLES_ID" text,
        "ROLES_NAME" text,
        "LAYER_NAME" text,
        "LAST_UPDATE_USER" text,
        "LAST_UPDT_DATE" bigint
    )
),
inserted AS (
    INSERT INTO public.roles_roles (
        "ROLES_ID","ROLES_NAME","LAYER_NAME","LAST_UPDATE_USER","LAST_UPDT_DATE"
    )
    SELECT
        s."ROLES_ID",
        s."ROLES_NAME",
        s."LAYER_NAME",
        s."LAST_UPDATE_USER",
        s."LAST_UPDT_DATE"
    FROM src s
    LEFT JOIN public.roles_roles h
           ON h."ROLES_NAME" = s."ROLES_NAME"
          AND h."LAYER_NAME" = s."LAYER_NAME"
    LEFT JOIN public.roles_roles hid
           ON hid."ROLES_ID" = s."ROLES_ID"
    WHERE h."ROLES_ID" IS NULL
      AND hid."ROLES_ID" IS NULL
    RETURNING 1
)
SELECT 'roles_roles' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing role-property links...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select r."ROLES_NAME", r."LAYER_NAME", l.roles_property_id
          from public."roles_roles_PROPERTY_ID" l
          join public.roles_roles r on r."ROLES_ID" = l.roles_id$$
    ) AS t(
        "ROLES_NAME" text,
        "LAYER_NAME" text,
        roles_property_id text
    )
),
inserted AS (
    INSERT INTO public."roles_roles_PROPERTY_ID" (
        roles_id,
        roles_property_id
    )
    SELECT
        r."ROLES_ID",
        s.roles_property_id
    FROM src s
    JOIN public.roles_roles r
      ON r."ROLES_NAME" = s."ROLES_NAME"
     AND r."LAYER_NAME" = s."LAYER_NAME"
    JOIN public.roles_property_roles_property rp
      ON rp."ROW_ID" = s.roles_property_id
    LEFT JOIN public."roles_roles_PROPERTY_ID" h
           ON h.roles_id = r."ROLES_ID"
          AND h.roles_property_id = s.roles_property_id
    WHERE h.id IS NULL
    RETURNING 1
)
SELECT 'roles_roles_PROPERTY_ID' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing users...
WITH src_roles AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "ROLES_ID","ROLES_NAME","LAYER_NAME"
          from public.roles_roles$$
    ) AS t(
        "ROLES_ID" text,
        "ROLES_NAME" text,
        "LAYER_NAME" text
    )
),
src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select password,last_login,first_name,last_name,email,is_staff,is_superuser,is_active,is_admin,is_client,is_employee,first_login,service_admin,forget_password_token,activation_key::text,confirmed_email,role_id,active_layer_id,address_01,address_02,birth_day,birth_month,birth_year,country,state,designation,facebook,linkedin,note,phone_number,twitter,phone_key,date_joined,date_updated
          from public.users_user$$
    ) AS t(
        password text,
        last_login timestamptz,
        first_name text,
        last_name text,
        email text,
        is_staff boolean,
        is_superuser boolean,
        is_active boolean,
        is_admin boolean,
        is_client boolean,
        is_employee boolean,
        first_login boolean,
        service_admin boolean,
        forget_password_token text,
        activation_key text,
        confirmed_email boolean,
        role_id text,
        active_layer_id text,
        address_01 text,
        address_02 text,
        birth_day text,
        birth_month text,
        birth_year text,
        country text,
        state text,
        designation text,
        facebook text,
        linkedin text,
        note text,
        phone_number text,
        twitter text,
        phone_key text,
        date_joined bigint,
        date_updated bigint
    )
),
inserted AS (
    INSERT INTO public.users_user (
        password,last_login,first_name,last_name,email,is_staff,is_superuser,is_active,
        is_admin,is_client,is_employee,first_login,service_admin,forget_password_token,
        activation_key,confirmed_email,role_id,active_layer_id,address_01,address_02,
        birth_day,birth_month,birth_year,country,state,designation,facebook,linkedin,
        note,phone_number,twitter,phone_key,date_joined,date_updated
    )
    SELECT
        s.password,
        s.last_login,
        s.first_name,
        s.last_name,
        s.email,
        s.is_staff,
        s.is_superuser,
        s.is_active,
        s.is_admin,
        s.is_client,
        s.is_employee,
        s.first_login,
        s.service_admin,
        s.forget_password_token,
        s.activation_key::uuid,
        s.confirmed_email,
        r."ROLES_ID",
        CASE
            WHEN s.active_layer_id IS NULL THEN NULL
            WHEN EXISTS (
                SELECT 1
                FROM public.layer_layer l
                WHERE l."LAYER_NAME" = s.active_layer_id
            ) THEN s.active_layer_id
            ELSE NULL
        END,
        s.address_01,
        s.address_02,
        s.birth_day,
        s.birth_month,
        s.birth_year,
        s.country,
        s.state,
        s.designation,
        s.facebook,
        s.linkedin,
        s.note,
        s.phone_number,
        s.twitter,
        s.phone_key,
        s.date_joined,
        s.date_updated
    FROM src s
    LEFT JOIN src_roles sr
           ON sr."ROLES_ID" = s.role_id
    LEFT JOIN public.roles_roles r
           ON r."ROLES_NAME" = sr."ROLES_NAME"
          AND r."LAYER_NAME" = sr."LAYER_NAME"
    LEFT JOIN public.users_user h
           ON h.email = s.email
    WHERE h.email IS NULL
    RETURNING 1
)
SELECT 'users_user' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing user-layer links...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select u.email, l.layer_id
          from public.users_user_layer_name l
          join public.users_user u on u.id = l.user_id$$
    ) AS t(
        email text,
        layer_id text
    )
),
inserted AS (
    INSERT INTO public.users_user_layer_name (
        user_id,
        layer_id
    )
    SELECT
        u.id,
        s.layer_id
    FROM src s
    JOIN public.users_user u
      ON u.email = s.email
    JOIN public.layer_layer l
      ON l."LAYER_NAME" = s.layer_id
    LEFT JOIN public.users_user_layer_name h
           ON h.user_id = u.id
          AND h.layer_id = s.layer_id
    WHERE h.id IS NULL
    RETURNING 1
)
SELECT 'users_user_layer_name' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing user settings...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select email_notification,font_size,font_weight,overview_orientation,thema,language,full_screen,"ROW_ID","USER",drawer_settings::text,item_settings::text,others_settings::text,overview_settings::text,alarm_notification
          from public.user_settings_user_settings$$
    ) AS t(
        email_notification boolean,
        font_size numeric(28,12),
        font_weight numeric(28,12),
        overview_orientation text,
        thema text,
        language text,
        full_screen boolean,
        "ROW_ID" text,
        "USER" text,
        drawer_settings text,
        item_settings text,
        others_settings text,
        overview_settings text,
        alarm_notification boolean
    )
),
inserted AS (
    INSERT INTO public.user_settings_user_settings (
        email_notification,font_size,font_weight,overview_orientation,thema,language,
        full_screen,"ROW_ID","USER",drawer_settings,item_settings,others_settings,
        overview_settings,alarm_notification
    )
    SELECT
        s.email_notification,
        s.font_size,
        s.font_weight,
        s.overview_orientation,
        s.thema,
        s.language,
        s.full_screen,
        s."ROW_ID",
        s."USER",
        CASE WHEN s.drawer_settings IS NULL THEN NULL ELSE s.drawer_settings::jsonb END,
        CASE WHEN s.item_settings IS NULL THEN NULL ELSE s.item_settings::jsonb END,
        CASE WHEN s.others_settings IS NULL THEN NULL ELSE s.others_settings::jsonb END,
        CASE WHEN s.overview_settings IS NULL THEN NULL ELSE s.overview_settings::jsonb END,
        s.alarm_notification
    FROM src s
    LEFT JOIN public.user_settings_user_settings h
           ON h."USER" = s."USER"
    WHERE h."USER" IS NULL
    RETURNING 1
)
SELECT 'user_settings_user_settings' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing resources types...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "CULTURE","ID","SHORT_LABEL","MOBILE_LABEL","ICON","PARENT","LAYER_NAME","HIDDEN","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","SORT_ORDER","REV_GRP_ID","DESCRIPTION","LAST_UPDT_DATE"
          from public.resources_types_resources_types$$
    ) AS t(
        "CULTURE" text,
        "ID" text,
        "SHORT_LABEL" text,
        "MOBILE_LABEL" text,
        "ICON" text,
        "PARENT" text,
        "LAYER_NAME" text,
        "HIDDEN" text,
        "LAST_UPDT_USER" text,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "SORT_ORDER" numeric(18,0),
        "REV_GRP_ID" text,
        "DESCRIPTION" text,
        "LAST_UPDT_DATE" bigint
    )
),
inserted AS (
    INSERT INTO public.resources_types_resources_types (
        "CULTURE","ID","SHORT_LABEL","MOBILE_LABEL","ICON","PARENT","LAYER_NAME","HIDDEN",
        "LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","SORT_ORDER","REV_GRP_ID",
        "DESCRIPTION","LAST_UPDT_DATE"
    )
    SELECT
        s."CULTURE",
        s."ID",
        s."SHORT_LABEL",
        s."MOBILE_LABEL",
        s."ICON",
        s."PARENT",
        s."LAYER_NAME",
        s."HIDDEN",
        s."LAST_UPDT_USER",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."SORT_ORDER",
        s."REV_GRP_ID",
        s."DESCRIPTION",
        s."LAST_UPDT_DATE"
    FROM src s
    LEFT JOIN public.resources_types_resources_types h
           ON h."ID" = s."ID"
          AND h."CULTURE" = s."CULTURE"
          AND h."LAYER_NAME" = s."LAYER_NAME"
    WHERE h.id IS NULL
    RETURNING 1
)
SELECT 'resources_types_resources_types' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing code list rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "LIST_TYPE","CULTURE","CODE","CODE_TEXT","PARENT","LEGACY_CODE","VAL1","VAL2","VAL3","VAL4","VAL5","VAL6","VAL7","VAL8","VAL9","VAL10","DATE1","DATE2","DATE3","DATE4","DATE5","CHAR1","CHAR2","CHAR3","CHAR4","CHAR5","LAYER_NAME","DESCRIPTION_ID","HIDDEN","LAST_UPDT_USER","LAST_UPDT_DATE","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
          from public.code_list_code_list$$
    ) AS t(
        "LIST_TYPE" text,
        "CULTURE" text,
        "CODE" text,
        "CODE_TEXT" text,
        "PARENT" text,
        "LEGACY_CODE" text,
        "VAL1" numeric(28,12),
        "VAL2" numeric(28,12),
        "VAL3" numeric(28,12),
        "VAL4" numeric(28,12),
        "VAL5" numeric(28,12),
        "VAL6" numeric(28,12),
        "VAL7" numeric(28,12),
        "VAL8" numeric(28,12),
        "VAL9" numeric(28,12),
        "VAL10" numeric(28,12),
        "DATE1" date,
        "DATE2" date,
        "DATE3" date,
        "DATE4" date,
        "DATE5" date,
        "CHAR1" text,
        "CHAR2" text,
        "CHAR3" text,
        "CHAR4" text,
        "CHAR5" text,
        "LAYER_NAME" text,
        "DESCRIPTION_ID" text,
        "HIDDEN" text,
        "LAST_UPDT_USER" text,
        "LAST_UPDT_DATE" bigint,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "REV_GRP_ID" text
    )
),
inserted AS (
    INSERT INTO public.code_list_code_list (
        "LIST_TYPE","CULTURE","CODE","CODE_TEXT","PARENT","LEGACY_CODE",
        "VAL1","VAL2","VAL3","VAL4","VAL5","VAL6","VAL7","VAL8","VAL9","VAL10",
        "DATE1","DATE2","DATE3","DATE4","DATE5","CHAR1","CHAR2","CHAR3","CHAR4","CHAR5",
        "LAYER_NAME","DESCRIPTION_ID","HIDDEN","LAST_UPDT_USER","LAST_UPDT_DATE",
        "VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
    )
    SELECT
        s."LIST_TYPE",
        s."CULTURE",
        s."CODE",
        s."CODE_TEXT",
        s."PARENT",
        s."LEGACY_CODE",
        s."VAL1",
        s."VAL2",
        s."VAL3",
        s."VAL4",
        s."VAL5",
        s."VAL6",
        s."VAL7",
        s."VAL8",
        s."VAL9",
        s."VAL10",
        s."DATE1",
        s."DATE2",
        s."DATE3",
        s."DATE4",
        s."DATE5",
        s."CHAR1",
        s."CHAR2",
        s."CHAR3",
        s."CHAR4",
        s."CHAR5",
        s."LAYER_NAME",
        s."DESCRIPTION_ID",
        s."HIDDEN",
        s."LAST_UPDT_USER",
        s."LAST_UPDT_DATE",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."REV_GRP_ID"
    FROM src s
    LEFT JOIN public.code_list_code_list h
           ON h."LIST_TYPE" = s."LIST_TYPE"
          AND h."CULTURE" = s."CULTURE"
          AND h."CODE" = s."CODE"
          AND h."LAYER_NAME" = s."LAYER_NAME"
    LEFT JOIN public.code_list_code_list hid
           ON hid."ROW_ID" = s."ROW_ID"
    WHERE h."ROW_ID" IS NULL
      AND hid."ROW_ID" IS NULL
    RETURNING 1
)
SELECT 'code_list_code_list' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing type rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "TYPE","TYPE_CLASS","LABEL_ID","CHANGE_INTERVAL","LAYER_NAME","DESCRIPTION_ID","HIDDEN","BASE_TYPE","CODE_LIST_TYPE","IS_QUICK_LINK","PROP_TBL_NAME","BASE_TBL_NAME","TAG_TBL_NAME","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID","LAST_UPDT_DATE"
          from public.type_type$$
    ) AS t(
        "TYPE" text,
        "TYPE_CLASS" text,
        "LABEL_ID" text,
        "CHANGE_INTERVAL" text,
        "LAYER_NAME" text,
        "DESCRIPTION_ID" text,
        "HIDDEN" text,
        "BASE_TYPE" text,
        "CODE_LIST_TYPE" text,
        "IS_QUICK_LINK" text,
        "PROP_TBL_NAME" text,
        "BASE_TBL_NAME" text,
        "TAG_TBL_NAME" text,
        "LAST_UPDT_USER" text,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "REV_GRP_ID" text,
        "LAST_UPDT_DATE" bigint
    )
),
inserted AS (
    INSERT INTO public.type_type (
        "TYPE","TYPE_CLASS","LABEL_ID","CHANGE_INTERVAL","LAYER_NAME","DESCRIPTION_ID",
        "HIDDEN","BASE_TYPE","CODE_LIST_TYPE","IS_QUICK_LINK","PROP_TBL_NAME",
        "BASE_TBL_NAME","TAG_TBL_NAME","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID",
        "STATUS","REV_GRP_ID","LAST_UPDT_DATE"
    )
    SELECT
        s."TYPE",
        s."TYPE_CLASS",
        s."LABEL_ID",
        s."CHANGE_INTERVAL",
        s."LAYER_NAME",
        s."DESCRIPTION_ID",
        s."HIDDEN",
        s."BASE_TYPE",
        s."CODE_LIST_TYPE",
        s."IS_QUICK_LINK",
        s."PROP_TBL_NAME",
        s."BASE_TBL_NAME",
        s."TAG_TBL_NAME",
        s."LAST_UPDT_USER",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."REV_GRP_ID",
        s."LAST_UPDT_DATE"
    FROM src s
    LEFT JOIN public.type_type h
           ON h."TYPE" = s."TYPE"
    WHERE h."TYPE" IS NULL
    RETURNING 1
)
SELECT 'type_type' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing type properties...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "TYPE","PROPERTY_NAME","PROP_GRP","PROP_GRP_PRNT","LABEL_ID","TABLE_NAME","COLUMN_NAME","PROPERTY_TYPE","PROPERTY_CLASS","UNICODE","CODE_LIST","CODE_LIST_FLTR","CODE_LIST_LVL","PARENT_CL_PROP","VALUE_FILTER","UI_EDIT_CLASS","SORT_ORDER","MANDATORY","HIDDEN","IS_KEY","LENGTH","DECIMALS","UOM","CHANGE_INTERVAL","DEFAULT_VALUE","LAYER_NAME","DESCRIPTION_ID","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID","PROP_UNIQUE","ALLOW_MULTI_EDIT","DEF_ACCUM_FUNC","READ_ONLY","LAST_UPDT_DATE"
          from public.type_property_type_property$$
    ) AS t(
        "TYPE" text,
        "PROPERTY_NAME" text,
        "PROP_GRP" text,
        "PROP_GRP_PRNT" text,
        "LABEL_ID" text,
        "TABLE_NAME" text,
        "COLUMN_NAME" text,
        "PROPERTY_TYPE" text,
        "PROPERTY_CLASS" text,
        "UNICODE" text,
        "CODE_LIST" text,
        "CODE_LIST_FLTR" text,
        "CODE_LIST_LVL" numeric(18,0),
        "PARENT_CL_PROP" text,
        "VALUE_FILTER" text,
        "UI_EDIT_CLASS" text,
        "SORT_ORDER" numeric(18,0),
        "MANDATORY" text,
        "HIDDEN" text,
        "IS_KEY" text,
        "LENGTH" numeric(28,12),
        "DECIMALS" numeric(28,12),
        "UOM" text,
        "CHANGE_INTERVAL" text,
        "DEFAULT_VALUE" text,
        "LAYER_NAME" text,
        "DESCRIPTION_ID" text,
        "LAST_UPDT_USER" text,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "REV_GRP_ID" text,
        "PROP_UNIQUE" text,
        "ALLOW_MULTI_EDIT" text,
        "DEF_ACCUM_FUNC" text,
        "READ_ONLY" text,
        "LAST_UPDT_DATE" bigint
    )
),
inserted AS (
    INSERT INTO public.type_property_type_property (
        "TYPE","PROPERTY_NAME","PROP_GRP","PROP_GRP_PRNT","LABEL_ID","TABLE_NAME",
        "COLUMN_NAME","PROPERTY_TYPE","PROPERTY_CLASS","UNICODE","CODE_LIST",
        "CODE_LIST_FLTR","CODE_LIST_LVL","PARENT_CL_PROP","VALUE_FILTER",
        "UI_EDIT_CLASS","SORT_ORDER","MANDATORY","HIDDEN","IS_KEY","LENGTH",
        "DECIMALS","UOM","CHANGE_INTERVAL","DEFAULT_VALUE","LAYER_NAME",
        "DESCRIPTION_ID","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS",
        "REV_GRP_ID","PROP_UNIQUE","ALLOW_MULTI_EDIT","DEF_ACCUM_FUNC",
        "READ_ONLY","LAST_UPDT_DATE"
    )
    SELECT
        s."TYPE",
        s."PROPERTY_NAME",
        s."PROP_GRP",
        s."PROP_GRP_PRNT",
        s."LABEL_ID",
        s."TABLE_NAME",
        s."COLUMN_NAME",
        s."PROPERTY_TYPE",
        s."PROPERTY_CLASS",
        s."UNICODE",
        s."CODE_LIST",
        s."CODE_LIST_FLTR",
        s."CODE_LIST_LVL",
        s."PARENT_CL_PROP",
        s."VALUE_FILTER",
        s."UI_EDIT_CLASS",
        s."SORT_ORDER",
        s."MANDATORY",
        s."HIDDEN",
        s."IS_KEY",
        s."LENGTH",
        s."DECIMALS",
        s."UOM",
        s."CHANGE_INTERVAL",
        s."DEFAULT_VALUE",
        s."LAYER_NAME",
        s."DESCRIPTION_ID",
        s."LAST_UPDT_USER",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."REV_GRP_ID",
        s."PROP_UNIQUE",
        s."ALLOW_MULTI_EDIT",
        s."DEF_ACCUM_FUNC",
        s."READ_ONLY",
        s."LAST_UPDT_DATE"
    FROM src s
    LEFT JOIN public.type_property_type_property h
           ON h."TYPE" = s."TYPE"
          AND h."PROPERTY_NAME" = s."PROPERTY_NAME"
          AND h."LAYER_NAME" = s."LAYER_NAME"
    WHERE h.id IS NULL
    RETURNING 1
)
SELECT 'type_property_type_property' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing uom rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "CULTURE","NAME","QUANTITY_TYPE","CATALOG_NAME","CATALOG_SYMBOL","RP66_SYMBOL","BASE_UNIT","A","B","C","D","RESULT","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","LAYER_NAME","REV_GRP_ID","CODE","LAST_UPDT_DATE"
          from public.uom_uom$$
    ) AS t(
        "CULTURE" text,
        "NAME" text,
        "QUANTITY_TYPE" text,
        "CATALOG_NAME" text,
        "CATALOG_SYMBOL" text,
        "RP66_SYMBOL" text,
        "BASE_UNIT" text,
        "A" text,
        "B" text,
        "C" text,
        "D" text,
        "RESULT" text,
        "LAST_UPDT_USER" text,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "LAYER_NAME" text,
        "REV_GRP_ID" text,
        "CODE" text,
        "LAST_UPDT_DATE" bigint
    )
),
inserted AS (
    INSERT INTO public.uom_uom (
        "CULTURE","NAME","QUANTITY_TYPE","CATALOG_NAME","CATALOG_SYMBOL","RP66_SYMBOL",
        "BASE_UNIT","A","B","C","D","RESULT","LAST_UPDT_USER","VERSION","DB_ID",
        "ROW_ID","STATUS","LAYER_NAME","REV_GRP_ID","CODE","LAST_UPDT_DATE"
    )
    SELECT
        s."CULTURE",
        s."NAME",
        s."QUANTITY_TYPE",
        s."CATALOG_NAME",
        s."CATALOG_SYMBOL",
        s."RP66_SYMBOL",
        s."BASE_UNIT",
        s."A",
        s."B",
        s."C",
        s."D",
        s."RESULT",
        s."LAST_UPDT_USER",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."LAYER_NAME",
        s."REV_GRP_ID",
        s."CODE",
        s."LAST_UPDT_DATE"
    FROM src s
    LEFT JOIN public.uom_uom h
           ON h."CULTURE" IS NOT DISTINCT FROM s."CULTURE"
          AND h."NAME" = s."NAME"
          AND h."LAYER_NAME" = s."LAYER_NAME"
    LEFT JOIN public.uom_uom hid
           ON hid."ROW_ID" = s."ROW_ID"
    WHERE h."ROW_ID" IS NULL
      AND hid."ROW_ID" IS NULL
    RETURNING 1
)
SELECT 'uom_uom' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing drawer rows...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select "CULTURE","ID","SHORT_LABEL","MOBILE_LABEL","LAYER_LEVEL","ICON","LAYER_NAME","IS_ITEM","HIDDEN","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS","SORT_ORDER","REV_GRP_ID","LAST_UPDT_DATE","PATH"
          from public.resources_drawer_resources_drawer$$
    ) AS t(
        "CULTURE" text,
        "ID" text,
        "SHORT_LABEL" text,
        "MOBILE_LABEL" text,
        "LAYER_LEVEL" numeric(18,0),
        "ICON" text,
        "LAYER_NAME" text,
        "IS_ITEM" text,
        "HIDDEN" text,
        "LAST_UPDT_USER" text,
        "VERSION" text,
        "DB_ID" text,
        "ROW_ID" text,
        "STATUS" text,
        "SORT_ORDER" numeric(18,0),
        "REV_GRP_ID" text,
        "LAST_UPDT_DATE" bigint,
        "PATH" text
    )
),
inserted AS (
    INSERT INTO public.resources_drawer_resources_drawer (
        "CULTURE","ID","SHORT_LABEL","MOBILE_LABEL","LAYER_LEVEL","ICON","LAYER_NAME",
        "IS_ITEM","HIDDEN","LAST_UPDT_USER","VERSION","DB_ID","ROW_ID","STATUS",
        "SORT_ORDER","REV_GRP_ID","LAST_UPDT_DATE","PATH"
    )
    SELECT
        s."CULTURE",
        s."ID",
        s."SHORT_LABEL",
        s."MOBILE_LABEL",
        s."LAYER_LEVEL",
        s."ICON",
        s."LAYER_NAME",
        s."IS_ITEM",
        s."HIDDEN",
        s."LAST_UPDT_USER",
        s."VERSION",
        s."DB_ID",
        s."ROW_ID",
        s."STATUS",
        s."SORT_ORDER",
        s."REV_GRP_ID",
        s."LAST_UPDT_DATE",
        s."PATH"
    FROM src s
    LEFT JOIN public.resources_drawer_resources_drawer h
           ON h."ROW_ID" = s."ROW_ID"
    WHERE h."ROW_ID" IS NULL
    RETURNING 1
)
SELECT 'resources_drawer_resources_drawer' AS table_name, count(*) AS inserted_rows FROM inserted;

\echo Inserting missing drawer links...
WITH src AS (
    SELECT *
    FROM dblink(
        :'demo_conn',
        $$select p."ROW_ID" as from_row_id, c."ROW_ID" as to_row_id
          from public."resources_drawer_resources_drawer_CHILD" l
          join public.resources_drawer_resources_drawer p on p.id = l.from_resources_drawer_id
          join public.resources_drawer_resources_drawer c on c.id = l.to_resources_drawer_id$$
    ) AS t(
        from_row_id text,
        to_row_id text
    )
),
inserted AS (
    INSERT INTO public."resources_drawer_resources_drawer_CHILD" (
        from_resources_drawer_id,
        to_resources_drawer_id
    )
    SELECT
        fp.id,
        tp.id
    FROM src s
    JOIN public.resources_drawer_resources_drawer fp
      ON fp."ROW_ID" = s.from_row_id
    JOIN public.resources_drawer_resources_drawer tp
      ON tp."ROW_ID" = s.to_row_id
    LEFT JOIN public."resources_drawer_resources_drawer_CHILD" h
           ON h.from_resources_drawer_id = fp.id
          AND h.to_resources_drawer_id = tp.id
    WHERE h.id IS NULL
    RETURNING 1
)
SELECT 'resources_drawer_resources_drawer_CHILD' AS table_name, count(*) AS inserted_rows FROM inserted;

COMMIT;

\echo Shared/control merge completed. Business tables (item/tags/dashboards) were intentionally not merged.

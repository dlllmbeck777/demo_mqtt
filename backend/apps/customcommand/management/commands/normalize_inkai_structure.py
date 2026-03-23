import json
import re
import uuid
from copy import deepcopy

from django.core.management.base import BaseCommand, CommandError
from django.core.management.color import no_style
from django.db import connection, transaction
from django.utils import timezone

from apps.bi_dashbord.models import bi_dashboard
from apps.bi_layouts.models import bi_layout
from apps.bi_widget_property.models import bi_widget_property
from apps.bi_widgets.models import bi_widget
from apps.item.models import item
from apps.item_link.models import item_link
from apps.item_property.models import item_property
from apps.layer.helpers import change_db, to_layerDb
from apps.tags.models import tags
from apps.tags_calculated.models import tags_calculated


LOOKALIKE_MAP = str.maketrans(
    {
        "\u0410": "A",
        "\u0412": "B",
        "\u0421": "C",
        "\u0415": "E",
        "\u041d": "H",
        "\u041a": "K",
        "\u041c": "M",
        "\u041e": "O",
        "\u0420": "P",
        "\u0422": "T",
        "\u0423": "Y",
        "\u0425": "X",
        "\u0430": "a",
        "\u0432": "b",
        "\u0441": "c",
        "\u0435": "e",
        "\u043d": "h",
        "\u043a": "k",
        "\u043c": "m",
        "\u043e": "o",
        "\u0440": "p",
        "\u0442": "t",
        "\u0443": "y",
        "\u0445": "x",
        "\u041f": "P",
        "\u043f": "p",
        "\u0418": "I",
        "\u0438": "i",
        "\u0417": "Z",
        "\u0437": "z",
        "\u041b": "L",
        "\u043b": "l",
        "\u2116": "NO",
    }
)


POZ = "\u043f\u043e\u0437."


SECTION_SPECS = [
    {
        "name": "OPZ",
        "aliases": {"THCNO1", "OPZ"},
        "rename_map": {
            "THC1P1": "P-2A",
            "THC1P2": "P-2B",
            "THC1P3": "P-2C",
            "THC1P4": "P-3A",
        },
        "required_children": [
            "P-2A",
            "P-2B",
            "P-2C",
            "P-3A",
            "P-3B",
            "P-3C",
            "P-85A",
            "P-85B",
            "P-85C",
        ],
    },
    {
        "name": "SAT-1",
        "aliases": {"THCNO2", "SAT1"},
        "rename_map": {
            "THC2BP1": f"{POZ} 151/1",
            "THC2BP2": f"{POZ} 151/2",
            "THC2BP3": f"{POZ} 151/3",
            "THC2BP4": f"{POZ} 151/4",
        },
        "required_children": [
            f"{POZ} 151/1",
            f"{POZ} 151/2",
            f"{POZ} 151/3",
            f"{POZ} 151/4",
            f"{POZ} 161/1",
            f"{POZ} 161/2",
            f"{POZ} 161/3",
            f"{POZ} 161/4",
        ],
    },
    {
        "name": "SAT-2",
        "aliases": {"SAT2"},
        "rename_map": {},
        "required_children": [
            "P3-P-101A",
            "P3-P-101B",
            "P3-P-101C",
            "P3-P-111A",
            "P3-P-111B",
            "P3-P-111C",
        ],
    },
]


class Command(BaseCommand):
    help = "Normalize Inkai overview tree and dashboard asset labels."

    def add_arguments(self, parser):
        parser.add_argument("--layer", default="Inkai")

    def handle(self, *args, **options):
        self.layer_name = options["layer"] or "Inkai"
        if self.layer_name.lower() != "inkai":
            self.stdout.write(
                self.style.WARNING(
                    f"normalize_inkai_structure skipped for layer '{self.layer_name}'."
                )
            )
            return

        to_layerDb(self.layer_name)
        self.now_date = timezone.now().date()
        self.now_ts = int(timezone.now().timestamp() * 1000)
        self.renamed_items = {}
        self.dashboard_copy_stats = {
            "dashboards": 0,
            "widgets": 0,
            "live_tags_created": 0,
            "tag_links_created": 0,
            "tag_mappings": 0,
            "tag_cal_mappings": 0,
            "items_seeded": 0,
            "items_skipped": 0,
        }

        try:
            with transaction.atomic():
                self._reset_model_sequences()
                self._normalize_dashboard_layers()
                _company_id, root_id = self._resolve_company_and_root()
                self._rename_item(root_id, "Inkai")

                existing_sections = {}
                for spec in SECTION_SPECS:
                    section_id = self._ensure_section(root_id, spec, existing_sections)
                    existing_sections[spec["name"]] = section_id
                    self._apply_children(section_id, spec)

                self._seed_missing_dashboards(root_id, existing_sections)
                self._sync_asset_labels()
        finally:
            change_db("default")

        self.stdout.write(
            self.style.SUCCESS(
                f"Inkai structure normalized. Renamed items: {len(self.renamed_items)}"
            )
        )
        self.stdout.write(
            "Dashboard seeding summary: "
            f"items_seeded={self.dashboard_copy_stats['items_seeded']} "
            f"items_skipped={self.dashboard_copy_stats['items_skipped']} "
            f"dashboards={self.dashboard_copy_stats['dashboards']} "
            f"widgets={self.dashboard_copy_stats['widgets']} "
            f"live_tags_created={self.dashboard_copy_stats['live_tags_created']} "
            f"tag_links_created={self.dashboard_copy_stats['tag_links_created']} "
            f"tag_mappings={self.dashboard_copy_stats['tag_mappings']} "
            f"tag_cal_mappings={self.dashboard_copy_stats['tag_cal_mappings']}"
        )

    def _reset_model_sequences(self):
        statements = connection.ops.sequence_reset_sql(
            no_style(),
            [
                item_property,
                item_link,
                bi_dashboard,
                bi_layout,
                bi_widget_property,
                tags_calculated,
            ],
        )
        if not statements:
            return

        with connection.cursor() as cursor:
            for statement in statements:
                cursor.execute(statement)

    def _normalize_dashboard_layers(self):
        bi_dashboard.objects.filter(LAYER_NAME="Horasan").update(
            LAYER_NAME=self.layer_name
        )
        bi_widget.objects.filter(LAYER_NAME="Horasan").update(LAYER_NAME=self.layer_name)
        bi_widget_property.objects.filter(LAYER_NAME="Horasan").update(
            LAYER_NAME=self.layer_name
        )

    def _normalize_key(self, value):
        if not value:
            return ""
        value = str(value).translate(LOOKALIKE_MAP).upper()
        value = value.replace("POZ.", "POZ").replace("POZ", "POZ")
        return re.sub(r"[^A-Z0-9/]+", "", value)

    def _new_hex(self):
        return uuid.uuid4().hex

    def _get_item_name_prop(self, item_id):
        return (
            item_property.objects.filter(ITEM_ID=item_id, PROPERTY_TYPE="NAME")
            .order_by("START_DATETIME", "id")
            .first()
        )

    def _get_item_name(self, item_id):
        prop = self._get_item_name_prop(item_id)
        return prop.PROPERTY_STRING if prop else None

    def _get_children_links(self, parent_id):
        return list(
            item_link.objects.filter(TO_ITEM_ID=parent_id)
            .exclude(LINK_TYPE="TAG_ITEM")
            .order_by("FROM_ITEM_ID")
        )

    def _resolve_company_and_root(self):
        company_ids = list(
            item.objects.filter(ITEM_TYPE="COMPANY").values_list("ITEM_ID", flat=True)
        )
        if not company_ids:
            raise CommandError("No COMPANY item found in Inkai layer.")

        preferred_root_keys = {"INKAIU", "INKAI", "HORASANU"}
        fallback_root = None

        for company_id in company_ids:
            children = self._get_children_links(company_id)
            if children and fallback_root is None:
                fallback_root = (company_id, children[0].FROM_ITEM_ID)

            for link in children:
                child_name = self._get_item_name(link.FROM_ITEM_ID)
                if self._normalize_key(child_name) in preferred_root_keys:
                    return company_id, link.FROM_ITEM_ID

        if fallback_root:
            return fallback_root

        raise CommandError("Unable to resolve Inkai root item under COMPANY.")

    def _find_child(self, parent_id, aliases):
        alias_keys = {self._normalize_key(alias) for alias in aliases}
        for link in self._get_children_links(parent_id):
            child_name = self._get_item_name(link.FROM_ITEM_ID)
            if self._normalize_key(child_name) in alias_keys:
                return link.FROM_ITEM_ID
        return None

    def _rename_item(self, item_id, new_name):
        name_prop = self._get_item_name_prop(item_id)
        if not name_prop:
            raise CommandError(f"NAME property not found for item {item_id}")

        if name_prop.PROPERTY_STRING != new_name:
            name_prop.PROPERTY_STRING = new_name
            name_prop.LAST_UPDT_DATE = self.now_ts
            name_prop.save(update_fields=["PROPERTY_STRING", "LAST_UPDT_DATE"])

        self.renamed_items[item_id] = new_name
        return item_id

    def _ensure_section(self, root_id, spec, existing_sections):
        section_id = self._find_child(root_id, spec["aliases"] | {spec["name"]})
        if section_id:
            self._rename_item(section_id, spec["name"])
            return section_id

        template_section_id = existing_sections.get("SAT-1") or existing_sections.get(
            "OPZ"
        )
        if not template_section_id:
            template_section_id = self._find_child(
                root_id, {"THCNO1", "THCNO2", "OPZ", "SAT1"}
            )

        if not template_section_id:
            raise CommandError(
                f"Unable to create section '{spec['name']}' without a template section."
            )

        return self._create_child_item(
            parent_id=root_id,
            template_item_id=template_section_id,
            new_name=spec["name"],
        )

    def _apply_children(self, section_id, spec):
        existing_child_map = {}
        for link in self._get_children_links(section_id):
            child_name = self._get_item_name(link.FROM_ITEM_ID)
            child_key = self._normalize_key(child_name)
            if child_key:
                existing_child_map[child_key] = link.FROM_ITEM_ID

        for old_key, new_name in spec["rename_map"].items():
            child_id = existing_child_map.get(old_key)
            if child_id:
                self._rename_item(child_id, new_name)
                existing_child_map[self._normalize_key(new_name)] = child_id

        template_child_id = self._resolve_template_child(section_id)

        for required_name in spec["required_children"]:
            existing_id = self._find_child(section_id, {required_name})
            if existing_id:
                self._rename_item(existing_id, required_name)
                if template_child_id is None:
                    template_child_id = existing_id
                continue

            if template_child_id is None:
                raise CommandError(
                    f"Unable to create child '{required_name}' in section "
                    f"'{spec['name']}' without a template item."
                )

            template_child_id = self._create_child_item(
                parent_id=section_id,
                template_item_id=template_child_id,
                new_name=required_name,
            )

    def _resolve_template_child(self, section_id):
        refreshed_children = self._get_children_links(section_id)
        if refreshed_children:
            return refreshed_children[0].FROM_ITEM_ID

        parent_link = (
            item_link.objects.filter(FROM_ITEM_ID=section_id)
            .exclude(LINK_TYPE="TAG_ITEM")
            .order_by("START_DATETIME", "id")
            .first()
        )
        if not parent_link:
            return None

        for sibling_link in self._get_children_links(parent_link.TO_ITEM_ID):
            sibling_id = sibling_link.FROM_ITEM_ID
            if sibling_id == section_id:
                continue

            sibling_children = self._get_children_links(sibling_id)
            if sibling_children:
                return sibling_children[0].FROM_ITEM_ID

        return None

    def _clone_property(self, template_prop, item_id, property_string=None):
        if not template_prop:
            return None

        return item_property.objects.create(
            ITEM_ID=item_id,
            ITEM_TYPE=template_prop.ITEM_TYPE,
            LAYER_NAME=template_prop.LAYER_NAME or self.layer_name,
            START_DATETIME=template_prop.START_DATETIME,
            END_DATETIME=template_prop.END_DATETIME,
            PROPERTY_TYPE=template_prop.PROPERTY_TYPE,
            PROPERTY_INFO=template_prop.PROPERTY_INFO,
            PROPERTY_VALUE=template_prop.PROPERTY_VALUE,
            PROPERTY_DATE=template_prop.PROPERTY_DATE,
            PROPERTY_STRING=(
                property_string
                if property_string is not None
                else template_prop.PROPERTY_STRING
            ),
            PROPERTY_CODE=template_prop.PROPERTY_CODE,
            PROPERTY_BINARY=template_prop.PROPERTY_BINARY,
            LAST_UPDT_USER=template_prop.LAST_UPDT_USER or "system",
            LAST_UPDT_DATE=self.now_ts,
            VERSION=self._new_hex(),
            DB_ID=template_prop.DB_ID,
            ROW_ID=self._new_hex(),
            STATUS=template_prop.STATUS or "A",
            REV_GRP_ID=self._new_hex(),
            UPDATE_SOURCE=template_prop.UPDATE_SOURCE or "x",
            CREATE_SOURCE=template_prop.CREATE_SOURCE or "x",
        )

    def _create_child_item(self, parent_id, template_item_id, new_name):
        template_item = item.objects.get(ITEM_ID=template_item_id)
        template_link = (
            item_link.objects.filter(FROM_ITEM_ID=template_item_id)
            .exclude(LINK_TYPE="TAG_ITEM")
            .order_by("START_DATETIME", "id")
            .first()
        )
        if not template_link:
            raise CommandError(
                f"Template link not found for item {template_item_id} "
                f"while creating '{new_name}'."
            )

        new_item_id = self._new_hex()
        item.objects.create(
            ITEM_ID=new_item_id,
            ITEM_TYPE=template_item.ITEM_TYPE,
            START_DATETIME=template_item.START_DATETIME,
            END_DATETIME=template_item.END_DATETIME,
            LAST_UPDT_USER=template_item.LAST_UPDT_USER or "system",
            LAST_UPDT_DATE=self.now_date,
            VERSION=self._new_hex(),
            DB_ID=template_item.DB_ID,
            ROW_ID=self._new_hex(),
            STATUS=template_item.STATUS or "A",
            LAYER_NAME=template_item.LAYER_NAME or self.layer_name,
            REV_GRP_ID=self._new_hex(),
            UPDATE_SOURCE=template_item.UPDATE_SOURCE or "x",
            CREATE_SOURCE=template_item.CREATE_SOURCE or "x",
        )

        template_name_prop = self._get_item_name_prop(template_item_id)
        if not template_name_prop:
            raise CommandError(
                f"Template NAME property not found for item {template_item_id} "
                f"while creating '{new_name}'."
            )

        self._clone_property(template_name_prop, new_item_id, property_string=new_name)

        active_prop = (
            item_property.objects.filter(ITEM_ID=template_item_id, PROPERTY_TYPE="ACTIVE")
            .order_by("START_DATETIME", "id")
            .first()
        )
        if active_prop:
            self._clone_property(active_prop, new_item_id)

        item_link.objects.create(
            LINK_ID=self._new_hex(),
            LINK_TYPE=template_link.LINK_TYPE,
            START_DATETIME=template_link.START_DATETIME,
            END_DATETIME=template_link.END_DATETIME,
            FROM_ITEM_ID=new_item_id,
            FROM_ITEM_TYPE=template_link.FROM_ITEM_TYPE,
            TO_ITEM_ID=parent_id,
            TO_ITEM_TYPE=template_link.TO_ITEM_TYPE,
            COLL_ITEM_ID=template_link.COLL_ITEM_ID,
            COLL_ITEM_TYPE=template_link.COLL_ITEM_TYPE,
            LAST_UPDT_USER=template_link.LAST_UPDT_USER or "system",
            LAST_UPDT_DATE=self.now_ts,
            LAYER_NAME=template_link.LAYER_NAME or self.layer_name,
            VERSION=self._new_hex(),
            DB_ID=template_link.DB_ID,
            ROW_ID=self._new_hex(),
            STATUS=template_link.STATUS or "A",
            REV_GRP_ID=self._new_hex(),
            UPDATE_SOURCE=template_link.UPDATE_SOURCE or "x",
            CREATE_SOURCE=template_link.CREATE_SOURCE or "x",
        )

        self.renamed_items[new_item_id] = new_name
        return new_item_id

    def _seed_missing_dashboards(self, root_id, existing_sections):
        for spec in SECTION_SPECS:
            section_id = existing_sections.get(spec["name"])
            if not section_id:
                continue

            for child_id, child_name in self._ordered_section_children(section_id, spec):
                if bi_dashboard.objects.filter(ITEM_ID=child_id).exists():
                    self.dashboard_copy_stats["items_skipped"] += 1
                    continue

                source_item_id = self._resolve_dashboard_source_item(
                    root_id=root_id,
                    section_id=section_id,
                    target_item_id=child_id,
                    existing_sections=existing_sections,
                )
                if not source_item_id:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Skipped dashboard seed for '{child_name}': no template dashboard item found."
                        )
                    )
                    continue

                copied = self._copy_dashboards_to_item(
                    source_item_id=source_item_id,
                    target_item_id=child_id,
                    section_name=spec["name"],
                    target_item_name=child_name,
                )
                if copied:
                    self.dashboard_copy_stats["items_seeded"] += 1
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Skipped dashboard seed for '{child_name}': source item has no dashboards."
                        )
                    )

    def _ordered_section_children(self, section_id, spec):
        children = []
        seen = set()

        for child_name in spec["required_children"]:
            child_id = self._find_child(section_id, {child_name})
            if child_id and child_id not in seen:
                children.append((child_id, child_name))
                seen.add(child_id)

        for link in self._get_children_links(section_id):
            child_id = link.FROM_ITEM_ID
            if child_id in seen:
                continue
            child_name = self._get_item_name(child_id)
            children.append((child_id, child_name))
            seen.add(child_id)

        return children

    def _resolve_dashboard_source_item(
        self, root_id, section_id, target_item_id, existing_sections
    ):
        for link in self._get_children_links(section_id):
            source_item_id = link.FROM_ITEM_ID
            if source_item_id == target_item_id:
                continue
            if bi_dashboard.objects.filter(ITEM_ID=source_item_id).exists():
                return source_item_id

        for sibling_section_id in existing_sections.values():
            if sibling_section_id == section_id:
                continue
            for link in self._get_children_links(sibling_section_id):
                source_item_id = link.FROM_ITEM_ID
                if bi_dashboard.objects.filter(ITEM_ID=source_item_id).exists():
                    return source_item_id

        for link in self._get_children_links(root_id):
            source_item_id = link.FROM_ITEM_ID
            if source_item_id in {section_id, target_item_id}:
                continue
            if bi_dashboard.objects.filter(ITEM_ID=source_item_id).exists():
                return source_item_id

        return None

    def _copy_dashboards_to_item(
        self, source_item_id, target_item_id, section_name, target_item_name
    ):
        source_dashboards = list(
            bi_dashboard.objects.filter(ITEM_ID=source_item_id).prefetch_related("WIDGETS")
        )
        if not source_dashboards:
            return False

        target_item = item.objects.get(ITEM_ID=target_item_id)
        default_live_tag = None

        for source_dashboard in source_dashboards:
            new_dashboard = bi_dashboard.objects.create(
                NAME=source_dashboard.NAME,
                CULTURE=source_dashboard.CULTURE,
                LAYER_NAME=self.layer_name,
                DASHBOARD_USER=deepcopy(source_dashboard.DASHBOARD_USER),
                START_DATETIME=source_dashboard.START_DATETIME,
                ITEM_ID=target_item,
                ROW_ID=self._new_hex(),
            )
            self.dashboard_copy_stats["dashboards"] += 1

            new_widgets = []
            for source_widget in source_dashboard.WIDGETS.all():
                new_widget = bi_widget.objects.create(
                    WIDGET_ID=self._new_hex(),
                    WIDGET_TYPE=source_widget.WIDGET_TYPE,
                    START_DATETIME=source_widget.START_DATETIME,
                    END_DATETIME=source_widget.END_DATETIME,
                    LAST_UPDT_USER=source_widget.LAST_UPDT_USER,
                    LAST_UPDT_DATE=source_widget.LAST_UPDT_DATE,
                    VERSION=self._new_hex(),
                    DB_ID=source_widget.DB_ID,
                    ROW_ID=self._new_hex(),
                    STATUS=source_widget.STATUS,
                    LAYER_NAME=self.layer_name,
                    REV_GRP_ID=self._new_hex(),
                    UPDATE_SOURCE=source_widget.UPDATE_SOURCE,
                    CREATE_SOURCE=source_widget.CREATE_SOURCE,
                )
                self.dashboard_copy_stats["widgets"] += 1
                new_widgets.append(new_widget)

                for source_layout in source_widget.layouts.all():
                    bi_layout.objects.create(
                        static=source_layout.static,
                        w=source_layout.w,
                        moved=source_layout.moved,
                        h=source_layout.h,
                        x=source_layout.x,
                        y=source_layout.y,
                        l_type=source_layout.l_type,
                        i=new_widget,
                        ROW_ID=self._new_hex(),
                    )

                for source_prop in bi_widget_property.objects.filter(
                    WIDGET_ID=source_widget.WIDGET_ID
                ):
                    new_prop = bi_widget_property.objects.create(
                        WIDGET_TYPE=source_prop.WIDGET_TYPE,
                        PROPERTY_NAME=source_prop.PROPERTY_NAME,
                        LAYER_NAME=self.layer_name,
                        START_DATETIME=source_prop.START_DATETIME,
                        END_DATETIME=source_prop.END_DATETIME,
                        PROPERTY_TYPE=source_prop.PROPERTY_TYPE,
                        PROPERTY_INFO=source_prop.PROPERTY_INFO,
                        PROPERTY_VALUE=source_prop.PROPERTY_VALUE,
                        PROPERTY_STRING=source_prop.PROPERTY_STRING,
                        PROPERTY_JSON=self._resolve_property_json(
                            source_prop=source_prop,
                            target_item_id=target_item_id,
                            target_item_name=target_item_name,
                        ),
                        PROPERTY_BINARY=source_prop.PROPERTY_BINARY,
                        PROPERTY_BOOLEAN=source_prop.PROPERTY_BOOLEAN,
                        LAST_UPDT_USER=source_prop.LAST_UPDT_USER,
                        LAST_UPDT_DATE=source_prop.LAST_UPDT_DATE,
                        VERSION=self._new_hex(),
                        DB_ID=source_prop.DB_ID,
                        ROW_ID=self._new_hex(),
                        STATUS=source_prop.STATUS,
                        REV_GRP_ID=self._new_hex(),
                        UPDATE_SOURCE=source_prop.UPDATE_SOURCE,
                        CREATE_SOURCE=source_prop.CREATE_SOURCE,
                    )
                    new_prop.WIDGET_ID.set([new_widget])

                    mapped_tags, default_live_tag = self._resolve_tag_bindings(
                        source_tags=list(source_prop.PROPERTY_TAG.all()),
                        target_item=target_item,
                        section_name=section_name,
                        target_item_name=target_item_name,
                        default_live_tag=default_live_tag,
                    )
                    mapped_cal_tags = self._resolve_calculated_tag_bindings(
                        source_tags=list(source_prop.PROPERTY_TAG_CAL.all()),
                        target_item_id=target_item_id,
                        target_item_name=target_item_name,
                    )

                    new_prop.PROPERTY_TAG.set(mapped_tags)
                    new_prop.PROPERTY_TAG_CAL.set(mapped_cal_tags)

            new_dashboard.WIDGETS.set(new_widgets)

        return True

    def _resolve_property_json(self, source_prop, target_item_id, target_item_name):
        value = deepcopy(source_prop.PROPERTY_JSON)
        if source_prop.PROPERTY_NAME != "Assets":
            return value

        return [[target_item_id, target_item_name]]

    def _resolve_tag_bindings(
        self, source_tags, target_item, section_name, target_item_name, default_live_tag
    ):
        if not source_tags:
            return [], default_live_tag

        existing_tags = list(
            tags.objects.filter(ITEM_ID=target_item.ITEM_ID, LAYER_NAME=self.layer_name)
        )
        resolved = []
        seen = set()

        for index, source_tag in enumerate(source_tags):
            mapped_tag = self._find_target_tag_by_metric(
                source_tag=source_tag,
                target_tags=existing_tags,
                target_item_name=target_item_name,
            )

            metric_key = self._metric_key(
                value=source_tag.SHORT_NAME or source_tag.NAME,
                asset_name=source_tag.TRANSACTION_PROPERTY,
            )
            if not mapped_tag and (index == 0 or metric_key in {"", "CURRENT"}):
                default_live_tag = default_live_tag or self._ensure_live_tag(
                    target_item=target_item,
                    section_name=section_name,
                    target_item_name=target_item_name,
                    source_tag=source_tag,
                )
                if default_live_tag:
                    mapped_tag = default_live_tag
                    existing_tags.append(default_live_tag)

            if mapped_tag and mapped_tag.TAG_ID not in seen:
                resolved.append(mapped_tag)
                seen.add(mapped_tag.TAG_ID)
                self.dashboard_copy_stats["tag_mappings"] += 1

        return resolved, default_live_tag

    def _resolve_calculated_tag_bindings(
        self, source_tags, target_item_id, target_item_name
    ):
        if not source_tags:
            return []

        target_tags = list(
            tags_calculated.objects.filter(
                ITEM_ID=target_item_id,
                LAYER_NAME=self.layer_name,
            )
        )
        resolved = []
        seen = set()

        for source_tag in source_tags:
            mapped_tag = self._find_target_calculated_tag_by_metric(
                source_tag=source_tag,
                target_tags=target_tags,
                target_item_name=target_item_name,
            )
            if mapped_tag and mapped_tag.TAG_ID not in seen:
                resolved.append(mapped_tag)
                seen.add(mapped_tag.TAG_ID)
                self.dashboard_copy_stats["tag_cal_mappings"] += 1

        return resolved

    def _find_target_tag_by_metric(self, source_tag, target_tags, target_item_name):
        source_metric = self._metric_key(
            value=source_tag.SHORT_NAME or source_tag.NAME,
            asset_name=source_tag.TRANSACTION_PROPERTY,
        )
        if not source_metric:
            return None

        for target_tag in target_tags:
            target_metric = self._metric_key(
                value=target_tag.SHORT_NAME or target_tag.NAME,
                asset_name=target_item_name,
            )
            if target_metric == source_metric:
                return target_tag

        return None

    def _find_target_calculated_tag_by_metric(
        self, source_tag, target_tags, target_item_name
    ):
        source_metric = self._metric_key(
            value=source_tag.SHORT_NAME or source_tag.NAME,
            asset_name=source_tag.TRANSACTION_PROPERTY,
        )
        if not source_metric:
            return None

        for target_tag in target_tags:
            target_metric = self._metric_key(
                value=target_tag.SHORT_NAME or target_tag.NAME,
                asset_name=target_item_name,
            )
            if target_metric == source_metric:
                return target_tag

        return None

    def _ensure_live_tag(self, target_item, section_name, target_item_name, source_tag):
        tag_name = self._default_live_tag_name(section_name, target_item_name)
        existing_tag = (
            tags.objects.filter(ITEM_ID=target_item.ITEM_ID, NAME=tag_name).first()
            or tags.objects.filter(NAME=tag_name, LAYER_NAME=self.layer_name).first()
        )
        if existing_tag:
            return existing_tag

        short_name_suffix = self._metric_key(
            value=source_tag.SHORT_NAME or source_tag.NAME,
            asset_name=source_tag.TRANSACTION_PROPERTY,
        )
        if short_name_suffix and short_name_suffix != "CURRENT":
            short_name = f"{target_item_name} {short_name_suffix.title()}"
        else:
            short_name = f"{target_item_name} Current"

        live_tag = tags.objects.create(
            ITEM_ID=target_item.ITEM_ID,
            EVENT_TYPE=source_tag.EVENT_TYPE,
            TAG_ID=self._new_hex(),
            START_DATETIME=source_tag.START_DATETIME or self.now_ts,
            PARENT_TAG_ID=source_tag.PARENT_TAG_ID,
            NAME=tag_name,
            DESCRIPTION=source_tag.DESCRIPTION or f"{target_item_name} current",
            UOM_CODE=source_tag.UOM_CODE,
            SHORT_NAME=short_name,
            DATA_TYPE=source_tag.DATA_TYPE,
            DERIVE_EQUATION=source_tag.DERIVE_EQUATION,
            EXCEPTION_DEV=source_tag.EXCEPTION_DEV,
            EXCEPTION_DEV_TYPE=source_tag.EXCEPTION_DEV_TYPE,
            NODE_NAME=source_tag.NODE_NAME,
            PROCESS_NAME=source_tag.PROCESS_NAME,
            SOURCE_NAME=source_tag.SOURCE_NAME,
            STEPPED=source_tag.STEPPED,
            DATA_ACCESS_TYPE=source_tag.DATA_ACCESS_TYPE,
            LAYER_NAME=self.layer_name,
            NODE_DUMP=source_tag.NODE_DUMP,
            NORMAL_MAXIMUM=source_tag.NORMAL_MAXIMUM,
            NORMAL_MINIMUM=source_tag.NORMAL_MINIMUM,
            LIMIT_LOLO=source_tag.LIMIT_LOLO,
            LIMIT_HIHI=source_tag.LIMIT_HIHI,
            EVENT_NOTIFIER=source_tag.EVENT_NOTIFIER,
            NODE_CLASS=source_tag.NODE_CLASS,
            HISTORIZING=source_tag.HISTORIZING,
            MINIMUM_SAMPLING_INTERVAL=source_tag.MINIMUM_SAMPLING_INTERVAL,
            PERIOD=source_tag.PERIOD,
            END_DATETIME=source_tag.END_DATETIME,
            LAST_UPDT_USER=source_tag.LAST_UPDT_USER or "system",
            LAST_UPDT_DATE=self.now_ts,
            VERSION=self._new_hex(),
            DB_ID=source_tag.DB_ID,
            ROW_ID=self._new_hex(),
            STATUS=source_tag.STATUS or "A",
            REV_GRP_ID=self._new_hex(),
            TRANSACTION_TYPE=source_tag.TRANSACTION_TYPE or target_item.ITEM_TYPE,
            TRANSACTION_PROPERTY=target_item_name,
            UPDATE_SOURCE=source_tag.UPDATE_SOURCE or "x",
            CREATE_SOURCE=source_tag.CREATE_SOURCE or "x",
        )
        self.dashboard_copy_stats["live_tags_created"] += 1
        self._ensure_tag_link(target_item=target_item, tag_id=live_tag.TAG_ID)
        return live_tag

    def _ensure_tag_link(self, target_item, tag_id):
        if item_link.objects.filter(
            LINK_TYPE="TAG_ITEM",
            FROM_ITEM_ID=tag_id,
            TO_ITEM_ID=target_item.ITEM_ID,
        ).exists():
            return

        item_link.objects.create(
            LINK_ID=self._new_hex(),
            LINK_TYPE="TAG_ITEM",
            START_DATETIME=self.now_ts,
            END_DATETIME=9999999999999,
            FROM_ITEM_ID=tag_id,
            FROM_ITEM_TYPE="TAG_CACHE",
            TO_ITEM_ID=target_item.ITEM_ID,
            TO_ITEM_TYPE=target_item.ITEM_TYPE,
            COLL_ITEM_ID=None,
            COLL_ITEM_TYPE=None,
            LAST_UPDT_USER="system",
            LAST_UPDT_DATE=self.now_ts,
            LAYER_NAME=self.layer_name,
            VERSION=self._new_hex(),
            DB_ID=None,
            ROW_ID=self._new_hex(),
            STATUS="A",
            REV_GRP_ID=self._new_hex(),
            UPDATE_SOURCE="x",
            CREATE_SOURCE="x",
        )
        self.dashboard_copy_stats["tag_links_created"] += 1

    def _default_live_tag_name(self, section_name, position_name):
        return (
            f"plant.{self._slugify(self.layer_name)}."
            f"{self._slugify(section_name)}."
            f"{self._slugify(self._publisher_position_name(position_name))}.current"
        )

    def _publisher_position_name(self, position_name):
        return str(position_name).replace(POZ, "POS").replace("Поз.", "POS")

    def _slugify(self, value):
        value = str(value or "").translate(LOOKALIKE_MAP)
        return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")

    def _metric_key(self, value, asset_name):
        normalized = self._normalize_key(value)
        if asset_name:
            asset_keys = {
                self._normalize_key(asset_name),
                self._normalize_key(self._publisher_position_name(asset_name)),
            }
            for asset_key in asset_keys:
                if asset_key:
                    normalized = normalized.replace(asset_key, "")

        normalized = normalized.strip("-_/ ")
        return normalized or ""

    def _sync_asset_labels(self):
        if not self.renamed_items:
            return

        for prop in bi_widget_property.objects.filter(PROPERTY_NAME="Assets").exclude(
            PROPERTY_JSON__isnull=True
        ):
            value = prop.PROPERTY_JSON
            if isinstance(value, str):
                try:
                    value = json.loads(value)
                except json.JSONDecodeError:
                    continue

            if not isinstance(value, list):
                continue

            changed = False
            for entry in value:
                if (
                    isinstance(entry, list)
                    and len(entry) >= 2
                    and entry[0] in self.renamed_items
                    and entry[1] != self.renamed_items[entry[0]]
                ):
                    entry[1] = self.renamed_items[entry[0]]
                    changed = True

            if changed:
                prop.PROPERTY_JSON = value
                prop.save(update_fields=["PROPERTY_JSON"])

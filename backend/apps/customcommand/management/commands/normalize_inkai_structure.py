import json
import re
import uuid

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.bi_dashbord.models import bi_dashboard
from apps.bi_widget_property.models import bi_widget_property
from apps.bi_widgets.models import bi_widget
from apps.item.models import item
from apps.item_link.models import item_link
from apps.item_property.models import item_property
from apps.layer.helpers import change_db, to_layerDb


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

        try:
            with transaction.atomic():
                self._normalize_dashboard_layers()
                _company_id, root_id = self._resolve_company_and_root()
                self._rename_item(root_id, "Inkai")

                existing_sections = {}
                for spec in SECTION_SPECS:
                    section_id = self._ensure_section(root_id, spec, existing_sections)
                    existing_sections[spec["name"]] = section_id
                    self._apply_children(section_id, spec)

                self._sync_asset_labels()
        finally:
            change_db("default")

        self.stdout.write(
            self.style.SUCCESS(
                f"Inkai structure normalized. Renamed items: {len(self.renamed_items)}"
            )
        )

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

        template_child_id = None
        refreshed_children = self._get_children_links(section_id)
        if refreshed_children:
            template_child_id = refreshed_children[0].FROM_ITEM_ID

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

            self._create_child_item(
                parent_id=section_id,
                template_item_id=template_child_id,
                new_name=required_name,
            )

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

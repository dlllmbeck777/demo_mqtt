from django.core.management.base import BaseCommand
from django.core.management import call_command
from apps.layer.models import layer
from apps.layer.helpers import change_db, to_layerDb


class Command(BaseCommand):
    help = "Performs custom migration for all databases"

    def handle(self, *args, **options):
        change_db("default")
        databases = layer.objects.all().values_list("LAYER_NAME", flat=True)
        for database in databases:
            database = database
            to_layerDb("STD")
            to_layerDb(database)
            if database in ["STD", "Inkai", "Horasan"]:
                call_command("migrate", database="layer_db")

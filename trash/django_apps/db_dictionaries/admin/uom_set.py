from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from ..models._uom_set import UOM_Set

class UOMAdminBase(DraggableMPTTAdmin):
    # inlines = [FieldTabularInline]
    mptt_indent_field = "code"
    list_display = ['tree_actions', 'indented_title', 'code', 'code_text', 'parent', 'layer', 'catalog_name', 'metric_system', 'conversion_type']    
    list_display_links = ['indented_title']
    list_filter = ['parent', 'metric_system']

    fieldsets = (
        ('Defaults', {'fields': ('parent', 'code', 'code_text', 'layer', 'catalog_name', 'metric_system', 'conversion_type',
                    'A', 'B', 'C', 'D',)}),
        ('Other', {'classes': ('collapse',),'fields': ('last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version')}),
    )

    search_fields = ['code', 'code_text']
    # ordering = ['code', 'code_text']
    filter_horizontal = ()
    readonly_fields = ['last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version']
    list_per_page = 250
    list_max_show_all = 1000

admin.site.register(UOM_Set, UOMAdminBase)
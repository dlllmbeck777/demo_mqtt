from django.contrib import admin
from dbmodels.models._uom_property import UOM_Property

class PropertyClassAdminBase(admin.ModelAdmin):
    # inlines = [FieldTabularInline]
    # model = Base_UOM
    list_display = [
                    'code_id', 
                    'code_name',                 
                    ]    
    list_display_links = ['code_id', 'code_name']
    # list_filter = ['property_class', 'metric_system']

    fieldsets = (
        ('Defaults', {'fields': (                    
                    'code_id', 
                    'code_name', 
                    )}),
        ('Other', {'classes': ('collapse',),'fields': ('last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version')}),
    )

    search_fields = ['code_id', 'code_name']
    ordering = ['code_id', 'code_name']
    filter_horizontal = ()
    readonly_fields = ['last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version']
    list_per_page = 250
    list_max_show_all = 1000

admin.site.register(UOM_Property, PropertyClassAdminBase)
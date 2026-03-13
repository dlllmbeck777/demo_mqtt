from django.contrib import admin
from dbmodels.models._uom_base import UOM_Base


# class BatteryTabularInline(admin.StackedInline):
#     model = Battery
#     # fk_name='company_ref'
#     extra = 1
#     show_change_link = True
    
#     # readonly_fields = ('country')
#     # can_delete = False
#     # extra = 0
class UOMAdminBase(admin.ModelAdmin):
    # inlines = [FieldTabularInline]
    # model = Base_UOM
    list_display = [
                    'code_id', 
                    'code_name', 
                    # 'parent',
                    'property',
                    'dimension',
                    'layer',                     
                    'catalog_name', 
                    'metric_system',
                    'conversion_type',                 
                    ]    
    list_display_links = ['code_id', 'code_name']
    list_filter = ['property', 'metric_system']

    fieldsets = (
        ('Defaults', {'fields': (                    
                    'code_id', 
                    'code_name', 
                    # 'parent',
                    'property',
                    'dimension',
                    'layer',                     
                    'catalog_name', 
                    'metric_system',
                    'conversion_type',
                    'A',
                    'B', 
                    'C',
                    'D',
                    )}),
        ('Other', {'classes': ('collapse',),'fields': ('last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version')}),
    )

    search_fields = ['code_id', 'code_name']
    ordering = ['code_id', 'code_name']
    filter_horizontal = ()
    readonly_fields = ['last_updt_user', 'last_updt_date', 'row_id', 'update_source', 'version']
    list_per_page = 250
    list_max_show_all = 1000

admin.site.register(UOM_Base, UOMAdminBase)
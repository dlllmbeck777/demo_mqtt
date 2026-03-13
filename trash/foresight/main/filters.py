import django_filters
from .models import Maintenance, Repair
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout

class MaintenanceFilter(django_filters.FilterSet):
    
    class Meta: 
        model = Maintenance
        fields = 'station', 'pump'
    
     
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-inline'
        self.helper.field_template = 'bootstrap3/layout/inline_field.html'
        self.layout = Layout(
            "station",
            "pump"
        )


class RepairFilter(django_filters.FilterSet):
    
    class Meta: 
        model = Repair
        fields = 'station', 'pump'
    
     
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_class = 'form-inline'
        self.helper.field_template = 'bootstrap3/layout/inline_field.html'
        self.layout = Layout(
            "station",
            "pump"
        )

    

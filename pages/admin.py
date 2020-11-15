from django.contrib import admin

from .models import Contact

class ContactAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['contact_type']}),
    ('Personal Info', {'fields': ['name', 'email', 'phone']}),
    ('Body', {'fields': ['subject', 'message']}),
    ('Rider Information', {'fields': ['age', 'service_type', 'city', 'drivers_license']}),
  ]
  list_display = ('name', 'service_type', 'contact_type', 'contact_date', 'created_by')
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(Contact, ContactAdmin)
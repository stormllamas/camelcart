from django.contrib import admin
from solo.admin import SingletonModelAdmin
from .models import SiteConfiguration


class SingletonModelAdminModified(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['site_name', 'maintenance_mode', 'beta_mode', 'site_message']}),
    ('Contact Information', {'fields': ['phone', 'email', 'location']}),
    ('About Page', {'fields': ['about_text']}),
  ]

  def has_delete_permission(self, request, obj=None):
    return False
    
  def has_add_permission(self, request, obj=None):
    return False

admin.site.register(SiteConfiguration, SingletonModelAdminModified)
try:
  config = SiteConfiguration.get_solo()
except:
  config = None
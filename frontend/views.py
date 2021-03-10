from django.shortcuts import render
from django.views.generic.base import TemplateView
from configuration.models import SiteConfiguration
from django.conf import settings

class IndexView(TemplateView):
  template_name = "frontend/index.html"

  def get_context_data(self, **kwargs):
    context = super().get_context_data(**kwargs)
    context['site_config'] = SiteConfiguration.objects.first()
    context['google_api_key'] = settings.GOOGLE_API_KEY
    return context
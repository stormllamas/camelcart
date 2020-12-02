from django.db import models
from solo.models import SingletonModel

# Create your models here.

class SiteConfiguration(SingletonModel):
  maintenance_mode = models.BooleanField(default=False)
  beta_mode = models.BooleanField(default=False)

  site_name = models.CharField(max_length=255, default='Trike')
  site_message = models.CharField(max_length=125, blank=True, null=True)
  
  # Contact Information
  phone = models.CharField(max_length=55, default='', blank=True, null=True)
  email = models.EmailField(max_length=55, default='', blank=True, null=True)
  location = models.CharField(max_length=100, default='', blank=True, null=True)

  # About Page
  about_text = models.TextField(max_length=4000, default='Insert About Text Here')

  def __str__(self):
    return f"{self.site_name}"
  
  def __unicode__(self):
    return u"Site Configuration"

  class Meta:
    verbose_name = "Site Configuration"
from django.db import models
from django.conf import settings

# Tools
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.utils.html import mark_safe

class Contact(models.Model):
  contact_type = models.CharField(max_length=50)

  name = models.CharField(max_length=50)
  email = models.CharField(max_length=50)
  phone = models.CharField(max_length=50, blank=True, null=True)

  subject = models.CharField(max_length=200)
  message = models.TextField(blank=True)
  
  age = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(18), MaxValueValidator(55)])

  service_type = models.CharField(max_length=50, blank=True, null=True)
  city = models.CharField(max_length=50, blank=True, null=True)
  drivers_license = models.ImageField(upload_to='photos/license/', blank=True, null=True)

  contact_date = models.DateTimeField(default=timezone.now, blank=True)
  created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='contacts', on_delete=models.SET_NULL, null=True, blank=True)

  def __str__(self):
    return f'{self.name}'
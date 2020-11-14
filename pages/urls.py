from rest_framework import routers
from django.urls import path
from .api import ContactViewSet

urlpatterns = [
  path('api/contact/', ContactViewSet.as_view(), name='contact'),
]
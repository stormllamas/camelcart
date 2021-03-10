from django.shortcuts import render

# Packages
from rest_framework.permissions import IsAuthenticated

# Models
from django.conf import settings
from .models import SiteConfiguration
from logistics.models import Order, Vehicle, PromoCode

# Serializers
from rest_framework import viewsets, mixins
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import SiteConfigurationSerializer


    
class SiteInformationAPI(GenericAPIView):
  def get(self, request, pk=None):

    site_config = SiteConfiguration.objects.first()
    return Response({
      'maintenance_mode': site_config.maintenance_mode,
      'beta_mode': site_config.beta_mode,
      'site_name': site_config.site_name,
      'site_message': site_config.site_message,
      'phone': site_config.phone,
      'email': site_config.email,
      'location': site_config.location,
      'about_text': site_config.about_text,
      'shipping_base': site_config.shipping_base,
      'two_way_multiplier': site_config.two_way_multiplier,
      'version': settings.APPLICATION_VERSION,

      'vehicles': [{
        'id': vehicle.id,
        'name': vehicle.name,
        'per_km_price': vehicle.per_km_price
      } for vehicle in Vehicle.objects.all()],

      'promo_code_list': [{
        'id': promo_code.id,
        'code': promo_code.code,
        'reusable': promo_code.reusable,
        'delivery_discount': promo_code.delivery_discount,
        'promo_code_active': promo_code.promo_code_active,
        'final_delivery_discount': promo_code.final_delivery_discount,
        # 'final_order_discount': promo_code.final_order_discount,
      } for promo_code in PromoCode.objects.all()],
    })
    
class PayPalKeysAPI(GenericAPIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, pk=None):
    return Response({
      'PAYPAL_CLIENT_ID': settings.PAYPAL_CLIENT_ID,
      'PAYPAL_CLIENT_SECRET': settings.PAYPAL_CLIENT_SECRET,
    })
    
class FacebookKeysAPI(GenericAPIView):

  def get(self, request, pk=None):
    return Response({
      'FACEBOOK_AUTH_ID': settings.FACEBOOK_AUTH_ID,
    })
    
class GoogleKeysAPI(GenericAPIView):

  def get(self, request, pk=None):
    return Response({
      'GOOGLE_API_KEY': settings.GOOGLE_API_KEY,
    })

# class SiteConfigurationAPI(mixins.ListModelMixin, viewsets.GenericViewSet):
#   queryset = SiteConfiguration.objects.all()
#   serializer_class = SiteConfigurationSerializer
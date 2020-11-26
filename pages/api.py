# Packages
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

# Permissions and pagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# Serializers
from .serializers import ContactSerializer

# For Email
from django.core.mail import send_mail, get_connection
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site

# Tools
from django.shortcuts import get_object_or_404
from django.db.models import Q
from decouple import config
from django.utils import timezone
import datetime

class ContactViewSet(GenericAPIView):
  serializer_class = ContactSerializer
      
  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    if request.user.is_authenticated:
      contact = serializer.save(created_by=self.request.user)
    else:
      contact = serializer.save()

    contact.save()
    
    current_site = get_current_site(self.request)
    contact_type = request.data['contact_type']
    name = request.data['name']
    email = request.data['email']
    phone = request.data['phone']
    subject = request.data['subject']
    message = request.data.get('message', None)
    age = request.data.get('age', None)
    drivers_license = request.data.get('drivers_license', None)
    service_type = request.data.get('service_type', None)
    city = request.data.get('city', None)

    timestamp = timezone.now()

    # Success Message to Inquirer
    success_message = render_to_string(
      'inquiry_success.html' if contact_type == 'question' else 'inquiry_success_rider.html',
      {
        'name': name,
      }
    )
    
    # Get support email instead of default
    connection = get_connection(
      # host=my_host, 
      # port=my_port, 
      username=config('SUPPORT_USER'), 
      password=config('SUPPORT_PASSWORD'), 
      # use_tls=my_use_tls
    )
    
    send_mail(
      subject,
      success_message,
      'Trike <info@trike.com.ph>',
      [email],
      # connection=connection,
      fail_silently=False
    )

    # Message Notification
    message_notification = render_to_string(
      'inquiry_notification.html' if contact_type == 'question' else 'inquiry_notification_rider.html',
      {
        'domain': current_site.domain,

        'name': name,
        'email': email,
        'phone': phone,

        'message': message if contact_type == 'question' else None,

        'age': age if contact_type == 'rider_inquiry' else None,
        'service_type': service_type if contact_type == 'rider_inquiry' else None,
        'city': city if contact_type == 'rider_inquiry' else None,
        'drivers_license': drivers_license if contact_type == 'rider_inquiry' else None,
        'timestamp': timestamp,
      }
    )

    send_mail(
      subject,
      message_notification,
      'Trike <info@trike.com.ph>',
      ['info@trike.com.ph'],
      # connection=connection,
      fail_silently=False
    )

    return Response({'status': 'okay'})
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
    print(serializer.is_valid())
    serializer.is_valid(raise_exception=True)

    if request.user.is_authenticated:
      contact = serializer.save(created_by=self.request.user)
    else:
      contact = serializer.save()

    contact.save()
    
    contact_type = request.data['contact_type']
    name = request.data['name']
    email = request.data['email']
    phone = request.data['phone']
    subject = request.data['subject']
    message = request.data.get('message', None)
    service_type = request.data.get('service_type', None)
    city = request.data.get('city', None)

    timestamp = timezone.now()
    mail_subject = 'OPA Inquiry'

    # Success Message to Inquirer
    success_message = render_to_string(
      'inquiry_success.html',
      {
        'name': name,
      }
    )
    
    connection = get_connection(
      # host=my_host, 
      # port=my_port, 
      username=config('SUPPORT_USER'), 
      password=config('SUPPORT_PASSWORD'), 
      # use_tls=my_use_tls
    ) 
    print('success_message', success_message)
    # send_mail(
    #   mail_subject,
    #   success_message,
    #   'Trike Support',
    #   [email],
    #   connection=connection,
    #   fail_silently=False
    # )

    # Message Notification
    if contact_type == 'question':
      message_notification = render_to_string(
        'inquiry_notification.html',
        {
          'name': name,
          'email': email,
          'phone': phone,
          'subject': subject,
          'message': message,
          'timestamp': timestamp,
        }
      )
    elif contact_type == 'rider_inquiry':
      message_notification = render_to_string(
        'inquiry_notification_rider.html',
        {
          'name': name,
          'email': email,
          'phone': phone,
          'subject': subject,
          'city': city,
          'timestamp': timestamp,
        }
      )
    print('message_notification', message_notification)
    # send_mail(
    #   mail_subject,
    #   message_notification,
    #   'Trike Support',
    #   ['support@quezonagrimart.com.ph'],
    #   connection=connection,
    #   fail_silently=False
    # )

    return Response({'status': 'okay'})
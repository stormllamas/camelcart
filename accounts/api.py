# Packages
from rest_framework import viewsets
from rest_framework.generics import GenericAPIView, RetrieveAPIView, UpdateAPIView, CreateAPIView, DestroyAPIView
from rest_framework.mixins import RetrieveModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer, ResetPasswordSerializer, SocialAuthSerializer, AddressSerializer

# Exceptions
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

#Auth
from rest_framework.response import Response
from knox.models import AuthToken

# Models
from .models import Address
from logistics.models import Order, CommissionPayment
from django.conf import settings
from django.contrib.auth import get_user_model
User = get_user_model()

# For Email
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .tokens import account_activation_token

# Tools
from django.shortcuts import get_object_or_404
from django.utils import timezone
import datetime
import re

def get_user_data(user) :
  addresses = [{
    'id': address.id,
    'user': address.user.id,
    'latitude': address.latitude,
    'longitude': address.longitude,
    'address': address.address,
  } for address in user.addresses.all()]

  groups = [group.name for group in user.groups.all()]

  menu_notification = False

  if 'rider' in [group.name for group in user.groups.all()]:
    menu_notification = Order.objects.filter(is_ordered=True, rider__isnull=True, is_canceled=False, is_pickedup=False, is_delivered=False).count() >= 1

  if 'seller' in [group.name for group in user.groups.all()]:
    menu_notification = Order.objects.filter(is_ordered=True, rider__isnull=False, is_canceled=False, is_prepared=False, is_pickedup=False, is_delivered=False, seller=user.seller).count() >= 1

  return {
    'id': user.id,
    'username': user.username,
    'email': user.email,
    'first_name': user.first_name,
    'last_name': user.last_name,
    'contact': user.contact,
    'gender': user.gender,
    'picture': user.picture.url if user.picture else None,

    'addresses': addresses,
    'groups': groups,
    
    'date_joned': user.date_joined,

    'is_staff': user.is_staff,
    'is_superuser': user.is_superuser,

    'menu_notification': menu_notification,

    'rider_info': {
      'plate_number': user.plate_number,
      'review_total': user.rider_rating,
      'accounts_payable': sum([(order.ordered_subtotal-(order.ordered_commission if order.ordered_commission else 0))+order.ordered_shipping_commission for order in Order.objects.filter(rider=user, is_canceled=False, is_delivered=True)]) - sum([int(payment.amount) for payment in CommissionPayment.objects.filter(rider=user)]),
      'commission_payments': [{
        'id': payment.id,
        'ref_code': payment.ref_code,
        'description': payment.description,
        'date_paid': payment.date_paid,
        'amount': payment.amount
      } for payment in CommissionPayment.objects.filter(rider=user)]
    } if 'rider' in groups or user.is_superuser else None,

    'seller': {
      'id': user.seller.id,
      'name': user.seller.name
    } if 'seller' in groups else None,
  }
    
class LoginAPI(GenericAPIView):
  serializer_class = LoginSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data

    _, token = AuthToken.objects.create(user)

    response = Response({
      'user': get_user_data(user),
      'token': token
    })

    request.session['auth_token'] = token
    request.session.set_expiry(60*60*24*29)

    return response

class SocialAuthAPI(GenericAPIView):
  serializer_class = SocialAuthSerializer

  def post(self, request, *args, **kwargs):
    if request.data['fbid'] == settings.FACEBOOK_AUTH_ID:
      serializer = self.get_serializer(data=request.data)
      regex = r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'
      if re.search(regex, request.data['email']):
        try:
          try:
            user = User.objects.get(email=request.data['email'], is_active=True, facebook_id=request.data['facebook_id'])
          except:
            user = User.objects.get(email=request.data['email'], is_active=True)

        except:
          user = None

        if user:
          _, token = AuthToken.objects.create(user)
          if not user.facebook_id:
            user.facebook_id = request.data['facebook_id']
            user.save()

          response = Response({
            'user': get_user_data(user),
            'token': token
          })

          request.session['auth_token'] = token
          request.session.set_expiry(60*60*24*30)

          return response

      else:
        raise ValidationError('Invalid email') 


      if serializer.is_valid(raise_exception=True):
        user = serializer.save()

        user.is_active = True
        user.save()

        current_site = get_current_site(self.request)
        mail_subject = 'Welcome to Trike'
        message = render_to_string(
          'welcome_email.html',
          {
            'user': user,
            'domain': current_site.domain,
          }
        )
        send_mail(
          mail_subject,
          message,
          'Trike <info@trike.com.ph>',
          [user.email],
          fail_silently=False
        )

        _, token = AuthToken.objects.create(user)
        response = Response({
          'user': get_user_data(user),
          'token': token
        })

        request.session['auth_token'] = token
        request.session.set_expiry(60*60*24*30)

        return response
      
class SingupAPI(GenericAPIView):
  serializer_class = RegisterSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    user.is_active = False
    user.save()
    
    current_site = get_current_site(self.request)
    mail_subject = 'Activate your Trike account'
    message = render_to_string(
      'acc_active_email.html',
      {
        'user': user,
        'domain': current_site.domain,
        'uid':urlsafe_base64_encode(force_bytes(user.pk)),
        'token':account_activation_token.make_token(user),
      }
    )
    
    email = user.email
    send_mail(
      mail_subject,
      message,
      'Trike <info@trike.com.ph>',
      [email],
      fail_silently=False
    )

    return Response({'status': 'okay'})

class ActivateAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      uid = force_text(urlsafe_base64_decode(request.data['uidb64']))
      user = User.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None and account_activation_token.check_token(user, request.data['token']):
      user.is_active = True
      user.save()

      current_site = get_current_site(self.request)
      mail_subject = 'Welcome to Trike'
      message = render_to_string(
        'welcome_email.html',
        {
          'user': user,
          'domain': current_site.domain,
        }
      )
      send_mail(
        mail_subject,
        message,
        'Trike <info@trike.com.ph>',
        [user.email],
        fail_silently=False
      )

      _, token = AuthToken.objects.create(user)
      response = Response({
        'status': 'okay',
        'user': get_user_data(user),
        'token': token
      })

      request.session['auth_token'] = token
      request.session.set_expiry(60*60*24*30)

      return response
    else:
      return Response({
        'status': 'error',
      })

class LogoutAPI(GenericAPIView):
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def post(self, request, *args, **kwargs):
    self.object = self.get_object()
    AuthToken.objects.filter(user=self.object).delete()
    response = Response({
      'status': 'okay'
    })

    del request.session['auth_token']
    return response
    
class TokenAPI(GenericAPIView):

  def get(self, request, pk=None):
    if request.session.get('auth_token', False):
      return Response(request.session.get('auth_token'))
    else:
      return Response(None)

class UserAPI(RetrieveAPIView, UpdateAPIView):
  serializer_class = UserSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def get(self, request):
    return Response(get_user_data(request.user))

class AddressAPI(CreateModelMixin, DestroyModelMixin, RetrieveModelMixin,viewsets.GenericViewSet):
  serializer_class = AddressSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return get_object_or_404(Address, id=self.kwargs['pk'])

class ChangePasswordAPI(RetrieveAPIView, UpdateAPIView):
  model = User
  serializer_class = ChangePasswordSerializer
  permission_classes = [IsAuthenticated]

  def get_object(self):
    return self.request.user

  def update(self, request, *args, **kwargs):
    self.object = self.get_object()
    serializer = self.get_serializer(data=request.data)

    if serializer.is_valid():
      # Check old password
      if not self.object.check_password(serializer.data.get("old_password")):
        return Response({
        'status': 'error',
        'message': 'Wrong Password',
      })
      # set_password also hashes the password that the user will get
      self.object.set_password(serializer.data.get("new_password"))
      self.object.save()

      return Response({
        'status': 'okay',
        'message': 'Password updated successfully',
      })

    return Response(serializer.errors)

# Request reset - Password Reset
class PasswordResetAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      email = request.data['email']
      try:
        validate_email(email)
      except:
        return Response({
          'status': 'error',
          'msg': 'Invalid email',
        })
      user = User.objects.get(email=email)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None:
      current_site = get_current_site(self.request)
      mail_subject = 'Reset your Trike account\'s Password'
      message = render_to_string(
        'password_reset_email.html',
        {
          'user': user,
          'domain': current_site.domain,
          'uid':urlsafe_base64_encode(force_bytes(user.pk)),
          'token':account_activation_token.make_token(user),
        }
      )
      send_mail(
        mail_subject,
        message,
        'Trike <info@trike.com.ph>',
        [email],
        fail_silently=False
      )
      
      return Response({
        'status': 'okay',
        'msg': 'Email has been sent. Please check your email',
      })
    else:
      return Response({
        'status': 'error',
        'msg': 'Entered email does not exist',
      })

# Verify secret and token - Password Reset
class VerifyPasswordResetAPI(GenericAPIView):

  def post(self, request, *args, **kwargs):
    try:
      uid = force_text(urlsafe_base64_decode(request.data['uidb64']))
      user = User.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    if user is not None and account_activation_token.check_token(user, request.data['token']):
      addresses = [{
        'id': address.id,
        'user': address.user.id,
        'latitude': address.latitude,
        'longitude': address.longitude,
        'address': address.address,
      } for address in user.addresses.all()]

      groups = [{
        'id': group.id,
        'name': group.name,
      } for group in user.groups.all()]

      return Response({
        'status': 'okay',
        'user': {
          'id': user.id,
          'username': user.username,
          'email': user.email,
          'first_name': user.first_name,
          'last_name': user.last_name,
          'contact': user.contact,
          'gender': user.gender,
          'picture': user.picture,
          'is_staff': user.is_staff,
          'is_superuser': user.is_superuser,
          'addresses': addresses,
          'groups': groups,
        }
      })
    else:
      return Response({
        'status': 'error',
      })
      
# Process reset - Password Reset
class ResetPasswordAPI(RetrieveAPIView, UpdateAPIView):
  model = User
  serializer_class = ResetPasswordSerializer

  def get_object(self):
    try:
      uid = force_text(urlsafe_base64_decode(self.request.data['uidb64']))
      user = User.objects.get(id=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
      user = None
    return user

  def update(self, request, *args, **kwargs):
    self.object = self.get_object()
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid():
      if self.object is not None and account_activation_token.check_token(self.object, serializer.data.get("token")):
        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()
        return Response({
          'status': 'okay',
        })
      else:
        return Response({
          'status': 'error',
        })
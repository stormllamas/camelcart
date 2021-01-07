from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import Address
User = get_user_model()

from django.utils.crypto import get_random_string

def makeID(length):
  return get_random_string(length=length, allowed_chars='01234567889')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      'id', 'username', 'email', 'first_name', 'last_name', 'contact', 'gender',
      'is_staff', 'is_superuser', 'picture'
    ]
    extra_kwargs = {
      'email': {'read_only': True},
      'is_staff': {'read_only': True},
      'is_superuser': {'read_only': True}
    }

class AddressSerializer(serializers.ModelSerializer):
  class Meta:
    model = Address
    fields = ['id', 'user', 'latitude', 'longitude', 'address', 'name']

class RegisterSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      'id',
      'first_name',
      'last_name',
      # 'email',
      'password',
    ]
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    print(self.data)
    try:
      user_exists = User.objects.get(email=validated_data['email'], is_active=True)
    except:
      user_exists = None

    
    if not user_exists:
      fn = validated_data['first_name'].split()
      ln = validated_data['last_name'].split()
      name = ((fn[0]+ln[0]).lower())+makeID(4)

      try:
        email_exists = User.objects.get(email=validated_data['email'])
      except:
        email_exists = None
      
      if email_exists:
        email_exists.first_name = validated_data['first_name']
        email_exists.last_name = validated_data['last_name']
        email_exists.password = set_password(validated_data['password'])
        return email_exists
      
      else:
        user = User.objects.create_user(
          username=name,
          email=validated_data['email'],
          password=validated_data['password'],
          first_name=validated_data['first_name'],
          last_name=validated_data['last_name'],
        )

        return user

    else:
      raise serializers.ValidationError("Email has already been used")

class LoginSerializer(serializers.Serializer):
  email = serializers.CharField()
  password = serializers.CharField()

  def validate(self, data):
    try:
      user_exists = User.objects.get(email=data.get('email'), is_active=True)
    except:
      # raise serializers.ValidationError("The usename or password you have entered is incorrect")
      return {
        'status': 'error',
        'msg': 'User not active'
      }

    if user_exists.is_active:
      user = authenticate(**data)
      if user:
        return user
      else:
        raise serializers.ValidationError("The usename or password you have entered is incorrect")
      
    else:
      raise serializers.ValidationError(user.email)

class SocialAuthSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = [
      'id',
      'first_name',
      'last_name',
      'email',
      'picture',
      'facebook_id',
    ]
    extra_kwargs = {'facebook_id': {'write_only': True}}

  def create(self, validated_data):
    try:
      user_exists = User.objects.get(email=validated_data['email'], is_active=True)
    except:
      user_exists = None

    if not user_exists:
      n = validated_data['first_name'].split()
      name = ((n[0]+(n[1] if n[1] else '')).lower())+makeID(4)

      user = User.objects.create_user(
        username=name,
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        facebook_id=validated_data['facebook_id'],
      )
      return user

    else:
      user = user_exist
      user.facebook_id = validated_data['facebook_id']
      return user

class ChangePasswordSerializer(serializers.Serializer):
  model = User
  old_password = serializers.CharField(required=True)
  new_password = serializers.CharField(required=True)

class ResetPasswordSerializer(serializers.Serializer):
  model = User
  uidb64 = serializers.CharField(required=True)
  token = serializers.CharField(required=True)
  new_password = serializers.CharField(required=True)
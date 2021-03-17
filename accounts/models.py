from django.db import models
from django.conf import settings

# Models
from logistics.models import OrderReview, Vehicle, PromoCode

# Custom User
from django.contrib.auth.models import UserManager, AbstractUser

# Tools
import math

def normal_round(n):
  if n - math.floor(n) < 0.5:
    return math.floor(n)
  return math.ceil(n)

class User(AbstractUser):
  # Additional fields
  facebook_id = models.CharField(max_length=25, blank=True, null=True)

  email = models.EmailField(max_length=254, blank=False, null=False, unique=True)
  username = models.CharField(max_length=55, unique=True)
  contact = models.CharField(max_length=55, blank=True, null=True)
  gender = models.CharField(max_length=10, blank=True, null=True)
  picture = models.ImageField(upload_to='photos/profile_pictures/%Y/%m/%d/', blank=True, null=True)
  vehicle = models.ForeignKey(Vehicle, related_name='users', on_delete=models.SET_NULL, blank=True, null=True)
  plate_number = models.CharField(max_length=55, unique=True, blank=True, null=True)
  promo_codes_used = models.ManyToManyField(PromoCode, blank=True)

  objects = UserManager()
  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

  def __str__(self):
    return self.email

  @property
  def rider_rating(self):
    try:
      rating = normal_round(sum([int(review.rating) for review in OrderReview.objects.filter(order__rider=self)])/OrderReview.objects.filter(order__rider=self).count())
    except:
      rating = 0
    return rating


   
class Address(models.Model):
  name = models.CharField(max_length=225, null=True, blank=True)
  user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)

  latitude = models.CharField(max_length=91)
  longitude = models.CharField(max_length=91)
  address = models.CharField(max_length=225)

  def __str__(self):
    return f'{self.user.email}'
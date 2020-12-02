from rest_framework import serializers
from .models import Order, OrderItem, Seller, CategoryGroup, Category, Product, ProductReview, OrderReview

class OrderSerializer(serializers.ModelSerializer):
  class Meta:
    model = Order
    fields = [
      'id', 'user', 'ref_code', 'order_type',
      
      'first_name', 'last_name',
      'contact', 'email', 'gender',
      
      'unit', 'weight', 'height', 'width', 'length', 'description',

      'loc1_latitude', 'loc1_longitude', 'loc1_address',
      'loc2_latitude', 'loc2_longitude', 'loc2_address',
      'distance_text', 'distance_value', 'duration_text', 'duration_value',

      'payment_type',
      'auth_id', 'capture_id',
      'is_ordered', 'date_ordered', 'is_paid', 'rider_payment_needed', 'two_way', 'vehicle_chosen', 'date_paid',

      'shipping',
    ]

class OrderItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderItem
    fields = ['id', 'order', 'product_variant', 'quantity', 'is_ordered', 'date_ordered', 'ordered_price']

class SellerSerializer(serializers.ModelSerializer):
  class Meta:
    model = Seller
    fields = [
      'id', 'name', 'contact', 'description',
      'latitude', 'longitude',
      'thumbnail', 'categories',
      'name_to_url', 'total_rating', 'total_rating_unrounded', 'review_count'
    ]

class CategoryGroupSerializer(serializers.ModelSerializer):
  class Meta:
    model = CategoryGroup
    fields = ['id', 'name']

class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields = ['id', 'category_group', 'name', 'thumbnail', 'seller_count']

class ProductSerializer(serializers.ModelSerializer):
  class Meta:
    model = Product
    fields = [
      'id', 'name', 'seller', 'categories', 'description',
      'thumbnail', 'photo_1', 'photo_2', 'photo_3',
      'feature', 'name_to_url',
      'cheapest_variant_price',
      'total_rating',
    ]

class ProductReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = ProductReview
    fields = '__all__'

class OrderReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model = OrderReview
    fields = '__all__'
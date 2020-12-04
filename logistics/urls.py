from django.urls import path
from rest_framework import routers
from .api import CurrentOrderAPI, OrdersAPI, OrderAPI, SellersAPI, SellerAPI, CategoryGroupAPI, CategoryAPI, ProductsAPI, ProductAPI, OrderItemAPI, ChangeQuantityAPI, CancelOrderAPI, CompleteOrderAPI, NewOrderUpdateAPI, ProductReviewAPI, OrderReviewAPI

urlpatterns = [
  path('api/category_groups/', CategoryGroupAPI.as_view(), name='category_groups'),
  path('api/category/', CategoryAPI.as_view(), name='category_groups'),

  path('api/products/', ProductsAPI.as_view(), name='products'),
  path('api/product/<str:product_name>/', ProductAPI.as_view(), name='product'),

  path('api/sellers/', SellersAPI.as_view(), name='sellers'),
  path('api/seller/<str:seller_name>/', SellerAPI.as_view(), name='seller'),
  
  path('api/current_order/<str:order_type>/', CurrentOrderAPI.as_view(), name='current_order'),

  path('api/orders/', OrdersAPI.as_view(), name='orders'),
  path('api/order/<int:pk>/', OrderAPI.as_view(), name='order'),

  path('api/order_item/', OrderItemAPI.as_view(), name='order_item'),
  path('api/order_item/<int:pk>/', OrderItemAPI.as_view(), name='order_item'),
  path('api/change_quantity/<int:pk>/<str:operation>/', ChangeQuantityAPI.as_view(), name='change_quantity'),
  path('api/cancel_order/<int:order_id>/', CancelOrderAPI.as_view(), name='cancel_order'),
  
  path('api/complete_order/<int:paid>/<str:order_type>/', CompleteOrderAPI.as_view(), name='complete_order'),
  path('api/new_order_update/', NewOrderUpdateAPI.as_view(), name='new_order_update'),

  path('api/review_product/', ProductReviewAPI.as_view(), name='review_product'),
  path('api/review_order/', OrderReviewAPI.as_view(), name='review_order'),
]

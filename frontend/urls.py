from django.urls import path
from . import views

urlpatterns = [
  path('', views.IndexView.as_view(), name='index'),
  path('signup', views.IndexView.as_view(), name='signup'),
  path('activate/<uidb64>/<token>/', views.IndexView.as_view(), name='activate'),
  path('confirm_email/<email>', views.IndexView.as_view(), name='confirm_email'),
  path('login', views.IndexView.as_view(), name='login'),
  path('logout', views.IndexView.as_view(), name='logout'),
  path('password_reset', views.IndexView.as_view(), name='password_reset'),
  path('password_reset_form/<uidb64>/<token>/', views.IndexView.as_view(), name='password_reset_form'),

  path('profile', views.IndexView.as_view(), name='profile'),
  path('security', views.IndexView.as_view(), name='security'),
  path('bookings', views.IndexView.as_view(), name='bookings'),
  # path('favorites', views.IndexView.as_view(), name='favorites'),

  path('contact', views.IndexView.as_view(), name='contact'),
  path('rider_inquiry', views.IndexView.as_view(), name='rider_inquiry'),
  path('about', views.IndexView.as_view(), name='about'),
  path('terms_and_conditions', views.IndexView.as_view(), name='terms_and_conditions'),
  path('privacy_policy', views.IndexView.as_view(), name='privacy_policy'),
  path('questions/food', views.IndexView.as_view(), name='food'),
  path('questions/delivery_guide', views.IndexView.as_view(), name='delivery_guide'),
  path('questions/ride_guide', views.IndexView.as_view(), name='ride_guide'),
  path('questions/track_guide', views.IndexView.as_view(), name='track_guide'),
  path('questions/rates', views.IndexView.as_view(), name='rates'),
  path('questions/operating_hours', views.IndexView.as_view(), name='operating_hours'),

  path('delivery', views.IndexView.as_view(), name='delivery'),
  path('delivery/payments', views.IndexView.as_view(), name='delivery_payments'),

  path('ride_hail', views.IndexView.as_view(), name='ride_hail'),
  path('ride_hail/payments', views.IndexView.as_view(), name='ride_hail_payments'),

  path('food', views.IndexView.as_view(), name='food'),
  path('food/restaurant', views.IndexView.as_view(), name='restaurant'),
  path('food/restaurant/product', views.IndexView.as_view(), name='item'),
  path('food/order_payment/<str:seller>', views.IndexView.as_view(), name='order_payment'),

  # path('shopper', views.IndexView.as_view(), name='shopper'),
  # path('shopper/payments', views.IndexView.as_view(), name='shopper_payments'),

  path('product_review/<int:pk>', views.IndexView.as_view(), name='product_review'),
  path('order_review/<int:pk>', views.IndexView.as_view(), name='order_review'),

  path('seller_dashboard', views.IndexView.as_view(), name='seller_dashboard'),
  path('admin/dashboard', views.IndexView.as_view(), name='admin_dashboard'),
  path('seller_manager/new_orders', views.IndexView.as_view(), name='seller_new_orders'),
  path('seller_manager/prepared_orders', views.IndexView.as_view(), name='seller_prepared_orders'),
  path('order_manager/unclaimed', views.IndexView.as_view(), name='unclaimed'),
  path('order_manager/claimed', views.IndexView.as_view(), name='claimed'),
  path('order_manager/undelivered', views.IndexView.as_view(), name='undelivered'),
  path('order_manager/delivered', views.IndexView.as_view(), name='delivered'),
  # path('admin_manager/refund_requests', views.IndexView.as_view(), name='refund_requests'),
  # path('admin_manager/approved_refunds', views.IndexView.as_view(), name='approved_refunds'),
  # path('admin_manager/resolved_refunds', views.IndexView.as_view(), name='resolved_refunds'),
  # path('request_refund', views.IndexView.as_view(), name='request_refund'),
]
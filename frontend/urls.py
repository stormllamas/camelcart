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

  path('delivery', views.IndexView.as_view(), name='delivery'),
  path('delivery/payments', views.IndexView.as_view(), name='delivery_payments'),

  path('food', views.IndexView.as_view(), name='food'),
  path('food/restaurant', views.IndexView.as_view(), name='restaurant'),
  path('food/restaurant/product', views.IndexView.as_view(), name='item'),
  path('food/order_payment/<str:seller>', views.IndexView.as_view(), name='order_payment'),

  # path('shopper', views.IndexView.as_view(), name='shopper'),
  # path('shopper/payments', views.IndexView.as_view(), name='shopper_payments'),

  path('product_review/<int:pk>', views.IndexView.as_view(), name='product_review'),
  path('order_review/<int:pk>', views.IndexView.as_view(), name='order_review'),

  path('admin/dashboard', views.IndexView.as_view(), name='admin_dashboard'),
  path('order_manager/unclaimed', views.IndexView.as_view(), name='unclaimed'),
  path('order_manager/claimed', views.IndexView.as_view(), name='claimed'),
  path('order_manager/undelivered', views.IndexView.as_view(), name='undelivered'),
  path('order_manager/delivered', views.IndexView.as_view(), name='delivered'),
  # path('admin_manager/refund_requests', views.IndexView.as_view(), name='refund_requests'),
  # path('admin_manager/approved_refunds', views.IndexView.as_view(), name='approved_refunds'),
  # path('admin_manager/resolved_refunds', views.IndexView.as_view(), name='resolved_refunds'),
  # path('request_refund', views.IndexView.as_view(), name='request_refund'),
]
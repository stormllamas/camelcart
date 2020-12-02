from django.urls import path, include
from rest_framework import routers
from .api import DashboardAPI, SellerDashboardDataAPI, OrderItemsAPI, DeliverOrderItemAPI, DeliverOrderAPI, PickupOrderItemAPI, PickupOrderAPI, OrdersAPI, OrderAPI, ClaimOrderAPI, PrepareOrderAPI, RiderCancelOrderAPI, IsPublishedAPI
from knox import views as knox_views

urlpatterns = [
  path('api/manager/dashboard_data', DashboardAPI.as_view(), name='dashboard_data'),
  path('api/manager/seller_dashboard_data', SellerDashboardDataAPI.as_view(), name='seller_dashboard_data'),
  path('api/manager/toggle_is_published/<int:product_id>/', IsPublishedAPI.as_view(), name='toggle_is_published'),
  path('api/manager/orders', OrdersAPI.as_view(), name='orders'),
  path('api/manager/order/<int:pk>/', OrderAPI.as_view(), name='order'),
  path('api/manager/claim_order/<int:order_id>/', ClaimOrderAPI.as_view(), name='claim_order'),
  path('api/manager/prepare_order/<int:order_id>/', PrepareOrderAPI.as_view(), name='prepare_order'),
  path('api/manager/cancel_order/<int:order_id>/', RiderCancelOrderAPI.as_view(), name='cancel_order'),
  path('api/manager/deliver_order_item/<int:pk>/', DeliverOrderItemAPI.as_view(), name='deliver_order_item'),
  path('api/manager/deliver_order/<int:pk>/', DeliverOrderAPI.as_view(), name='deliver_order'),
  path('api/manager/pickup_order_item/<int:pk>/', PickupOrderItemAPI.as_view(), name='pickup_order_item'),
  path('api/manager/pickup_order/<int:pk>/', PickupOrderAPI.as_view(), name='pickup_order'),
  path('api/manager/order_items', OrderItemsAPI.as_view(), name='order_items'),
  # path('api/admin/refunds', RefundsAPI.as_view(), name='refunds'),
]
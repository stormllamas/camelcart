# Packages
from rest_framework import viewsets, renderers
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, GenericAPIView
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin, DestroyModelMixin, CreateModelMixin
from rest_framework.response import Response

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from trike.permissions import IsOrderOwner, SiteEnabled, IsOrderItemOwner

# Models
from .models import Order, OrderItem, Seller, CategoryGroup, Category, Product, ProductReview, OrderReview

from configuration.models import SiteConfiguration
try:
  site_config = SiteConfiguration.objects.first()
except:
  site_config = None

# Serializers
from .serializers import OrderSerializer, OrderItemSerializer, SellerSerializer, CategoryGroupSerializer, CategorySerializer, ProductSerializer, ProductReviewSerializer, OrderReviewSerializer

# Tools
from trike.pagination import OctPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from decimal import Decimal

# Exceptions
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied

class CategoryGroupAPI(ListAPIView):
  serializer_class = CategoryGroupSerializer
  permission_classes = [SiteEnabled]

  def get_queryset(self):
    category_groups = CategoryGroup.objects.order_by('id')

    return category_groups
class CategoryAPI(ListAPIView):
  serializer_class = CategorySerializer
  permission_classes = [SiteEnabled]

  def get_queryset(self):
    group_query = Q()
    groupQuery = self.request.GET.getlist('group', None)

    if len(groupQuery) > 0:
      for groupQuery in groupQuery:
        try:
          group = CategoryGroup.objects.get(name=groupQuery)
          group_query.add(Q(category_group=group.id), Q.OR)
        except:
          pass

      categories = sorted(Category.objects.filter(group_query), key=lambda a: a.seller_count, reverse=True)
    else:
      categories = sorted(Category.objects.all(), key=lambda a: a.seller_count, reverse=True)

    return categories

class SellersAPI(ListAPIView):
  serializer_class = SellerSerializer
  pagination_class = OctPagination
  permission_classes = [SiteEnabled]

  def get_queryset(self):
    cuisine_query = Q()
    cuisineQuery = self.request.query_params.get('cuisine', None)

    if cuisineQuery:
      try:
        cuisine = Category.objects.get(name=cuisineQuery)
        cuisine_query.add(Q(categories=cuisine.id), Q.OR)
      except:
        pass

    queryset = Seller.objects.filter(cuisine_query).order_by('id')
    return queryset
class SellerAPI(GenericAPIView):
  serializer_class = SellerSerializer
  permission_classes = [SiteEnabled]

  def get(self, request, seller_name=None):
    sn = seller_name.replace('-',' ').replace('and', '&')
    seller = Seller.objects.get(name=sn)

    categories = [{
      'id': category.id,
      'name': category.name
    } for category in seller.categories.all()]
    features = [{
      'id': feature.id,
      'name': feature.name,
      'name_to_url': feature.name_to_url,
      'thumbnail': feature.thumbnail.url
    } for feature in Product.objects.filter(seller=seller.id, feature=True)]

    return Response({
      'id': seller.id,
      'name': seller.name,
      'contact': seller.contact,
      'description': seller.description,
      'latitude': seller.latitude,
      'longitude': seller.longitude,
      'address': seller.address,
      'thumbnail': seller.thumbnail.url,
      'name_to_url': seller.name_to_url,
      'categories': categories,
      'features': features,
    })

class ProductsAPI(ListAPIView):
  serializer_class = ProductSerializer
  pagination_class = OctPagination
  permission_classes = [SiteEnabled]

  def get_queryset(self):
    seller_query = Q()
    sellerQuery = self.request.query_params.get('seller', None)

    course_query = Q()
    courseQuery = self.request.query_params.get('course', None)

    feature_query = Q()
    featureQuery = self.request.query_params.get('feature', None)
   
    if sellerQuery:
      try:
        seller = Seller.objects.get(name=sellerQuery.replace('-', ' ').replace('and', '&'))
        seller_query.add(Q(seller=seller.id), Q.AND)
      except:
        pass

    if courseQuery:
      try:
        course = Category.objects.get(name=courseQuery)
        course_query.add(Q(categories=course.id), Q.AND)
      except:
        pass

    if featureQuery:
      feature_query.add(Q(feature=True), Q.AND)

    queryset = Product.objects.filter(course_query & seller_query & feature_query).order_by('id')

    return queryset
class ProductAPI(GenericAPIView):
  serializer_class = ProductSerializer
  permission_classes = [SiteEnabled]

  def get(self, request, product_name=None):
    pn = product_name.replace('-',' ')
    product = Product.objects.get(name=pn)

    categories = [category.name for category in product.categories.all()]

    variants = [{
      'id': variant.id,
      'name': variant.name,
      'price': float(variant.price)
    } for variant in product.variants.all()]

    return Response({
      'name': product.name,
      'description': product.description,
      'seller': {
        'id': product.seller.id,
        'name': product.seller.name,
        'thumbnail': product.seller.thumbnail.url,
        'latitude': product.seller.latitude,
        'longitude': product.seller.longitude,
        'address': product.seller.address,
      },
      'categories': categories,
      'thumbnail': product.thumbnail.url,
      'photo_1': product.photo_1.url if product.photo_1 else None,
      'photo_2': product.photo_2.url if product.photo_2 else None,
      'photo_3': product.photo_3.url if product.photo_3 else None,
      'variants': variants
    })

class CurrentOrderAPI(RetrieveAPIView, UpdateAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, IsOrderOwner, SiteEnabled]

  def get_object(self):
    order_type = self.kwargs['order_type']
    order_seller = self.request.query_params.get('order_seller', None)
    order_seller_name = self.request.query_params.get('order_seller_name', None)

    if order_seller or order_seller_name:
      try:
        if order_seller:
          seller = Seller.objects.get(id=order_seller)
        elif order_seller_name:
          seller = Seller.objects.get(name=order_seller_name)

      except:
        raise ObjectDoesNotExist('Seller with that id does not exist')
        seller = None

      Orders = Order.objects.filter(user=self.request.user, order_type=order_type, seller=seller, is_ordered=False)

      if len(Orders) < 1:
        Orders = Order.objects.create(user=self.request.user, order_type=order_type, seller=seller)
        Orders = Order.objects.filter(user=self.request.user, order_type=order_type, seller=seller, is_ordered=False)

      return Orders.first()

    else:
      Orders = Order.objects.filter(user=self.request.user, order_type=order_type, is_ordered=False).order_by('id')

      if len(Orders) < 1:
        Order.objects.create(user=self.request.user, order_type=order_type)
        Orders = Order.objects.filter(user=self.request.user, order_type=order_type, is_ordered=False).order_by('id')

      return Orders.first()

  def get(self, request, order_type=None):
    order = self.get_object()

    order_items = [{
      'id': order_item.id,
      'quantity': order_item.quantity,
      'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
      'order': {
        'id': order_item.order.id,
        'ref_code': order_item.order.ref_code
      },
      'product': {
        'id': order_item.product_variant.product.id,
        'name': order_item.product_variant.product.name,
        'description': order_item.product_variant.product.description,
        'thumbnail': order_item.product_variant.product.thumbnail.url,
      },
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'price': float(order_item.product_variant.final_price),
      },
    } for order_item in OrderItem.objects.filter(order=order).order_by('id')]

    try:
      seller = {
        'id': order.seller.id,
        'name': order.seller.name
      }
    except:
      seller = None
      
    return Response({
      'id': order.id, 'user': order.user.id, 'ref_code': order.ref_code,
      'order_type': order.order_type,
      'seller': seller,

      'first_name': order.first_name, 'last_name': order.last_name,
      'contact': order.contact, 'email': order.email, 'gender': order.gender,

      'unit': order.unit, 'weight': order.weight,
      'height': order.height, 'width': order.width, 'length': order.length, 'description': order.description,
      
      'payment_type': order.payment_type,
      'auth_id': order.auth_id,
      'capture_id': order.capture_id,
      
      'is_ordered': order.is_ordered, 'date_ordered': order.date_ordered,
      'is_paid': order.is_paid, 'date_paid': order.date_paid,
      
      'loc1_latitude': order.loc1_latitude,
      'loc1_longitude': order.loc1_longitude,
      'loc1_address': order.loc1_address,
      'loc2_latitude': order.loc2_latitude,
      'loc2_longitude': order.loc2_longitude,
      'loc2_address': order.loc2_address,

      'shipping': order.shipping,

      'count': order.count,
      'subtotal': order.subtotal,
      'total': order.total,

      'order_items': order_items,
    })
    
class OrdersAPI(GenericAPIView):
  permission_classes = [IsAuthenticated, SiteEnabled]

  def get(self, request):

    delivered_query = Q()
    delivered = self.request.query_params.get('delivered', None)
    if delivered == 'true':
      delivered_query.add(Q(is_delivered=True), Q.AND)
    elif delivered == 'false':
      delivered_query.add(Q(is_delivered=False), Q.AND)

    queryset_full_length = Order.objects.filter(Q(user=request.user, is_ordered=True) & delivered_query).count()

    page_query = int(self.request.query_params.get('page', 1))
    from_item = 0
    to_item = 4
    if page_query > 1:
      from_item = (page_query-1)*4
      to_item = page_query*4

    if (page_query*4) >= queryset_full_length:
      next_path = None
    else:
      next_path = f'api/orders?page={page_query+1}'

    if page_query > 1:
      previous_path = f'api/orders?page={page_query-1}'
    else:
      previous_path = None

    orders = [{
      'id': order.id, 'ref_code': order.ref_code,
      'order_type': order.order_type,
      'seller': {
        'id': order.seller.id if order.seller != None else None,
        'name': order.seller.name if order.seller != None else None
      },

      'unit': order.unit, 'weight': order.weight,
      'height': order.height, 'width': order.width, 'length': order.length, 'description': order.description,

      'loc1_address': order.loc1_address,
      'loc2_address': order.loc2_address,

      'payment_type': order.payment_type,
      'count': order.count, 'shipping': order.shipping, 'total': order.total,
      
      'ordered_subtotal': sum([item.quantity*item.ordered_price if item.is_ordered and item.ordered_price else 0 for item in order.order_items.all()]),
      'date_ordered': order.date_ordered,

      'rider': {
        'id': order.rider.id if order.rider != None else None,
        'name': f'{order.rider.first_name} {order.rider.last_name}' if order.rider != None else None,
      },
      'is_claimed': True if order.rider != None else False, 'date_claimed': order.date_claimed,
      'is_pickedup': order.is_pickedup, 'date_pickedup': order.date_pickedup,
      'is_delivered': order.is_delivered, 'date_delivered': order.date_delivered,
      
      'is_reviewed': True if OrderReview.objects.filter(order=order).exists() else False,
      
      'order_items': [{
        'id': order_item.id,
        'quantity': order_item.quantity,
        'ordered_price': order_item.ordered_price if order_item.ordered_price else 0,
        # 'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
        'is_reviewed': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
        # 'has_refund_request': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
        'is_delivered': order_item.is_delivered,
        'product': {
          'id': order_item.product_variant.product.id,
          'name': order_item.product_variant.product.name,
          'thumbnail': order_item.product_variant.product.thumbnail.url,
        },
        'product_variant': {
          'id': order_item.product_variant.id,
          'name': order_item.product_variant.name,
          # 'price': float(order_item.product_variant.final_price),
        },
      } for order_item in order.order_items.all()]

    } for order in Order.objects.filter(Q(user=request.user, is_ordered=True) & delivered_query).order_by('-date_ordered')[from_item:to_item]]

    return Response({
      'count': len(orders),
      'next': next_path,
      'previous': previous_path,
      'results': orders,
    })
class OrderAPI(RetrieveAPIView):
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.user == request.user and obj.is_ordered == True:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(Order, id=self.kwargs['pk']))
    return get_object_or_404(Order, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    order = self.get_object()

    return Response({
      'id': order.id,
      'ref_code': order.ref_code,
      'order_type': order.order_type,
      
      'count': order.count,

      'is_delivered': order.is_delivered,

      'is_ordered': order.is_ordered,
      'date_ordered': order.date_ordered,
      'ordered_price': order.ordered_subtotal,

      'is_reviewed': True if OrderReview.objects.filter(order=order).exists() else False,
      'review': {
        'id': order.review.id if OrderReview.objects.filter(order=order).exists() else None,
        'rating': order.review.rating if OrderReview.objects.filter(order=order).exists() else None,
        'comment': order.review.comment if OrderReview.objects.filter(order=order).exists() else None,
      },
      'user': {
        'id': order.user.id
      },
    })

class OrderItemAPI(DestroyAPIView, CreateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.order.user == request.user and obj.order.is_ordered == False:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def get(self, request, pk=None):
    order_item = self.get_object()

    return Response({
      'id': order_item.id,
      'quantity': order_item.quantity,
      'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
      'is_ordered': order_item.is_ordered,
      'picked_up': order_item.is_pickedup,
      'is_delivered': order_item.is_delivered,
      'is_reviewed': True if ProductReview.objects.filter(order_item=order_item).exists() else False,
      'review': {
        'id': order_item.review.id if ProductReview.objects.filter(order_item=order_item).exists() else None,
        'rating': order_item.review.rating if ProductReview.objects.filter(order_item=order_item).exists() else None,
        'comment': order_item.review.comment if ProductReview.objects.filter(order_item=order_item).exists() else None,
      },
      'order': {
        'id': order_item.order.id,
        'ref_code': order_item.order.ref_code,
        'is_delivered': order_item.order.is_delivered,
        'user': {
          'id': order_item.order.user.id
        },
        'is_reviewed': True if OrderReview.objects.filter(order=order_item.order).exists() else False,
        'review': {
          'id': order_item.order.review.id if OrderReview.objects.filter(order=order_item.order).exists() else None,
          'rating': order_item.order.review.rating if OrderReview.objects.filter(order=order_item.order).exists() else None,
          'comment': order_item.order.review.comment if OrderReview.objects.filter(order=order_item.order).exists() else None,
        }
      },
      'product': {
        'id': order_item.product_variant.product.id,
        'name': order_item.product_variant.product.name,
        'description': order_item.product_variant.product.description,
        'thumbnail': order_item.product_variant.product.thumbnail.url,
      },
      'product_variant': {
        'id': order_item.product_variant.id,
        'name': order_item.product_variant.name,
        'price': float(order_item.product_variant.final_price),
      },
    })

    try:
      seller = {
        'id': order.seller.id,
        'name': order.seller.name
      }
    except:
      seller = None

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      if serializer.validated_data.get('order').user == request.user:
        order = serializer.validated_data.get('order')
        product_variant = serializer.validated_data.get('product_variant')
        
        try:
          order_item = OrderItem.objects.get(order=order, product_variant=product_variant)
        except:
          order_item = None

        if order_item:
          if order_item.quantity < 10:
            order_item.quantity += 1
            order_item.save()
            return Response({
              'msg': 'Added to Order',
              'class': 'orange',
              'data': {
                'id': order_item.id,
                'order': order_item.order.id,
                'product_variant': order_item.product_variant.id,
                'quantity': order_item.quantity,
              }
            })
          else:
            return Response({
              'msg': 'Cannot add more',
              'class': 'red',
              'data': None
            })

        else:
          serializer.save()

          return Response({
            'msg': 'Added to Order',
            'class': 'orange',
            'data': serializer.data
          })

      else:
        return Response({
          'msg': 'Not Authorized',
          'class': 'red',
          'data': None
        })

    else:
      return Response({
        'msg': 'Body invalid',
        'class': 'red',
        'data': None
      })
class ChangeQuantityAPI(UpdateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def check_object_permissions(self, request, obj):
    if request.user:
      if request.user.is_superuser:
        return True
      else:
        if obj.order.user == request.user and obj.order.is_ordered == False:
          return True
        else:
          raise PermissionDenied
    else:
      return False

  def get_object(self):
    self.check_object_permissions(self.request, get_object_or_404(OrderItem, id=self.kwargs['pk']))
    return get_object_or_404(OrderItem, id=self.kwargs['pk'])

  def update(self, request, pk=None, operation='add'):
    order_item = self.get_object()

    if operation == 'add':
      if order_item.quantity < 10:
        order_item.quantity += 1
        order_item.save()
        return Response({
          'status': 'okay',
          'operation': operation,
          'msg': 'Quantity addition successful',
          'order_item': {
            'id': order_item.id,
            'quantity': order_item.quantity,
            'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
            'order': {
              'id': order_item.order.id,
              'ref_code': order_item.order.ref_code
            },
            'product': {
              'id': order_item.product_variant.product.id,
              'name': order_item.product_variant.product.name,
              'description': order_item.product_variant.product.description,
              'thumbnail': order_item.product_variant.product.thumbnail.url,
            },
            'product_variant': {
              'id': order_item.product_variant.id,
              'name': order_item.product_variant.name,
              'price': float(order_item.product_variant.final_price),
            },
          }
        })
      else:
        return Response({
          'status': 'error',
          'operation': operation,
          'msg': 'Order Exceeding'
        })

    elif operation == 'subtract':
      if order_item.quantity > 1:
        order_item.quantity -= 1
        order_item.save()
        return Response({
          'status': 'okay',
          'operation': operation,
          'msg': 'Quantity subtraction successful',
          'order_item': {
            'id': order_item.id,
            'quantity': order_item.quantity,
            'total_price': float(order_item.product_variant.final_price)*order_item.quantity,
            'order': {
              'id': order_item.order.id,
              'ref_code': order_item.order.ref_code
            },
            'product': {
              'id': order_item.product_variant.product.id,
              'name': order_item.product_variant.product.name,
              'description': order_item.product_variant.product.description,
              'thumbnail': order_item.product_variant.product.thumbnail.url,
            },
            'product_variant': {
              'id': order_item.product_variant.id,
              'name': order_item.product_variant.name,
              'price': float(order_item.product_variant.final_price),
            },
          }
        })
      else:
        return Response({
          'status': 'error',
          'operation': operation,
          'msg': 'Quantity too low'
        })

class CompleteOrderAPI(UpdateAPIView):
  serializer_class = OrderItemSerializer
  permission_classes = [IsAuthenticated, IsOrderOwner, SiteEnabled]

  def get_object(self):
    order_type = self.kwargs['order_type']
    order_seller = self.request.query_params.get('order_seller', None)
    order_seller_name = self.request.query_params.get('order_seller_name', None)

    if order_seller or order_seller_name:
      try:
        if order_seller:
          seller = Seller.objects.get(id=order_seller)
        elif order_seller_name:
          seller = Seller.objects.get(name=order_seller_name)

      except:
        raise ObjectDoesNotExist('Seller with that id does not exist')
        seller = None

      Orders = Order.objects.filter(user=self.request.user, order_type=order_type, seller=seller, is_ordered=False)

      if len(Orders) < 1:
        Orders = Order.objects.create(user=self.request.user, order_type=order_type, seller=seller)
        Orders = Order.objects.filter(user=self.request.user, order_type=order_type, seller=seller, is_ordered=False)

      return Orders.first()

    else:
      Orders = Order.objects.filter(user=self.request.user, order_type=order_type, is_ordered=False).order_by('id')

      if len(Orders) < 1:
        Order.objects.create(user=self.request.user, order_type=order_type)
        Orders = Order.objects.filter(user=self.request.user, order_type=order_type, is_ordered=False).order_by('id')

      return Orders.first()

  def update(self, request, paid=None, order_type=None):
    order = self.get_object()
    print(order)
    order_valid = False
    carried_order_items = []

    for order_item in order.order_items.all():
      order_item.is_ordered = True
      order_item.date_ordered = timezone.now()
      order_item.ordered_price = order_item.product_variant.final_price
      order_item.save()

    order.is_ordered = True
    order.date_ordered = timezone.now()
    order.is_paid = True if paid == 2 else False
    order.date_paid = timezone.now() if paid == 2 else None
    order.payment_type = paid
    order.auth_id = request.data['auth_id'] if paid == 2 else None
    order.capture_id = request.data['capture_id'] if paid == 2 else None
    order.save()
    
    # Carry invalid order items to new order
    new_order = Order.objects.create(user=self.request.user)
      
    for order_item in order.order_items.filter(is_ordered=False):
      order_item.order = new_order
      order_item.save()

    return Response({
      'status': 'success',
      'msg': 'Order Finalized'
    })

class ProductReviewAPI(CreateAPIView):
  serializer_class = ProductReviewSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user = serializer.validated_data.get("user")
      product_variant = serializer.validated_data.get("product_variant")
      order_item = serializer.validated_data.get("order_item")
      
      try:
        review_exists = ProductReview.objects.get(product_variant=product_variant, user=user, order_item=order_item)
      except:
        review_exists = None

      if review_exists:
        return Response({
          'status': 'error',
          'message': 'Product already reviewed'
        })
      else:
        if serializer.validated_data.get("user") == request.user:
          serializer.save()
          return Response({
            'status': 'okay',
            'data': serializer.data
          })
        else:
          return Response({
            'status': 'error',
            'message': 'Product already reviewed'
          })

    else:
      return Response({
        'status': 'error',
        'message': 'Product already reviewed'
      })
class OrderReviewAPI(CreateAPIView):
  serializer_class = OrderReviewSerializer
  permission_classes = [IsAuthenticated, SiteEnabled]

  def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    print(request.data)
    if serializer.is_valid(raise_exception=True):
      print('valid')
      user = serializer.validated_data.get("user")
      order = serializer.validated_data.get("order")
      
      try:
        review_exists = OrderReview.objects.get(user=user, order=order)
      except:
        review_exists = None

      if review_exists:
        return Response({
          'status': 'error',
          'message': 'Order already reviewed'
        })
      else:
        if serializer.validated_data.get("user") == request.user:
          serializer.save()
          return Response({
            'status': 'okay',
            'data': serializer.data
          })
        else:
          return Response({
            'status': 'error',
            'message': 'Order already reviewed'
          })

    else:
      return Response({
        'status': 'error',
        'message': 'Order already reviewed'
      })

# class FavoritesAPI(CreateAPIView, ListAPIView):
#   serializer_class = FavoriteSerializer
#   permission_classes = [IsAuthenticated]

#   def get_queryset(self):
#     return Favorite.objects.filter(user=self.request.user).order_by('-date_created')

# # Fetched based on product id in kwargs
# class FavoriteAPI(DestroyAPIView):
#   serializer_class = FavoriteSerializer
#   permission_classes = [IsAuthenticated]

#   def get_object(self):
#     return get_object_or_404(Favorite, user=self.request.user, product=self.kwargs['product'])


# class RequestRefundAPI(CreateAPIView):
#   serializer_class = RefundRequestSerializer
#   permission_classes = [IsAuthenticated, SiteEnabled]

#   def create(self, request, *args, **kwargs):
#     serializer = self.get_serializer(data=request.data)
#     if serializer.is_valid(raise_exception=True):
#       order_item = serializer.validated_data.get("order_item")
#       if order_item.order.user != request.user:
#         return Response({
#           'status': 'error',
#           'message': 'Refund already requested'
#         })
#       else:
#         serializer.save()
#         return Response({
#           'status': 'okay',
#           'data': serializer.data
#         })

#     else:
#       return Response({
#         'status': 'error',
#         'message': 'Refund already requested'
#       })
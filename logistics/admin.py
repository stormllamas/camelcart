from django.contrib import admin

from .models import Order, OrderItem, Seller, Category, CategoryGroup, Product, ProductVariant, ProductReview, OrderReview, Vehicle


class CategoryInLine(admin.TabularInline):
  model = Category
  extra = 1
  verbose_name_plural = "Categories"

class ProductVariantInLine(admin.TabularInline):
  model = ProductVariant
  extra = 1

class OrderItemInLine(admin.TabularInline):
  model = OrderItem
  extra = 1

class OrderAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['ref_code', 'user', 'order_type']}),
    ('Personal Details', {'fields': ['first_name', 'last_name', 'contact', 'email', 'gender']}),
    ('Delivery Details', {'fields': ['unit', 'weight', 'height', 'width', 'length', 'description']}),
    ('Delivery Points', {'fields': ['seller', 'loc1_latitude', 'loc1_longitude', 'loc1_address', 'loc2_latitude', 'loc2_longitude', 'loc2_address', 'distance_value', 'distance_text', 'duration_value', 'duration_text']}),
    ('Payments', {'fields': ['payment_type', 'auth_id', 'capture_id']}),
    ('Status', {'fields': ['rider_payment_needed', 'two_way', 'vehicle_chosen', 'is_ordered', 'date_ordered', 'ordered_shipping', 'ordered_commission', 'ordered_shipping_commission', 'is_paid', 'date_paid', 'rider', 'date_claimed', 'is_prepared', 'date_prepared', 'is_canceled', 'date_canceled', 'is_pickedup', 'date_pickedup', 'is_delivered', 'date_delivered']}),
  ]
  inlines = [OrderItemInLine]
  list_display = ('ref_code', 'user', 'order_type', 'is_ordered', 'date_ordered', 'rider', 'is_delivered', 'payment_type', 'is_paid')
  list_display_links = ('ref_code',)
  list_filter = ('payment_type', 'is_ordered', 'is_delivered', 'is_paid')
  list_per_page = 50
  search_fields = ('ref_code', )

admin.site.register(Order, OrderAdmin)

class SellerAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['user', 'name', 'categories', 'commission']}),
    ('Location', {'fields': ['latitude', 'longitude', 'address']}),
    ('Display', {'fields': ['thumbnail']}),
  ]
  list_display = ('name',)
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(Seller, SellerAdmin)

class ProductAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['name', 'seller', 'categories', 'description', 'feature']}),
    ('Photos', {'fields': ['thumbnail', 'photo_1', 'photo_2', 'photo_3']}),
    ('Tracking', {'fields': ['date_published', 'is_published']}),
  ]
  inlines = [ProductVariantInLine]
  list_display = ('name', 'seller', 'is_published', 'feature', 'date_published')
  list_editable = ('is_published', 'feature')
  list_filter = ('seller',)
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name', 'seller')

admin.site.register(Product, ProductAdmin)

class ProductReviewAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['order_item', 'product_variant', 'user', 'rating', 'comment']}),
  ]
  list_display = ('order_item', 'product_variant', 'user', 'rating')
  list_filter = ('rating',)
  list_display_links = ('order_item',)
  list_per_page = 50
  search_fields = ('order_item',)

admin.site.register(ProductReview, ProductReviewAdmin)

class OrderReviewAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['order', 'user', 'rating', 'comment']}),
  ]
  list_display = ('order', 'user', 'rating')
  list_filter = ('rating',)
  list_display_links = ('order',)
  list_per_page = 50
  search_fields = ('order',)

admin.site.register(OrderReview, OrderReviewAdmin)

class CategoryGroupAdmin(admin.ModelAdmin):
  fieldsets = [
    (None, {'fields': ['name']}),
  ]
  inlines = [CategoryInLine]
  list_display = ('name',)
  list_display_links = ('name',)
  list_per_page = 50
  search_fields = ('name',)

admin.site.register(CategoryGroup, CategoryGroupAdmin)

admin.site.register(Vehicle)

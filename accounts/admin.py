from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address
from logistics.models import Favorite, CommissionPayment, PromoCode

class FavoritesInLine(admin.TabularInline):
    model = Favorite
    extra = 0
    verbose_name_plural = "Favorites"

class CommissionPaymentInLine(admin.TabularInline):
    model = CommissionPayment
    extra = 0
    verbose_name_plural = "Commission Payments"

class AddressInLine(admin.TabularInline):
    model = Address
    extra = 0
    verbose_name_plural = "Addresses"

class PromoCodeInLine(admin.TabularInline):
  model = PromoCode
  extra = 0
  verbose_name_plural = "Referral Codes"

class MyUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Contact Info', {'fields': ['contact']}),
        ('Rider Info', {'fields': ['plate_number', 'picture']}),
        ('Social Auth', {'fields': ['facebook_id']}),
        ('Other', {'fields': ['promo_codes_used']}),
    )
    list_display = ('email', 'date_joined', 'first_name', 'last_name', 'username', 'contact')
    list_display_links = ('email',)
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    list_per_page = 25
    search_fields = ('username', 'first_name', 'last_name', 'email')

    inlines = [FavoritesInLine, AddressInLine, CommissionPaymentInLine, PromoCodeInLine]

admin.site.register(User, MyUserAdmin)
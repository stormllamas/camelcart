from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Address
from logistics.models import Favorite

class FavoritesInLine(admin.TabularInline):
    model = Favorite
    extra = 0
    verbose_name_plural = "Favorites"

class AddressInLine(admin.TabularInline):
    model = Address
    extra = 0
    verbose_name_plural = "Addresses"

class MyUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        # ('Address Details', {'fields': ['address_street', 'address_line_2', 'address_city', 'address_region', 'address_country', 'address_zipcode']}),
        ('Contact Info', {'fields': ['contact', 'picture']}),
    )
    list_display = ('email', 'first_name', 'last_name', 'username', 'contact')
    list_display_links = ('email',)
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    list_per_page = 25
    search_fields = ('username', 'first_name', 'last_name')

    inlines = [FavoritesInLine, AddressInLine]

admin.site.register(User, MyUserAdmin)
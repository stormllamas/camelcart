from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.conf.urls import url
from django.urls import path, include

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('accounts.urls')),
    path('', include('configuration.urls')),
    path('', include('logistics.urls')),
    path('', include('manager.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += [url(r'^.*$', frontend_views.IndexView.as_view(), name="page404")]
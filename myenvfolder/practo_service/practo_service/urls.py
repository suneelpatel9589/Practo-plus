from django.contrib import admin
<<<<<<< HEAD
from django.urls import path, include
=======
from django.urls import path, include, re_path
>>>>>>> 6e15ac83889b8f98efc76dd0555c53024a1b7366
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Home Services API",
        default_version='v1',
        description="API documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),

<<<<<<< HEAD
    path(
        'swagger/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='swagger'
    ),

    path(
        'redoc/',
        schema_view.with_ui('redoc', cache_timeout=0),
        name='redoc'
    ),
=======
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='redoc'),
>>>>>>> 6e15ac83889b8f98efc76dd0555c53024a1b7366
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.contrib import admin
from django.urls import path
from core import views
from core.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/user-role/', get_user_role, name='get_user_role'),
    path('api/teacher/', teacher_cabinet, name='teacher_cabinet'),
    path('api/student/', student_cabinet, name='student_cabinet'),
    path('api/electives/', all_electives, name='all_electives'),
    
]
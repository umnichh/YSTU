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
    # Админка Django
    path('admin/', admin.site.urls),

    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),  # POST: Получить JWT токен (login)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # POST: Обновить JWT токен
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),  # POST: Добавить токен в черный список (logout)
    # API для получения роли пользователя
    path('api/user-role/', UserRoleView.as_view(), name='get_user_role'),  # GET: Возвращает роль пользователя (student или teacher)
    # API для кабинета преподавателя
    path('api/teacher/', TeacherCabinetView.as_view(), name='teacher_cabinet'),  # GET: Данные кабинета преподавателя
    # API для кабинета студента
    path('api/student/', StudentCabinetView.as_view(), name='student_cabinet'),  # GET: Данные кабинета студента
    # API для получения всех элективов
    path('api/electives/', AllElectivesView.as_view(), name='all_electives'),  # GET: Возвращает все элективы
    # API для создания нового электива
    path('api/create-elective/', ElectiveView.as_view(), name='create_elective'),  # GET: Получить данные для создания электива, POST: Создать новый электив
    path('api/electives/<int:id>/', ElectiveDetailView.as_view(), name='elective_detail'), #ГАНДОН НА ИЛЬЕ
]


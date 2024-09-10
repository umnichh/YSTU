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

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),  # POST: Получить JWT токен (login)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # POST: Обновить JWT токен
    path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),  # POST: Добавить токен в черный список (logout)
    path('api/user-role/', UserRoleView.as_view(), name='get_user_role'),  # GET: Возвращает роль пользователя (student или teacher)
    path('api/teacher/', TeacherCabinetView.as_view(), name='teacher_cabinet'),  # GET: Данные кабинета преподавателя
    path('api/student/', StudentCabinetView.as_view(), name='student_cabinet'),  # GET: Данные кабинета студента
    path('api/electives/', AllElectivesView.as_view(), name='all_electives'),  # GET: Возвращает все элективы
    path('api/create-elective/', ElectiveView.as_view(), name='create_elective'),  # GET: Получить данные для создания электива, POST: Создать новый электив
    path('api/elective/<int:id>/', ElectiveDetailView.as_view(), name='elective_detail'), #GET: #ГАНДОН НА ИЛЬЕ
    path('api/elective/<int:id>/enroll', EnrollElectiveView.as_view(), name='enroll_elective'), # POST: ЗАПИСЬ НА ЭЛЕКТИВ
    path('api/elective/<int:id>/enroll', EnrollElectiveView.as_view(), name='enroll_elective'), # DELETE: ОТПИСКА ОТ ЭЛЕКТИВА
    path('api/electives/available/', ElectiveAvaliableStudentView.as_view(), name='available_electives'), #POST: элективы доступные студенту
    path('api/electives/student/', StudentElectiveView.as_view(), name='available_electives'), #GET: элективы на которые студент записан
    path('api/electives/teacher/', TeacherElectivView.as_view(), name='available_electives'), #GET: элективы которые ведёт преподаватель
]

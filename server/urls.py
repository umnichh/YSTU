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

   # JWT ГОВН
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),  # POST: Получить JWT токен (login)
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # POST: Обновить JWT токен
    path('api/auth/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),  # POST: Добавить токен в черный список (logout) не используем
 
    # После лоигна
    path('api/auth/user-role/', UserRoleView.as_view(), name='get_user_role'),  # GET: Возвращает роль пользователя (student или teacher)
 
    # Кабинеты препода/студента
    path('api/teacher/cabinet/', TeacherCabinetView.as_view(), name='teacher_cabinet'),  # GET: Данные кабинета преподавателя
    path('api/student/cabinet/', StudentCabinetView.as_view(), name='student_cabinet'),  # GET: Данные кабинета студента
 
    # Элективы()
    path('api/electives/', AllElectivesView.as_view(), name='all_electives'),  # GET: Возвращает все элективы
    path('api/electives/create/', ElectiveView.as_view(), name='create_elective'),  # POST: Создать новый электив
    path('api/electives/<int:id>/', ElectiveDetailView.as_view(), name='elective_detail'),  # GET: Получить детали электива, DELETE: Удалить электив
    path('api/electives/<int:id>/enroll/', EnrollElectiveView.as_view(), name='enroll_elective'),  # POST: Записаться на электив, DELETE: Отписаться от электива
 
    # Элективы у стдента
    path('api/electives/choice/', ElectiveAvaliableStudentView.as_view(), name='available_electives'),  # GET:  элективы доступные студенту
    path('api/electives/student/', StudentElectiveView.as_view(), name='student_electives'),  # GET: Элективы, на которые студент записан
 
    # Элективы у препода
    path('api/electives/teacher/', TeacherElectivView.as_view(), name='teacher_electives'),  # GET: Элективы, которые ведет преподаватель
    path('api/electives/created/', ElectivesMadeByTeacher.as_view(), name='teacher_created_electives'),  # GET: Список элективов, созданных преподавателем
 
    # говно
    path('api/institutes/upload/', UploadInstitutesView.as_view(), name='upload_institutes'),  # POST: Загрузка институтов/факультетов/профилей из эксель-файла
    path('api/institutes/', AllInstitutes.as_view(), name='all_institutes'),  # GET: Список всех институтов/направлений/профилей

    path('api/create/info/', AllDataView.as_view(), name='all_data'),  # GET: all data

    path('api/electives/<int:id>/edit/', ElectiveEditView.as_view(), name='edit_elective'), #get говно как отправлется при создании
    path('api/archive/teacher/', TeacherElectiveArchive.as_view(), name='teacher_archive'), #get
    path('api/archive/student/', StudentElectiveArchive.as_view(), name='student_archive'), #get

    path('api/electives/to_check/', ElectivesToCheck.as_view(), name='electives_to_check'), #get
    path('api/electives/checked/', CheckedElectives.as_view(), name='checked_electives'), #get
    path('api/electives/cancelled/', CanceledElectives.as_view(), name='canceled_electives'), #get
    path('api/electives/<int:id>/check/', CheckElectives.as_view(), name='CheckElectives'), #get 
    path('api/electives/<int:id>/resend/', TeacherResendElective.as_view(), name='TeacherResendElective'), #get

]
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    list_display = ('username', 'email', 'is_staff')



class StudentAdmin(admin.ModelAdmin):
    model = Student
    list_display = ('last_name', 'first_name', 'middle_name', 'profile', 'course', 'semester', 'group', 'average_grade', 'health')
    list_filter = ('profile', 'course')

class TeacherAdmin(admin.ModelAdmin):
    model = Teacher
    list_display = ('last_name', 'first_name', 'middle_name', 'is_admin')
    list_filter = ('is_admin',)
22
admin.site.register(Facultet)
admin.site.register(Health)
admin.site.register(Institute)
admin.site.register(Profile)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Form)
admin.site.register(Status)
admin.site.register(Elective)
admin.site.register(TeacherElective)
admin.site.register(StudentElective)
admin.site.register(ElectiveInstitute)
admin.site.register(ElectiveFacultet)
admin.site.register(ElectiveProfile)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(Ugsn)
admin.site.register(Type)
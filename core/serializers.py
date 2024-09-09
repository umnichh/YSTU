from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = ('name',)


class FacultetSerializer(serializers.ModelSerializer):
    institute = InstituteSerializer()

    class Meta:
        model = Facultet
        fields = ('name', 'institute')


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('name',)


class ProfileSerializer(serializers.ModelSerializer):
    facultet = FacultetSerializer()
    form = FormSerializer()

    class Meta:
        model = Profile
        fields = ('name', 'facultet', 'form')


class HealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Health
        fields = ('name',)


class TeacherSerializer(serializers.ModelSerializer):
    institute = InstituteSerializer()

    class Meta:
        model = Teacher
        fields = ('is_admin', 'institute', 'last_name', 'first_name', 'middle_name')


class StudentSerializer(serializers.ModelSerializer):
    health = HealthSerializer()
    profile = ProfileSerializer()

    class Meta:
        model = Student
        fields = ('last_name', 'first_name', 'middle_name', 'year_of_study', 'group', 'average_grade', 'profile', 'health')

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fileds = ('name',)
        
class ElectiveSerializer(serializers.ModelSerializer):
    health = HealthSerializer()
    form = FormSerializer()
    status = StatusSerializer()
    class Meta:
        model = Elective
        fields = ('__all__')
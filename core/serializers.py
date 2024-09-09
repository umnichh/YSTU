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
        fields = ('id', 'is_admin', 'institute', 'last_name', 'first_name', 'middle_name')


class StudentSerializer(serializers.ModelSerializer):
    health = HealthSerializer()
    profile = ProfileSerializer()

    class Meta:
        model = Student
        fields = ('last_name', 'first_name', 'middle_name', 'year_of_study', 'group', 'average_grade', 'profile', 'health')

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'
        
class ElectiveSerializer(serializers.ModelSerializer):
    health = HealthSerializer()
    form = FormSerializer()
    status = StatusSerializer()
    teachers = serializers.SerializerMethodField()
    class Meta:
        model = Elective
        fields = ('__all__')
        
    def get_teachers(self, obj):
        teacher_electives = TeacherElective.objects.filter(elective=obj)
        teachers = [teacher_elective.teacher for teacher_elective in teacher_electives]
        return TeacherSerializer(teachers, many=True).data
        
class ElectiveCreateSerializer(serializers.ModelSerializer):
    teacher_ids = serializers.ListField(write_only=True)

    class Meta:
        model = Elective
        fields = ['name', 'describe', 'place', 'form', 'volume', 'date_registration', 'date_start', 'date_finish', 'marks', 'health', 'status', 'registration_closed',  'teacher_ids'] 

    def create(self, validated_data):
        teacher_ids = validated_data.pop('teacher_ids', [])
        validated_data['date_registration'] = date.today()
        elective = Elective.objects.create(**validated_data)

        # Создаем связи с преподавателями
        for teacher_id in teacher_ids:
            teacher = Teacher.objects.get(id=teacher_id)
            TeacherElective.objects.create(elective=elective, teacher=teacher)

        return elective
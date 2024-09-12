from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = ('id', 'name',)


class FacultetSerializer(serializers.ModelSerializer):
    institute = InstituteSerializer()

    class Meta:
        model = Facultet
        fields = ('id', 'name', 'institute')


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ('id', 'name',)


class ProfileSerializer(serializers.ModelSerializer):
    facultet = FacultetSerializer()
    form = FormSerializer()

    class Meta:
        model = Profile
        fields = ('id', 'name', 'facultet', 'form')


class HealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Health
        fields = ('id', 'name',)


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
        fields = ('id', 'last_name', 'first_name', 'middle_name', 'year_of_study', 'group', 'average_grade', 'profile', 'health')

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = '__all__'
        
class ElectiveSerializer(serializers.ModelSerializer):
    status = StatusSerializer(read_only=True)  # read-only, так как создаем его отдельно
    teachers = serializers.SerializerMethodField()
    health = HealthSerializer(read_only=True)          # Для отправки полного объекта
    form = FormSerializer(read_only=True) 
    made_by = TeacherSerializer(read_only=True)

    class Meta:
        model = Elective
        fields = ['id', 'name', 'describe', 'place', 'form', 'volume', 'date_start', 'date_finish', 'marks', 'health', 'status', 'registration_closed', 'teachers', 'made_by']

    def validate(self, data):
        required_fields = ['name', 'describe', 'place', 'volume', 'date_start', 'date_finish', 'marks']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} поле не указано")

        date_start = data.get('date_start')
        date_finish = data.get('date_finish')

        if date_start and date_finish:
            if date_start > date_finish:
                raise serializers.ValidationError("Дата начала не может быть позже даты окончания")

        volume = data.get('volume')
        if volume and not isinstance(volume, int):
            raise serializers.ValidationError("Объём должен быть числом")

        return data   

    def get_teachers(self, obj):
        teacher_electives = TeacherElective.objects.filter(elective=obj)
        teachers = [teacher_elective.teacher for teacher_elective in teacher_electives]
        return TeacherSerializer(teachers, many=True).data
 
class ElectiveInstituteSerializer(serializers.ModelSerializer):
    institute = InstituteSerializer(read_only=True)
    elective = ElectiveSerializer(read_only=True)
    class Meta:
        model = ElectiveInstitute
        fields = '__all__'

class ElectiveFacultetSerializer(serializers.ModelSerializer):
    facultet = FacultetSerializer(read_only=True)
    elective = ElectiveSerializer(read_only=True)
    class Meta:
        model = ElectiveFacultet
        fields = '__all__'

class ElectiveProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    elective = ElectiveSerializer(read_only=True)
    class Meta:
        model = ElectiveProfile
        fields = '__all__'
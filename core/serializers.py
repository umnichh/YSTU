from rest_framework import serializers
from .models import *

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username',
                  'password')

class TeacherSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    
    class Meta:
        model = Teacher
        fields = ('user',
                  'is_admin',
                  'last_name',
                  'first_name',
                  'middle_name')
        
class StudentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    
    class Meta:
        model = Student
        fields = ('user', 'last_name', 'first_name', 'middle_name', 'study_profile', 'year_of_study', 'group', 'average_grade', 'health')
        

# class IssueTokenRequestSerializer(Serializer):
#     model = User

#     username = CharField(required=True)
#     password = CharField(required=True)

# class TokenSeriazliser(ModelSerializer):

#     class Meta:
#         model = Token
#         fields = ['key']
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

@api_view(['GET'])
def get_user_role(request):
    user = request.user  

    try:
        teacher = Teacher.objects.get(user=user)
        return Response({'role': 'teacher'})
    except Teacher.DoesNotExist:
        return Response({'error': 'Role not found'})
    
    try:
        student = Student.objects.get(user=user)
        return Response({'role': 'student'})
    except Student.DoesNotExist:
        return Response({'error': 'Role not found'})
        
@api_view(['GET'])
def teacher_cabinet(request):
    user = request.user
    try:
        teacher = Teacher.objects.get(user=user)
        serializer = TeacherSerializer(teacher)
        return Response(serializer.data)
    except Teacher.DoesNotExist:
        return Response({'error': 'Teacher not found'})
        
@api_view(['GET'])
def student_cabinet(request):
    user = request.user
    try:
        student = Student.objects.get(user=user)
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    except Student.DoesNotExist:
        return Respose({'error': 'Student not found'})
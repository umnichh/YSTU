from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework import status

# View to get user role
class UserRoleView(APIView):

    def get(self, request):
        user = request.user

        try:
            student = Student.objects.get(user=user)
            return Response({'role': 'student'})
        except Student.DoesNotExist:
            pass

        try:
            teacher = Teacher.objects.get(user=user)
            return Response({'role': 'teacher'})
        except Teacher.DoesNotExist:
            pass

        return Response({'error': 'Роль не найдена'}, status=status.HTTP_404_NOT_FOUND)


# View for Teacher's cabinet
class TeacherCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({'error': 'Преподаватель не найден'}, status=status.HTTP_404_NOT_FOUND)


# View for Student's cabinet
class StudentCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            student = Student.objects.get(user=user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)


# View for all electives
class AllElectivesView(APIView):

    def get(self, request):
        electives = Elective.objects.all()
        serializer = ElectiveSerializer(electives, many=True)
        return Response(serializer.data)


# Elective view to handle both GET and POST requests
class ElectiveView(APIView):

    def get(self, request):
        teachers = Teacher.objects.all()
        healths = Health.objects.all()
        forms = Form.objects.all()

        teacherSerializer = TeacherSerializer(teachers, many=True)
        healthSerializer = HealthSerializer(healths, many=True)
        formSerializer = FormSerializer(forms, many=True)

        # Combine data into one dictionary
        data = {
            'teachers': teacherSerializer.data,
            'healths': healthSerializer.data,
            'forms': formSerializer.data
        }

        return Response(data)

    def post(self, request):
        serializer = ElectiveCreateSerializer(data=request.data)

        if serializer.is_valid():
            elective = serializer.save()
            return Response({
                'message': 'Электив создан',
                'elective': ElectiveSerializer(elective).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ElectiveDetailView(APIView):
    
    def get(self, request, id):
        try:
            elective = Elective.objects.get(id=id)
            serializer = ElectiveSerializer(elective)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Elective.DoesNotExist:
            return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)


class EnrollElectiveView(APIView):
    def post(self, request, id):
        try:
            student = Student.objects.get(user=request.user)
            elective = Elective.objects.get(id=id)
            if StudentElective.objects.filter(student=student, elective=elective).exists():
                return Response({'error' : 'Студент уже записан'}, status=status.HTTP_400_BAD_REQUEST)
        
            StudentElective.objects.create(student=student, elective=elective)
            return Response({'message': 'Студент записался'}, status=status.HTTP_201_CREATED)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден!'}, status=status.HTTP_404_NOT_FOUND)
        except Elective.DoesNotExist:
                return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, id):
        try:
            student = Student.objects.get(user=request.user)
            elective = Elective.objects.get(id=id)
            studentelective = StudentElective.objects.get(student=student, elective=elective)
            studentelective.delete()
            return Response({'Success' : 'Запись студента отменена'}, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден!'}, status=status.HTTP_404_NOT_FOUND)
        except Elective.DoesNotExist:
                return Response({'error': 'Электив не найден'}, status=status.HTTP_404_NOT_FOUND)
        except StudentElective.DoesNotExist:
            return Response({'error': 'Студент не записан на этот электив'}, status=status.HTTP_400_BAD_REQUEST)
        
class ElectiveAvaliableStudentView(APIView):
    
    def get(self, request):
        try:
            user = request.user
            student = Student.objects.get(user=user)
            all_electives = Elective.objects.all()
            enrolled_electives = StudentElective.objects.filter(student=student).values_list('elective_id', flat=True)
            available_electives = all_electives.exclude(id__in=enrolled_electives)
            serializer = ElectiveSerializer(available_electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)
        
class StudentElectiveView(APIView):
    def get(self, request):
        try:
            user = request.user
            student = Student.objects.get(user=user)
            enrolled_electives = Elective.objects.filter(studentelective__student=student)
            serializer = ElectiveSerializer(enrolled_electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Student.DoesNotExist:
            return Response({'error': 'Студент не найден'}, status=status.HTTP_404_NOT_FOUND)

class TeacherElectivView(APIView):
    def get(self, request):
        try:
            user = request.user
            teacher = Teacher.objects.get(user=user)
            electives = Elective.objects.filter(teacherelective__teacher=teacher)
            serializer = ElectiveSerializer(electives, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Student.DoesNotExist:
            return Response({'error': 'Преподаватель не найден'}, status=status.HTTP_404_NOT_FOUND)

            

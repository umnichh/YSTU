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

        return Response({'error': 'Role not found'}, status=status.HTTP_404_NOT_FOUND)


# View for Teacher's cabinet
class TeacherCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            teacher = Teacher.objects.get(user=user)
            serializer = TeacherSerializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)


# View for Student's cabinet
class StudentCabinetView(APIView):

    def get(self, request):
        user = request.user
        try:
            student = Student.objects.get(user=user)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)


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
                'message': 'Elective created',
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
            return Response({'error': 'Elective not found'}, status=status.HTTP_404_NOT_FOUND)

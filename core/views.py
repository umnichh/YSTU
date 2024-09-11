from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import pandas as pd


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
        
class UploadInstitutesView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if 'document' not in request.FILES:
            return Response({'error': 'Файл отсутствует'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uploaded_file = request.FILES['document']

            data = pd.read_excel(uploaded_file)

            for index, row in data.iterrows():
                institute_name = row['Институт']
                form_of_study = row['Форма обучения']
                faculty_name = row['Специальность']
                profile_name = row['Профиль']

                form = Form.objects.filter(name=form_of_study.capitalize()).first()
                institute, created = Institute.objects.get_or_create(name=institute_name)
                faculty, created = Facultet.objects.get_or_create(name=faculty_name, institute=institute)

                if not pd.isnull(profile_name):
                    profile, created = Profile.objects.get_or_create(name=profile_name, facultet=faculty, form=form)

            return Response({'message': 'Всё норм загружены'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class AddInstituteToElective(APIView):
    def get(self, request, id):
        institutes = Institute.objects.all()
        facultets = Facultet.objects.all()
        profiles = Profile.objects.all()

        instituteSerializer = InstituteSerializer(institutes, many=True)
        facultetSerializer = FacultetSerializer(facultets, many=True)
        profileSerializer = ProfileSerializer(profiles, many=True)
        data = {
            'institutes': instituteSerializer.data,
            'facultets': facultetSerializer.data,
            'profile': profileSerializer.data
        }
        return Response(data)
    
    def post(self, request, elective_id):
        elective = Elective.objects.get(id=elective_id)
        data = request.data

        institutes = data.get('institutes', [])
        facultets = data.get('facultets', [])
        profiles = data.get('profiles', [])

        for institute_data in institutes:
            institute_id = institute_data.get('id')
            course = institute_data.get('course', None)
            assign_all_courses = institute_data.get('assign_all_courses', False)

            try:
                institute = Institute.objects.get(id=institute_id)
                ElectiveInstitute.objects.create(
                    elective=elective,
                    institute=institute,
                    course=course if not assign_all_courses else None,
                    assign_all_courses=assign_all_courses
                )
            except Institute.DoesNotExist:
                return Response({'error': f'Институт с айди {institute_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

        for facultet_data in facultets:
            facultet_id = facultet_data.get('id')
            course = facultet_data.get('course', None)
            assign_all_courses = facultet_data.get('assign_all_courses', False)

            try:
                facultet = Facultet.objects.get(id=facultet_id)
                ElectiveFacultet.objects.create(
                    elective=elective,
                    facultet=facultet,
                    course=course if not assign_all_courses else None,
                    assign_all_courses=assign_all_courses
                )
            except Facultet.DoesNotExist:
                return Response({'error': f'Факультет с айди {facultet_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

        for profile_data in profiles:
            profile_id = profile_data.get('id')
            course = profile_data.get('course', None)
            assign_all_courses = profile_data.get('assign_all_courses', False)

            try:
                profile = Profile.objects.get(id=profile_id)
                ElectiveProfile.objects.create(
                    elective=elective,
                    profile=profile,
                    course=course if not assign_all_courses else None,
                    assign_all_courses=assign_all_courses
                )
            except Profile.DoesNotExist:
                return Response({'error': f'Профиль с айди {profile_id} не найден'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'message': 'всякое назначено'}, status=status.HTTP_201_CREATED)

    

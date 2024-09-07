
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .serializers import *

class TeacherOnlyView(APIView):

    def get(self, request):
        if request.user.role != 'teacher':
            return Response({'error': 'Access denied'}, status=403)
        
        teacher = Teacher.objects.filter(id=teacher_id)
        teachers = Teacher.objects.all()
        return Response(TeacherSerializer(teachers, many=True).data)

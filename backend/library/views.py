from rest_framework import viewsets
from .models import Student, LibraryEntry, ELibraryPC, ELibraryUsage
from .serializers import StudentSerializer, LibraryEntrySerializer, ELibraryPCSerializer, ELibraryUsageSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class LibraryEntryViewSet(viewsets.ModelViewSet):
    queryset = LibraryEntry.objects.all()
    serializer_class = LibraryEntrySerializer

class ELibraryPCViewSet(viewsets.ModelViewSet):
    queryset = ELibraryPC.objects.all()
    serializer_class = ELibraryPCSerializer

class ELibraryUsageViewSet(viewsets.ModelViewSet):
    queryset = ELibraryUsage.objects.all()
    serializer_class = ELibraryUsageSerializer

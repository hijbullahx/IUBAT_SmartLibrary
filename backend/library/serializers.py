from rest_framework import serializers
from .models import Student, LibraryEntry, ELibraryPC, ELibraryUsage

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class LibraryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryEntry
        fields = '__all__'

class ELibraryPCSerializer(serializers.ModelSerializer):
    class Meta:
        model = ELibraryPC
        fields = '__all__'

class ELibraryUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ELibraryUsage
        fields = '__all__'

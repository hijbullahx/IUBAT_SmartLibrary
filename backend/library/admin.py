from django.contrib import admin
from .models import Student, LibraryEntry, ELibraryPC, ELibraryUsage

admin.site.register(Student)
admin.site.register(LibraryEntry)
admin.site.register(ELibraryPC)
admin.site.register(ELibraryUsage)

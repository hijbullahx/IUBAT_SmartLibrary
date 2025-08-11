from django.contrib import admin
from .models import Student, PC, LibraryEntry, ELibraryEntry

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name',)

@admin.register(PC)
class PCAdmin(admin.ModelAdmin):
    list_display = ('pc_number', 'is_dumb',)
    list_filter = ('is_dumb',)

@admin.register(LibraryEntry)
class LibraryEntryAdmin(admin.ModelAdmin):
    list_display = ('student', 'entry_time', 'exit_time',)
    list_filter = ('entry_time',)
    search_fields = ('student__name', 'student__student_id',)

@admin.register(ELibraryEntry)
class ELibraryEntryAdmin(admin.ModelAdmin):
    list_display = ('student', 'pc', 'entry_time', 'exit_time',)
    list_filter = ('entry_time', 'pc__pc_number',)
    search_fields = ('student__name', 'student__student_id',)
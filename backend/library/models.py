# library/models.py
from django.db import models

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    # You can add more fields here later, like department, etc.
    def __str__(self):
        return self.name
# library/models.py

class PC(models.Model):
    pc_number = models.IntegerField(unique=True)
    is_dumb = models.BooleanField(default=False)
    # We can add a status field later to see if it's in use.
    def __str__(self):
        return f"PC {self.pc_number}"
    
# library/models.py
# (add this below the PC model)
class LibraryEntry(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.student.name} entered at {self.entry_time}"
    
# library/models.py
# (add this below the LibraryEntry model)
class ELibraryEntry(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    pc = models.ForeignKey(PC, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.student.name} used PC {self.pc.pc_number} at {self.entry_time}"
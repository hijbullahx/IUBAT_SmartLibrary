from django.db import models

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return f"{self.name} ({self.student_id})"

class LibraryEntry(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.name} - {self.entry_time}"

class ELibraryPC(models.Model):
    pc_number = models.CharField(max_length=10, unique=True)
    is_active = models.BooleanField(default=True)
    is_blocked = models.BooleanField(default=False)
    is_dumb = models.BooleanField(default=False)

    def __str__(self):
        return f"PC {self.pc_number}"

class ELibraryUsage(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    pc = models.ForeignKey(ELibraryPC, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.student.name} on {self.pc.pc_number}"

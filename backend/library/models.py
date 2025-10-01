from django.db import models

class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, default='Unknown')
    
    def __str__(self):
        return f"{self.name} - {self.department}"

class PC(models.Model):
    pc_number = models.IntegerField(unique=True)
    is_dumb = models.BooleanField(default=False)
    
    def __str__(self):
        return f"PC {self.pc_number}"

class LibraryEntry(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.name} entered at {self.entry_time}"

class ELibraryEntry(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    pc = models.ForeignKey(PC, on_delete=models.CASCADE)
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.student.name} used PC {self.pc.pc_number} at {self.entry_time}"


# General issue report model for all types of complaints
class IssueReport(models.Model):
    ISSUE_TYPE_CHOICES = [
        ("pc", "PC Issue"),
        ("facility", "Facility Issue"),
        ("other", "Other Issue"),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPE_CHOICES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_solved = models.BooleanField(default=False)

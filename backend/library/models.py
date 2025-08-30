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

class PCComplaint(models.Model):
    pc = models.ForeignKey(PC, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    complaint_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_fixed = models.BooleanField(default=False)
    fixed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Complaint for PC {self.pc.pc_number} by {self.student.name}"
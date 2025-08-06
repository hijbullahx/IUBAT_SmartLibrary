#!/usr/bin/env python
"""
Quick setup script to create sample data for the library system
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings_local')

# Setup Django
django.setup()

from library.models import Student, PC, LibraryEntry, ELibraryEntry
from django.contrib.auth.models import User

def create_sample_data():
    print("Creating sample data...")
    
    # Create sample students
    students_data = [
        {'student_id': '2021001', 'name': 'John Doe'},
        {'student_id': '2021002', 'name': 'Jane Smith'},
        {'student_id': '2021003', 'name': 'Mike Johnson'},
        {'student_id': '2021004', 'name': 'Sarah Wilson'},
        {'student_id': '2021005', 'name': 'David Brown'},
    ]
    
    for student_data in students_data:
        student, created = Student.objects.get_or_create(
            student_id=student_data['student_id'],
            defaults={'name': student_data['name']}
        )
        if created:
            print(f"Created student: {student.name} ({student.student_id})")
    
    # Create PCs
    for pc_num in range(1, 11):  # PC 1 to 10
        pc, created = PC.objects.get_or_create(
            pc_number=pc_num,
            defaults={'is_dumb': pc_num > 8}  # PC 9 and 10 are marked as dumb
        )
        if created:
            status = "dumb" if pc.is_dumb else "available"
            print(f"Created PC {pc.pc_number} - {status}")
    
    # Create admin user
    try:
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@iubat.edu',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            print("Created admin user: admin/admin123")
        else:
            print("Admin user already exists")
    except Exception as e:
        print(f"Admin user creation: {e}")
    
    print("\n✅ Sample data created successfully!")
    print("\n📝 Test Data:")
    print("Students: 2021001, 2021002, 2021003, 2021004, 2021005")
    print("PCs: 1-8 (available), 9-10 (dumb)")
    print("Admin: admin/admin123")
    print("\n🌐 Your server is running at: http://127.0.0.1:8000")
    print("🔧 Admin panel: http://127.0.0.1:8000/admin")

if __name__ == '__main__':
    create_sample_data()

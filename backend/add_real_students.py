#!/usr/bin/env python
"""
Script to add real IUBAT student data with departments

HOW TO ADD STUDENTS FROM DIFFERENT DEPARTMENTS:
==============================================
1. Add new student data to the students_data list below
2. Set the appropriate department for each student:
   - 'Computer Science & Engineering (CSE)'
   - 'Electrical & Electronic Engineering (EEE)'
   - 'Business Administration (BBA)'
   - 'English'
   - 'Civil Engineering'
   - 'Mechanical Engineering'
   - 'Architecture'
   - 'Law'
   - 'Pharmacy'
   - etc.

3. Run this script: python add_real_students.py

EXAMPLE for adding students from different departments:
{'student_id': '22113001', 'name': 'Example Student', 'department': 'Electrical & Electronic Engineering (EEE)'},
{'student_id': '22143001', 'name': 'Example Student', 'department': 'Business Administration (BBA)'},

All existing students are currently CSE students.
"""
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')

# Setup Django
django.setup()

from library.models import Student, PC, LibraryEntry, ELibraryEntry

def add_real_students():
    print("Adding real IUBAT student data with departments...")
    
    # Real student data with departments
    # All current students are from Computer Science & Engineering (CSE)
    # Future students from other departments can be added here with their respective departments
    students_data = [
        {'student_id': '21303018', 'name': 'Md. Rifat Hossen Saown', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22103260', 'name': 'Nahiduzzaman', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22103364', 'name': 'M. Mostafizur Rahman Mishok', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303012', 'name': 'Easa Yeasfi Bin Islam', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303050', 'name': 'Md. Arif Hossen', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303126', 'name': 'Md.Rakibul Hasan Roman', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303127', 'name': 'Marzia Khan Rinti', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303142', 'name': 'Md. Taher Bin Omar Hijbullah', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303148', 'name': 'Rifah Tasnia Prova', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303191', 'name': 'Apurba Kumar Biswas', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303196', 'name': 'Abir Hossen', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303233', 'name': 'AMENA AFRIN ALO', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303240', 'name': 'Md. Al Amin', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303242', 'name': 'Md. Farhan Nadim Joy', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303251', 'name': 'Rakib Khan Joy', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303286', 'name': 'Md. Imran Nazir Udoy', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303290', 'name': 'Md. Sazidul Islam Sazid', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303340', 'name': 'Md. Abdullah Bin Yousuf', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303374', 'name': 'Othi Khan', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303384', 'name': 'Most. Zannatul Ferdousi', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303389', 'name': 'Jamil Ahammed Motasim Masum', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303397', 'name': 'Habiba Akter', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303399', 'name': 'Nusrat Jahan Nuren', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103016', 'name': 'Mohammed Riachat Rahat', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103017', 'name': 'Samia Akter Erin', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103023', 'name': 'Saffana Islam Shreosi', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103024', 'name': 'Tanzida Rahman', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103035', 'name': 'Sayed Shamioul Anam Seyam', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103046', 'name': 'Ishrat Jahan', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103065', 'name': 'Shadman Ahnaf', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103072', 'name': 'Hasiba Aman Anika', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103202', 'name': 'Ashariya Urbosi', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103219', 'name': 'Sheikh Tasfiq Hasan Midul', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103239', 'name': 'Hasina Parvin Toma', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103255', 'name': 'Raian Siddique', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103281', 'name': 'Md. Abdul Gaffar', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103286', 'name': 'Tasfia Islam Prapty', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103289', 'name': 'Arobi Islam Borsha', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103297', 'name': 'Md. Abdula Al Mamun', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103300', 'name': 'Md. Makhmudul Haque Shawon', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '23103406', 'name': 'FATEMA TAJ MIM', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303089', 'name': 'Hasibur Rahman', 'department': 'Computer Science & Engineering (CSE)'},
        {'student_id': '22303296', 'name': 'Md.Rony Mia', 'department': 'Computer Science & Engineering (CSE)'},
        
        # Future students from other departments can be added like this:
        # {'student_id': '22113001', 'name': 'Example Student', 'department': 'Electrical & Electronic Engineering (EEE)'},
        # {'student_id': '22143001', 'name': 'Example Student', 'department': 'Business Administration (BBA)'},
        # {'student_id': '22313001', 'name': 'Example Student', 'department': 'English'},
        # {'student_id': '22243001', 'name': 'Example Student', 'department': 'Civil Engineering'},
    ]
    
    # Clear existing dummy data
    print("Clearing dummy data...")
    Student.objects.filter(student_id__startswith='2021').delete()
    
    # Add real students with departments
    for student_data in students_data:
        student, created = Student.objects.get_or_create(
            student_id=student_data['student_id'],
            defaults={
                'name': student_data['name'],
                'department': student_data['department']
            }
        )
        if created:
            print(f"Created: {student.name} ({student.student_id}) - {student.department}")
        else:
            # Update existing student with department if not set
            if student.department == 'Unknown':
                student.department = student_data['department']
                student.save()
                print(f"Updated: {student.name} ({student.student_id}) - {student.department}")
            else:
                print(f"Exists: {student.name} ({student.student_id}) - {student.department}")
    
    print(f"\nProcessed {len(students_data)} students.")
    
    # Show department summary
    from django.db.models import Count
    dept_counts = Student.objects.values('department').annotate(count=Count('id')).order_by('-count')
    
    print("\nDepartment Summary:")
    print("-" * 50)
    for dept in dept_counts:
        print(f"{dept['department']:40} | {dept['count']:2} students")

if __name__ == '__main__':
    add_real_students()

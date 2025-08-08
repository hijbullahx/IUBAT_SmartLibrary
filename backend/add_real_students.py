#!/usr/bin/env python
"""
Script to add real IUBAT student data
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
    print("Adding real IUBAT student data...")
    
    # Real student data from your list
    students_data = [
        {'student_id': '21303018', 'name': 'Md. Rifat Hossen Saown'},
        {'student_id': '22103260', 'name': 'Nahiduzzaman'},
        {'student_id': '22103364', 'name': 'M. Mostafizur Rahman Mishok'},
        {'student_id': '22303012', 'name': 'Easa Yeasfi Bin Islam'},
        {'student_id': '22303050', 'name': 'Md. Arif Hossen'},
        {'student_id': '22303126', 'name': 'Md.Rakibul Hasan Roman'},
        {'student_id': '22303127', 'name': 'Marzia Khan Rinti'},
        {'student_id': '22303142', 'name': 'Md. Taher Bin Omar Hijbullah'},
        {'student_id': '22303148', 'name': 'Rifah Tasnia Prova'},
        {'student_id': '22303191', 'name': 'Apurba Kumar Biswas'},
        {'student_id': '22303196', 'name': 'Abir Hossen'},
        {'student_id': '22303233', 'name': 'AMENA AFRIN ALO'},
        {'student_id': '22303240', 'name': 'Md. Al Amin'},
        {'student_id': '22303242', 'name': 'Md. Farhan Nadim Joy'},
        {'student_id': '22303251', 'name': 'Rakib Khan Joy'},
        {'student_id': '22303286', 'name': 'Md. Imran Nazir Udoy'},
        {'student_id': '22303290', 'name': 'Md. Sazidul Islam Sazid'},
        {'student_id': '22303340', 'name': 'Md. Abdullah Bin Yousuf'},
        {'student_id': '22303374', 'name': 'Othi Khan'},
        {'student_id': '22303384', 'name': 'Most. Zannatul Ferdousi'},
        {'student_id': '22303389', 'name': 'Jamil Ahammed Motasim Masum'},
        {'student_id': '22303397', 'name': 'Habiba Akter'},
        {'student_id': '22303399', 'name': 'Nusrat Jahan Nuren'},
        {'student_id': '23103016', 'name': 'Mohammed Riachat Rahat'},
        {'student_id': '23103017', 'name': 'Samia Akter Erin'},
        {'student_id': '23103023', 'name': 'Saffana Islam Shreosi'},
        {'student_id': '23103024', 'name': 'Tanzida Rahman'},
        {'student_id': '23103035', 'name': 'Sayed Shamioul Anam Seyam'},
        {'student_id': '23103046', 'name': 'Ishrat Jahan'},
        {'student_id': '23103065', 'name': 'Shadman Ahnaf'},
        {'student_id': '23103072', 'name': 'Hasiba Aman Anika'},
        {'student_id': '23103202', 'name': 'Ashariya Urbosi'},
        {'student_id': '23103219', 'name': 'Sheikh Tasfiq Hasan Midul'},
        {'student_id': '23103239', 'name': 'Hasina Parvin Toma'},
        {'student_id': '23103255', 'name': 'Raian Siddique'},
        {'student_id': '23103268', 'name': 'Fardin Kabir Ruhan'},
        {'student_id': '23103281', 'name': 'Md. Abdul Gaffar'},
        {'student_id': '23103286', 'name': 'Tasfia Islam Prapty'},
        {'student_id': '23103289', 'name': 'Arobi Islam Borsha'},
        {'student_id': '23103297', 'name': 'Md. Abdula Al Mamun'},
        {'student_id': '23103300', 'name': 'Md. Makhmudul Haque Shawon'},
        {'student_id': '23103406', 'name': 'FATEMA TAJ MIM'},
        {'student_id': '22303089', 'name': 'Hasibur Rahman'},
        {'student_id': '22303296', 'name': 'Md.Rony Mia'},
    ]
    
    # Clear existing dummy data
    print("Clearing dummy data...")
    Student.objects.filter(student_id__startswith='2021').delete()
    
    # Add real students
    for student_data in students_data:
        student, created = Student.objects.get_or_create(
            student_id=student_data['student_id'],
            defaults={'name': student_data['name']}
        )
        if created:
            print(f"Created student: {student.name} ({student.student_id})")
        else:
            print(f"Student already exists: {student.name} ({student.student_id})")
    
    print(f"\nSuccessfully processed {len(students_data)} real IUBAT students!")
    print("\nYou can now test with real student IDs:")
    print("Examples: 21303018, 22303142, 23103065")

if __name__ == '__main__':
    add_real_students()

if __name__ == '__main__':
    add_real_students()

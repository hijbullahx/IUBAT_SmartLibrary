from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from library.models import Student, PC

class Command(BaseCommand):
    help = 'Setup initial data for the library system'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database setup...'))
        
        # Create superuser if it doesn't exist
        if not User.objects.filter(is_superuser=True).exists():
            self.stdout.write('Creating superuser...')
            User.objects.create_superuser(
                username='admin',
                email='admin@iubat.edu',
                password='admin123'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created: admin / admin123'))
        else:
            self.stdout.write('Superuser already exists')

        # Add students if they don't exist
        if Student.objects.count() == 0:
            self.stdout.write('Adding all 42 real students...')
            students_data = [
                {'student_id': '21303018', 'name': 'Md. Rifat Hossen Saown', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22103260', 'name': 'Nahiduzzaman', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22103364', 'name': 'M. Mostafizur Rahman Mishok', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22303012', 'name': 'Easa Yeasfi Bin Islam', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22303050', 'name': 'Md. Arif Hossen', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22303089', 'name': 'Hasibur Rahman', 'department': 'Computer Science & Engineering (CSE)'},
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
                {'student_id': '22303296', 'name': 'Md.Rony Mia', 'department': 'Computer Science & Engineering (CSE)'},
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
            ]
            
            for student_data in students_data:
                student, created = Student.objects.get_or_create(
                    student_id=student_data['student_id'],
                    defaults={
                        'name': student_data['name'],
                        'department': student_data['department']
                    }
                )
                if created:
                    self.stdout.write(f"Added student: {student.student_id} - {student.name}")
                else:
                    self.stdout.write(f"Student already exists: {student.student_id}")
            
            self.stdout.write(self.style.SUCCESS(f'Added all 42 real students from IUBAT CSE department'))
        else:
            self.stdout.write(f'Students already exist: {Student.objects.count()} students in database')

        # Add PCs if they don't exist
        if PC.objects.count() == 0:
            self.stdout.write('Adding PCs...')
            for i in range(1, 49):  # Create PCs 1-48 (full e-library capacity)
                pc, created = PC.objects.get_or_create(
                    pc_number=f'PC-{i:02d}',
                    defaults={'is_dumb': False}
                )
                if created:
                    self.stdout.write(f"Added PC: {pc.pc_number}")
            
            self.stdout.write(self.style.SUCCESS('Added 48 PCs (full e-library capacity)'))
        else:
            self.stdout.write(f'PCs already exist: {PC.objects.count()} PCs in database')

        self.stdout.write(self.style.SUCCESS('Database setup completed successfully!'))
        self.stdout.write(self.style.WARNING('Admin credentials: admin / admin123'))
        self.stdout.write(self.style.WARNING('You can change these in the admin panel'))

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
            self.stdout.write('Adding students...')
            students_data = [
                {'student_id': '21303018', 'name': 'Md. Rifat Hossen Saown', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '21303019', 'name': 'Md. Hijbullah Hossain', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '21303020', 'name': 'Ashraful Islam', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '21303021', 'name': 'Md. Tanvir Ahmed', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '21303022', 'name': 'Fatema Khatun', 'department': 'Computer Science & Engineering (CSE)'},
                {'student_id': '22113001', 'name': 'Sarah Ahmed', 'department': 'Electrical & Electronic Engineering (EEE)'},
                {'student_id': '22143001', 'name': 'Karim Rahman', 'department': 'Business Administration (BBA)'},
                {'student_id': '22153001', 'name': 'Nusrat Jahan', 'department': 'English'},
                {'student_id': '22163001', 'name': 'Mohammad Ali', 'department': 'Civil Engineering'},
                {'student_id': '22173001', 'name': 'Rashida Begum', 'department': 'Pharmacy'},
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
            
            self.stdout.write(self.style.SUCCESS(f'Added {len(students_data)} students'))
        else:
            self.stdout.write(f'Students already exist: {Student.objects.count()} students in database')

        # Add PCs if they don't exist
        if PC.objects.count() == 0:
            self.stdout.write('Adding PCs...')
            for i in range(1, 21):  # Create PCs 1-20
                pc, created = PC.objects.get_or_create(
                    pc_number=f'PC-{i:02d}',
                    defaults={'is_dumb': False}
                )
                if created:
                    self.stdout.write(f"Added PC: {pc.pc_number}")
            
            self.stdout.write(self.style.SUCCESS('Added 20 PCs'))
        else:
            self.stdout.write(f'PCs already exist: {PC.objects.count()} PCs in database')

        self.stdout.write(self.style.SUCCESS('Database setup completed successfully!'))
        self.stdout.write(self.style.WARNING('Admin credentials: admin / admin123'))
        self.stdout.write(self.style.WARNING('You can change these in the admin panel'))

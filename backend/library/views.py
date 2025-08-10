# library/views.py

from django.http import JsonResponse
from .models import Student, LibraryEntry, ELibraryEntry, PC
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from django.http import HttpResponse
import csv
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from datetime import datetime
from django.db.models import Q

@csrf_exempt
def library_entry_exit(request):
    if request.method == 'POST':
        try:
            # We assume the barcode is sent in a JSON body.
            # The React frontend will send {'student_id': 'your_barcode_value'}
            data = json.loads(request.body)
            student_id = data.get('student_id')

            # 1. Find the student
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)

            # 2. Check if the student is currently inside the library
            # Look for an entry with no exit time
            current_entry = LibraryEntry.objects.filter(student=student, exit_time__isnull=True).first()

            if current_entry:
                # 3a. Student is inside, so we record their exit time
                current_entry.exit_time = timezone.now()
                current_entry.save()
                message = f'{student.name} has logged out from the main library.'
                return JsonResponse({'status': 'success', 'action': 'logout', 'message': message, 'student_name': student.name})
            else:
                # 3b. Student is not inside, so we create a new entry
                LibraryEntry.objects.create(student=student)
                message = f'{student.name} has logged in to the main library.'
                return JsonResponse({'status': 'success', 'action': 'login', 'message': message, 'student_name': student.name})

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            # General error handling
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def pc_status(request):
    if request.method == 'GET':
        all_pcs = PC.objects.all().order_by('pc_number')
        pcs_in_use = ELibraryEntry.objects.filter(exit_time__isnull=True).select_related('student', 'pc')

        pc_list = []
        for pc in all_pcs:
            # Find if this PC is currently in use
            current_entry = pcs_in_use.filter(pc=pc).first()
            
            if current_entry:
                status = "in-use"
                current_user = current_entry.student.student_id
                current_user_name = current_entry.student.name
            else:
                status = "available"
                current_user = None
                current_user_name = None
            
            if pc.is_dumb:
                status = "dumb"

            pc_data = {
                'pc_number': pc.pc_number,
                'status': status,
                'is_dumb': pc.is_dumb,
            }
            
            # Only add user info if PC is in use
            if current_user:
                pc_data['current_user'] = current_user
                pc_data['current_user_name'] = current_user_name
                
            pc_list.append(pc_data)
        
        return JsonResponse({'status': 'success', 'pcs': pc_list})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


# Other placeholder views remain unchanged for now
@csrf_exempt
def elibrary_checkin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            pc_number = data.get('pc_number')

            # 1. Find the student
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)

            # 2. Find the PC
            try:
                pc = PC.objects.get(pc_number=pc_number)
            except PC.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} not found.'}, status=404)
            
            # 3. Check if PC is dumb
            if pc.is_dumb:
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} is marked as dumb and cannot be used.'}, status=400)

            # 4. Check if the PC is already in use
            if ELibraryEntry.objects.filter(pc=pc, exit_time__isnull=True).exists():
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} is already in use.'}, status=400)
            
            # 5. Check if the student is already checked in to another PC
            if ELibraryEntry.objects.filter(student=student, exit_time__isnull=True).exists():
                return JsonResponse({'status': 'error', 'message': f'{student.name} is already using another PC.'}, status=400)

            # 6. If all checks pass, create a new ELibraryEntry
            ELibraryEntry.objects.create(student=student, pc=pc)
            message = f'{student.name} has successfully checked in to PC {pc.pc_number}.'
            return JsonResponse({'status': 'success', 'message': message, 'student_name': student.name, 'pc_number': pc.pc_number})

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)


@csrf_exempt
def elibrary_checkout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')

            # 1. Find the student
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)
            
            # 2. Find the active e-library session for the student
            active_session = ELibraryEntry.objects.filter(student=student, exit_time__isnull=True).first()

            if active_session:
                # 3. End the session by setting the exit time
                active_session.exit_time = timezone.now()
                active_session.save()
                message = f'{student.name} has successfully checked out from PC {active_session.pc.pc_number}.'
                return JsonResponse({'status': 'success', 'message': message, 'student_name': student.name, 'pc_number': active_session.pc.pc_number})
            else:
                # 4. Student is not checked in to any PC
                return JsonResponse({'status': 'error', 'message': f'{student.name} is not currently checked in to any PC.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
def export_data(request):
    # We need to make sure this is only accessible to admins
    if not request.user.is_authenticated or not request.user.is_superuser:
        return HttpResponse("Unauthorized", status=401)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="library_entries.csv"'

    writer = csv.writer(response)

    # Write the header row
    writer.writerow(['Student Name', 'Student ID', 'PC Number', 'Entry Time', 'Exit Time', 'Location'])

    # Get all entries from the main library
    library_entries = LibraryEntry.objects.all().order_by('entry_time')
    for entry in library_entries:
        writer.writerow([
            entry.student.name,
            entry.student.student_id,
            'N/A', # No PC for main library
            entry.entry_time.strftime('%Y-%m-%d %H:%M:%S'),
            entry.exit_time.strftime('%Y-%m-%d %H:%M:%S') if entry.exit_time else '',
            'Main Library'
        ])

    # Get all entries from the e-library
    elibrary_entries = ELibraryEntry.objects.all().order_by('entry_time')
    for entry in elibrary_entries:
        writer.writerow([
            entry.student.name,
            entry.student.student_id,
            entry.pc.pc_number,
            entry.entry_time.strftime('%Y-%m-%d %H:%M:%S'),
            entry.exit_time.strftime('%Y-%m-%d %H:%M:%S') if entry.exit_time else '',
            'E-Library'
        ])

    return response
@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_superuser:
            login(request, user)
            return JsonResponse({'status': 'success', 'message': 'Logged in as Admin.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials or not a superuser.'}, status=401)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def admin_logout(request):
    if request.method == 'POST' and request.user.is_authenticated:
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully.'})
    return JsonResponse({'status': 'error', 'message': 'You are not logged in.'}, status=400)
@csrf_exempt
def time_based_report(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    start_date_str = request.GET.get('start_date')
    end_date_str = request.GET.get('end_date')

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').replace(hour=23, minute=59, second=59)
    except (ValueError, TypeError):
        return JsonResponse({'status': 'error', 'message': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

    main_library_entries = LibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
    elibrary_entries = ELibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')

    report_data = []

    for entry in main_library_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,  # Add department field
            'pc_number': 'N/A',
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'Main Library'
        })

    for entry in elibrary_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,  # Add department field
            'pc_number': entry.pc.pc_number,
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'E-Library'
        })

    return JsonResponse({'status': 'success', 'report': report_data}, safe=False)
@csrf_exempt
def student_based_report(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    student_query = request.GET.get('student_query')
    if not student_query:
        return JsonResponse({'status': 'error', 'message': 'Student ID or Name is required.'}, status=400)

    # Filter students by ID, name, or department (case-insensitive)
    students = Student.objects.filter(
        Q(student_id__icontains=student_query) | 
        Q(name__icontains=student_query) |
        Q(department__icontains=student_query)  # Add department search
    )

    report_data = []

    for student in students:
        main_library_entries = LibraryEntry.objects.filter(student=student).order_by('entry_time')
        elibrary_entries = ELibraryEntry.objects.filter(student=student).order_by('entry_time')

        for entry in main_library_entries:
            report_data.append({
                'student_name': entry.student.name,
                'student_id': entry.student.student_id,
                'department': entry.student.department,  # Add department field
                'pc_number': 'N/A',
                'entry_time': entry.entry_time.isoformat(),
                'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                'location': 'Main Library'
            })

        for entry in elibrary_entries:
            report_data.append({
                'student_name': entry.student.name,
                'student_id': entry.student.student_id,
                'department': entry.student.department,  # Add department field
                'pc_number': entry.pc.pc_number,
                'entry_time': entry.entry_time.isoformat(),
                'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                'location': 'E-Library'
            })

    # Sort all entries by entry_time
    report_data.sort(key=lambda x: x['entry_time'])

    return JsonResponse({'status': 'success', 'report': report_data}, safe=False)

@csrf_exempt
def department_statistics(request):
    """Get department-wise library usage statistics"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    from django.db.models import Count
    
    # Get department statistics for students
    dept_stats = Student.objects.values('department').annotate(
        total_students=Count('id')
    ).order_by('-total_students')
    
    # Get department-wise library usage
    usage_stats = []
    for dept in dept_stats:
        department = dept['department']
        
        # Count library entries for this department
        main_library_count = LibraryEntry.objects.filter(
            student__department=department
        ).count()
        
        elibrary_count = ELibraryEntry.objects.filter(
            student__department=department
        ).count()
        
        usage_stats.append({
            'department': department,
            'total_students': dept['total_students'],
            'main_library_visits': main_library_count,
            'elibrary_visits': elibrary_count,
            'total_visits': main_library_count + elibrary_count
        })
    
    # Sort by total visits
    usage_stats.sort(key=lambda x: x['total_visits'], reverse=True)
    
    return JsonResponse({'status': 'success', 'statistics': usage_stats}, safe=False)

def api_status(request):
    """Simple API status endpoint"""
    return JsonResponse({
        'status': 'success',
        'message': 'IUBAT Smart Library API is running',
        'version': '1.0.0',
        'endpoints': {
            'library_entry': '/api/entry/library/',
            'elibrary_checkin': '/api/entry/elibrary/checkin/',
            'elibrary_checkout': '/api/entry/elibrary/checkout/',
            'pc_status': '/api/elibrary/pc_status/',
            'admin_login': '/api/admin/login/',
            'admin_reports': '/api/admin/reports/time-based/',
            'student_lookup': '/api/students/<student_id>/'
        }
    })

@csrf_exempt
def student_lookup(request, student_id):
    """API endpoint to look up a specific student"""
    if request.method == 'GET':
        try:
            student = Student.objects.get(student_id=student_id)
            return JsonResponse({
                'status': 'success',
                'student': {
                    'student_id': student.student_id,
                    'name': student.name,
                    'department': student.department
                }
            })
        except Student.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

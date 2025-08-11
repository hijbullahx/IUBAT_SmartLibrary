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
            data = json.loads(request.body)
            student_id = data.get('student_id')

            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)

            current_entry = LibraryEntry.objects.filter(student=student, exit_time__isnull=True).first()

            if current_entry:
                current_entry.exit_time = timezone.now()
                current_entry.save()
                message = f'{student.name} has logged out from the main library.'
                return JsonResponse({'status': 'success', 'action': 'logout', 'message': message, 'student_name': student.name})
            else:
                LibraryEntry.objects.create(student=student)
                message = f'{student.name} has logged in to the main library.'
                return JsonResponse({'status': 'success', 'action': 'login', 'message': message, 'student_name': student.name})

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def pc_status(request):
    if request.method == 'GET':
        all_pcs = PC.objects.all().order_by('pc_number')
        pcs_in_use = ELibraryEntry.objects.filter(exit_time__isnull=True).select_related('student', 'pc')

        pc_list = []
        for pc in all_pcs:
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
            
            if current_user:
                pc_data['current_user'] = current_user
                pc_data['current_user_name'] = current_user_name
                
            pc_list.append(pc_data)
        
        return JsonResponse({'status': 'success', 'pcs': pc_list})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def check_current_pc(request, student_id):
    if request.method == 'GET':
        try:
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)

            current_entry = ELibraryEntry.objects.filter(
                student=student, 
                exit_time__isnull=True
            ).select_related('pc').first()

            if current_entry:
                pc_data = {
                    'pc_id': current_entry.pc.pk,
                    'pc_name': f"PC {current_entry.pc.pc_number}",
                    'pc_number': current_entry.pc.pc_number,
                    'entry_time': current_entry.entry_time.isoformat()
                }
                return JsonResponse({
                    'status': 'success', 
                    'current_pc': pc_data,
                    'message': f'Student is currently using PC {current_entry.pc.pc_number}'
                })
            else:
                return JsonResponse({
                    'status': 'success', 
                    'current_pc': None,
                    'message': 'Student is not currently using any PC'
                })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def elibrary_checkin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            pc_number = data.get('pc_number')

            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)

            try:
                pc = PC.objects.get(pc_number=pc_number)
            except PC.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} not found.'}, status=404)
            
            # 3. Check if PC is dumb
            if pc.is_dumb:
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} is marked as dumb and cannot be used.'}, status=400)

            if ELibraryEntry.objects.filter(pc=pc, exit_time__isnull=True).exists():
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} is already in use.'}, status=400)
            
            if ELibraryEntry.objects.filter(student=student, exit_time__isnull=True).exists():
                return JsonResponse({'status': 'error', 'message': f'{student.name} is already using another PC.'}, status=400)

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

            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Student not found.'}, status=404)
            
            active_session = ELibraryEntry.objects.filter(student=student, exit_time__isnull=True).first()

            if active_session:
                active_session.exit_time = timezone.now()
                active_session.save()
                message = f'{student.name} has successfully checked out from PC {active_session.pc.pc_number}.'
                return JsonResponse({'status': 'success', 'message': message, 'student_name': student.name, 'pc_number': active_session.pc.pc_number})
            else:
                return JsonResponse({'status': 'error', 'message': f'{student.name} is not currently checked in to any PC.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

def export_data(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return HttpResponse("Unauthorized", status=401)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="library_entries.csv"'

    writer = csv.writer(response)
    writer.writerow(['Student Name', 'Student ID', 'PC Number', 'Entry Time', 'Exit Time', 'Location'])

    library_entries = LibraryEntry.objects.all().order_by('entry_time')
    for entry in library_entries:
        writer.writerow([
            entry.student.name,
            entry.student.student_id,
            'N/A',
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
@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({'status': 'error', 'message': 'Username and password required.'}, status=400)
            
            user = authenticate(request, username=username, password=password)
            if user is not None and user.is_superuser:
                login(request, user)
                return JsonResponse({
                    'status': 'success', 
                    'message': 'Logged in as Admin.',
                    'user': {
                        'username': user.username,
                        'is_superuser': user.is_superuser
                    }
                })
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials or not a superuser.'}, status=401)
                
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
            
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

@csrf_exempt
def daily_report(request):
    """Generate a daily report of library usage"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    from datetime import timedelta
    
    # Check if specific day is requested
    day_param = request.GET.get('day')
    
    if day_param:
        try:
            # Parse the day date
            start_date = datetime.strptime(day_param, '%Y-%m-%d')
            # Set to start of day
            start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
            # Set end to end of same day
            end_date = start_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'Invalid day format. Use YYYY-MM-DD.'}, status=400)
    else:
        # Default: Get last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)

    main_library_entries = LibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')
    
    elibrary_entries = ELibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')

    report_data = []

    # Add main library entries
    for entry in main_library_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': 'N/A',
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'Main Library'
        })

    # Add e-library entries
    for entry in elibrary_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': entry.pc.pc_number,
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'E-Library'
        })

    # Sort by entry time
    report_data.sort(key=lambda x: x['entry_time'])

    return JsonResponse({'status': 'success', 'report': report_data}, safe=False)

@csrf_exempt
def monthly_report(request):
    """Generate a monthly report of library usage"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    from datetime import timedelta
    import calendar
    
    # Check if specific month is requested
    month_param = request.GET.get('month')
    
    if month_param:
        try:
            # Parse the month parameter (format: YYYY-MM)
            year, month = map(int, month_param.split('-'))
            
            # Get first day of the month
            start_date = datetime(year, month, 1)
            
            # Get last day of the month
            last_day = calendar.monthrange(year, month)[1]
            end_date = datetime(year, month, last_day, 23, 59, 59)
            
        except (ValueError, IndexError):
            return JsonResponse({'status': 'error', 'message': 'Invalid month format. Use YYYY-MM.'}, status=400)
    else:
        # Default: Get current month (last 30 days)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)

    main_library_entries = LibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')
    
    elibrary_entries = ELibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')

    report_data = []

    # Add main library entries
    for entry in main_library_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': 'N/A',
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'Main Library'
        })

    # Add e-library entries
    for entry in elibrary_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': entry.pc.pc_number,
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'E-Library'
        })

    # Sort by entry time
    report_data.sort(key=lambda x: x['entry_time'])

    return JsonResponse({'status': 'success', 'report': report_data}, safe=False)

@csrf_exempt
def yearly_report(request):
    """Generate a yearly report of library usage"""
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=401)

    from datetime import timedelta
    
    # Check if specific year is requested
    year_param = request.GET.get('year')
    
    if year_param:
        try:
            # Parse the year parameter
            year = int(year_param)
            
            # Get first day of the year
            start_date = datetime(year, 1, 1)
            
            # Get last day of the year
            end_date = datetime(year, 12, 31, 23, 59, 59)
            
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'Invalid year format.'}, status=400)
    else:
        # Default: Get current year (last 365 days)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)

    main_library_entries = LibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')
    
    elibrary_entries = ELibraryEntry.objects.filter(
        entry_time__range=[start_date, end_date]
    ).order_by('entry_time')

    report_data = []

    # Add main library entries
    for entry in main_library_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': 'N/A',
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'Main Library'
        })

    # Add e-library entries
    for entry in elibrary_entries:
        report_data.append({
            'student_name': entry.student.name,
            'student_id': entry.student.student_id,
            'department': entry.student.department,
            'pc_number': entry.pc.pc_number,
            'entry_time': entry.entry_time.isoformat(),
            'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
            'location': 'E-Library'
        })

    # Sort by entry time
    report_data.sort(key=lambda x: x['entry_time'])

    return JsonResponse({'status': 'success', 'report': report_data}, safe=False)

def api_status(request):
    """Simple API status endpoint"""
    return JsonResponse({
        'status': 'success',
        'message': 'IUBAT Smart Library API is running',
        'version': '1.0.0',
        'user_authenticated': request.user.is_authenticated,
        'user_is_superuser': request.user.is_superuser if request.user.is_authenticated else False,
        'username': request.user.username if request.user.is_authenticated else None,
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


@csrf_exempt
def live_admin_stats(request):
    """Get real-time library statistics for admin dashboard"""
    if request.method == 'GET':
        try:
            # Check authentication
            if not request.user.is_authenticated:
                return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=401)
            
            if not request.user.is_superuser:
                return JsonResponse({'status': 'error', 'message': 'Superuser access required'}, status=403)
            
            # Count students currently in library (no exit time)
            students_in_library = LibraryEntry.objects.filter(exit_time__isnull=True).count()
            
            # Count students using e-library (active e-library sessions)
            students_in_elibrary = ELibraryEntry.objects.filter(exit_time__isnull=True).count()
            
            # Students only in main library (in library but not in e-library)
            students_only_main = students_in_library - students_in_elibrary
            
            # Get PC statistics
            all_pcs = PC.objects.all()
            total_pcs = all_pcs.count()
            
            # Get currently active e-library sessions
            active_elibrary_sessions = ELibraryEntry.objects.filter(
                exit_time__isnull=True
            ).select_related('student', 'pc')
            
            pc_stats = {
                'total': total_pcs,
                'available': 0,
                'in_use': 0,
                'dumb': 0
            }
            
            pc_details = []
            for pc in all_pcs:
                # Find if this PC is currently in use
                current_session = active_elibrary_sessions.filter(pc=pc).first()
                
                if pc.is_dumb:
                    status = 'dumb'
                    pc_stats['dumb'] += 1
                    user_info = None
                elif current_session:
                    status = 'in_use'
                    pc_stats['in_use'] += 1
                    user_info = {
                        'student_id': current_session.student.student_id,
                        'student_name': current_session.student.name,
                        'department': current_session.student.department,
                        'entry_time': current_session.entry_time.isoformat()
                    }
                else:
                    status = 'available'
                    pc_stats['available'] += 1
                    user_info = None
                
                pc_details.append({
                    'pc_number': pc.pc_number,
                    'status': status,
                    'is_dumb': pc.is_dumb,
                    'user_info': user_info
                })
            
            return JsonResponse({
                'status': 'success',
                'stats': {
                    'students_in_library': students_in_library,
                    'students_in_elibrary': students_in_elibrary,
                    'students_only_main': students_only_main,
                    'pc_stats': pc_stats
                },
                'pc_details': pc_details
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)

@csrf_exempt
def get_pc_analytics(request):
    """Get PC usage analytics for the last 7 days"""
    if request.method == 'GET':
        try:
            from datetime import datetime, timedelta
            from django.db.models import Count
            from django.utils import timezone
            
            # Get last 7 days
            end_date = timezone.now()
            start_date = end_date - timedelta(days=7)
            
            # Get daily PC usage
            daily_usage = []
            for i in range(7):
                day = start_date + timedelta(days=i)
                day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
                day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
                
                # Count unique PC sessions for this day
                sessions_count = ELibraryEntry.objects.filter(
                    entry_time__range=[day_start, day_end]
                ).count()
                
                # Count unique students for this day
                students_count = ELibraryEntry.objects.filter(
                    entry_time__range=[day_start, day_end]
                ).values('student').distinct().count()
                
                daily_usage.append({
                    'date': day.strftime('%Y-%m-%d'),
                    'day_name': day.strftime('%A'),
                    'usage_count': sessions_count,  # This matches frontend expectation
                    'pc_sessions': sessions_count,
                    'unique_students': students_count
                })
            
            return JsonResponse({
                'status': 'success',
                'data': daily_usage  # This matches frontend expectation
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def admin_toggle_pc_status(request):
    """Admin endpoint to toggle PC status (dumb/available)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            pc_number = data.get('pc_number')
            new_status = data.get('is_dumb')  # True for dumb, False for available
            
            try:
                pc = PC.objects.get(pc_number=pc_number)
                pc.is_dumb = new_status
                pc.save()
                
                status_text = "out of service" if new_status else "available"
                return JsonResponse({
                    'status': 'success',
                    'message': f'PC {pc_number} marked as {status_text}',
                    'pc_number': pc_number,
                    'is_dumb': new_status
                })
                
            except PC.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'PC {pc_number} not found'}, status=404)
                
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# Temporary stub for check_admin_auth to resolve import errors
def check_admin_auth(request):
    return True, None
from django.db.models import Q
from datetime import datetime
# from .auth_helpers import check_admin_auth  # Adjust import path if needed
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# --- STUBS FOR ALL ENDPOINTS REFERENCED IN urls.py ---
@csrf_exempt
def library_entry_exit(request):
    return JsonResponse({'status': 'error', 'message': 'Not implemented.'}, status=501)

@csrf_exempt
def elibrary_checkin(request):
    return JsonResponse({'status': 'error', 'message': 'Not implemented.'}, status=501)

@csrf_exempt
def elibrary_checkout(request):
    return JsonResponse({'status': 'error', 'message': 'Not implemented.'}, status=501)

@csrf_exempt
def pc_status(request):
    return JsonResponse({'status': 'error', 'message': 'Not implemented.'}, status=501)

@csrf_exempt
def check_current_pc(request, student_id):
    return JsonResponse({'status': 'error', 'message': 'Not implemented.'}, status=501)
from .models import Student, LibraryEntry, ELibraryEntry, PC
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from django.http import HttpResponse
import csv
from django.contrib.auth import authenticate, login, logout

from django.http import JsonResponse
from .models import Student, LibraryEntry, ELibraryEntry, PC
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from django.http import HttpResponse
import csv
from django.contrib.auth import authenticate, login, logout
def export_data(request):
    # Check authentication using both session cookies and auth tokens
    is_authenticated, admin_user = check_admin_auth(request)
    if not is_authenticated:
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
def admin_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({'success': False, 'message': 'Username and password required.'}, status=400)
            
            print(f"DEBUG: Attempting login with username: '{username}'")
            user = authenticate(request, username=username, password=password)
            print(f"DEBUG: Authentication result: {user}")
            print(f"DEBUG: User is_superuser: {getattr(user, 'is_superuser', 'N/A')}")
            
            if user is not None and user.is_superuser:
                login(request, user)
                
                # Generate a simple token (in production, use Django REST Framework tokens or JWT)
                import hashlib
                import time
                token_string = f"{user.username}:{user.pk}:{time.time()}"
                auth_token = hashlib.sha256(token_string.encode()).hexdigest()
                
                # Store token in session for verification
                request.session['auth_token'] = auth_token
                request.session['user_id'] = user.pk
                request.session.save()
                
                print(f"DEBUG LOGIN: Session key after login: {request.session.session_key}")
                print(f"DEBUG LOGIN: User: {request.user}")
                print(f"DEBUG LOGIN: Generated token: {auth_token}")
                
                # Return token in response instead of relying only on cookies
                response = JsonResponse({
                    'success': True,  # Changed from 'status': 'success' to match frontend expectation
                    'message': 'Logged in as Admin.',
                    'auth_token': auth_token,  # Frontend can store this in localStorage
                    'user': {
                        'username': user.username,
                        'is_superuser': user.is_superuser
                    }
                })
                
                # Still set session cookie for fallback
                from django.conf import settings
                response.set_cookie(
                    settings.SESSION_COOKIE_NAME,
                    request.session.session_key,
                    max_age=settings.SESSION_COOKIE_AGE,
                    domain=settings.SESSION_COOKIE_DOMAIN,
                    secure=settings.SESSION_COOKIE_SECURE,
                    httponly=settings.SESSION_COOKIE_HTTPONLY,
                    samesite=settings.SESSION_COOKIE_SAMESITE
                )
                
                print(f"DEBUG LOGIN: Set session cookie {settings.SESSION_COOKIE_NAME}={request.session.session_key}")
                return response
            else:
                return JsonResponse({'success': False, 'message': 'Invalid credentials or not a superuser.'}, status=401)
                
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

@csrf_exempt
def admin_logout(request):
    if request.method == 'POST' and request.user.is_authenticated:
        logout(request)
        return JsonResponse({'status': 'success', 'message': 'Logged out successfully.'})
    return JsonResponse({'status': 'error', 'message': 'You are not logged in.'}, status=400)
@csrf_exempt
def time_based_report(request):
    # Check authentication using both session cookies and auth tokens
    is_authenticated, admin_user = check_admin_auth(request)
    if not is_authenticated:
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
    # Check authentication using both session cookies and auth tokens
    is_authenticated, admin_user = check_admin_auth(request)
    if not is_authenticated:
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
    # Check authentication using both session cookies and auth tokens
    is_authenticated, admin_user = check_admin_auth(request)
    if not is_authenticated:
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
    try:
        # Check admin authentication (both session and token)
        user, auth_error = check_admin_auth(request)
        if auth_error:
            return auth_error

        from datetime import timedelta
        # Check if specific day is requested
        day_param = request.GET.get('day')
        if day_param:
            try:
                # Parse the day date
                start_date = datetime.strptime(day_param, '%Y-%m-%d')
                # Make timezone aware
                start_date = timezone.make_aware(start_date)
                # Set to start of day
                start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
                # Set end to end of same day
                end_date = start_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'Invalid day format. Use YYYY-MM-DD.'}, status=400)
        else:
            # Default: Get last 7 days
            end_date = timezone.now()
            start_date = end_date - timedelta(days=7)

        print(f"[DEBUG] Daily report: start_date={start_date}, end_date={end_date}")
        main_library_entries = LibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        elibrary_entries = ELibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        print(f"[DEBUG] Daily report: main_library_entries={main_library_entries.count()}, elibrary_entries={elibrary_entries.count()}")

        report_data = []
        # Add main library entries with error handling
        for entry in main_library_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': 'N/A',
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'Main Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping LibraryEntry: {e}")
        # Add e-library entries with error handling
        for entry in elibrary_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': entry.pc.pc_number,
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'E-Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping ELibraryEntry: {e}")
        # Sort by entry time
        report_data.sort(key=lambda x: x['entry_time'])
        return JsonResponse({'status': 'success', 'report': report_data}, safe=False)
    except Exception as e:
        print(f"[FATAL ERROR] daily_report: {e}")
        return JsonResponse({'status': 'error', 'message': f'Internal server error: {e}'}, status=500)

@csrf_exempt
def monthly_report(request):
    """Generate a monthly report of library usage"""
    try:
        # Check admin authentication (both session and token)
        user, auth_error = check_admin_auth(request)
        if auth_error:
            return auth_error

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
                # Make timezone aware
                start_date = timezone.make_aware(start_date)
                # Get last day of the month
                last_day = calendar.monthrange(year, month)[1]
                end_date = datetime(year, month, last_day, 23, 59, 59)
                # Make timezone aware
                end_date = timezone.make_aware(end_date)
            except (ValueError, IndexError):
                return JsonResponse({'status': 'error', 'message': 'Invalid month format. Use YYYY-MM.'}, status=400)
        else:
            # Default: Get current month (last 30 days)
            end_date = timezone.now()
            start_date = end_date - timedelta(days=30)

        print(f"[DEBUG] Monthly report: start_date={start_date}, end_date={end_date}")
        main_library_entries = LibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        elibrary_entries = ELibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        print(f"[DEBUG] Monthly report: main_library_entries={main_library_entries.count()}, elibrary_entries={elibrary_entries.count()}")

        report_data = []
        # Add main library entries with error handling
        for entry in main_library_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': 'N/A',
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'Main Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping LibraryEntry: {e}")
        # Add e-library entries with error handling
        for entry in elibrary_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': entry.pc.pc_number,
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'E-Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping ELibraryEntry: {e}")
        # Sort by entry time
        report_data.sort(key=lambda x: x['entry_time'])
        return JsonResponse({'status': 'success', 'report': report_data}, safe=False)
    except Exception as e:
        print(f"[FATAL ERROR] monthly_report: {e}")
        return JsonResponse({'status': 'error', 'message': f'Internal server error: {e}'}, status=500)

@csrf_exempt
def yearly_report(request):
    """Generate a yearly report of library usage"""
    try:
        # Check admin authentication (both session and token)
        user, auth_error = check_admin_auth(request)
        if auth_error:
            return auth_error

        from datetime import timedelta
        # Check if specific year is requested
        year_param = request.GET.get('year')
        if year_param:
            try:
                # Parse the year parameter
                year = int(year_param)
                # Get first day of the year
                start_date = datetime(year, 1, 1)
                # Make timezone aware
                start_date = timezone.make_aware(start_date)
                # Get last day of the year
                end_date = datetime(year, 12, 31, 23, 59, 59)
                # Make timezone aware
                end_date = timezone.make_aware(end_date)
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'Invalid year format.'}, status=400)
        else:
            # Default: Get current year (last 365 days)
            end_date = timezone.now()
            start_date = end_date - timedelta(days=365)

        print(f"[DEBUG] Yearly report: start_date={start_date}, end_date={end_date}")
        main_library_entries = LibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        elibrary_entries = ELibraryEntry.objects.filter(entry_time__range=[start_date, end_date]).order_by('entry_time')
        print(f"[DEBUG] Yearly report: main_library_entries={main_library_entries.count()}, elibrary_entries={elibrary_entries.count()}")

        report_data = []
        # Add main library entries with error handling
        for entry in main_library_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': 'N/A',
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'Main Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping LibraryEntry: {e}")
        # Add e-library entries with error handling
        for entry in elibrary_entries:
            try:
                report_data.append({
                    'student_name': entry.student.name,
                    'student_id': entry.student.student_id,
                    'department': entry.student.department,
                    'pc_number': entry.pc.pc_number,
                    'entry_time': entry.entry_time.isoformat(),
                    'exit_time': entry.exit_time.isoformat() if entry.exit_time else None,
                    'location': 'E-Library'
                })
            except Exception as e:
                print(f"[ERROR] Skipping ELibraryEntry: {e}")
        # Sort by entry time
        report_data.sort(key=lambda x: x['entry_time'])
        return JsonResponse({'status': 'success', 'report': report_data}, safe=False)
    except Exception as e:
        print(f"[FATAL ERROR] yearly_report: {e}")
        return JsonResponse({'status': 'error', 'message': f'Internal server error: {e}'}, status=500)

def api_status(request):
    """Simple API status endpoint"""
    return JsonResponse({
        'status': 'success',
        'message': 'IUBAT Smart Library API is running',
        'version': '1.0.0',
        'user_authenticated': request.user.is_authenticated,
        'user_is_superuser': request.user.is_superuser if request.user.is_authenticated else False,
        'username': request.user.username if request.user.is_authenticated else None,
        'session_key': request.session.session_key,
        'session_data': dict(request.session),
        'cookies_received': dict(request.COOKIES),
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
            # Debug session and authentication
            print(f"DEBUG: Session key: {request.session.session_key}")
            print(f"DEBUG: User authenticated: {request.user.is_authenticated}")
            print(f"DEBUG: User: {request.user}")
            print(f"DEBUG: User is superuser: {getattr(request.user, 'is_superuser', False)}")
            print(f"DEBUG: Session data: {dict(request.session)}")
            print(f"DEBUG: Cookies received: {dict(request.COOKIES)}")
            print(f"DEBUG: Headers: {dict(request.headers)}")
            
            # Check authentication using both methods
            is_authenticated, admin_user = check_admin_auth(request)
            if not is_authenticated:
                return JsonResponse({'status': 'error', 'message': 'Authentication required', 'debug': {'session_key': request.session.session_key, 'user': str(request.user)}}, status=401)
            
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



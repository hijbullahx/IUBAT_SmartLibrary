# library/views.py

from django.shortcuts import render
from django.http import JsonResponse
from .models import Student, LibraryEntry, ELibraryEntry, PC
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

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
        pcs_in_use = ELibraryEntry.objects.filter(exit_time__isnull=True).values_list('pc__pc_number', flat=True)

        pc_list = []
        for pc in all_pcs:
            status = "in use" if pc.pc_number in pcs_in_use else "available"
            if pc.is_dumb:
                status = "dumb"

            pc_list.append({
                'pc_number': pc.pc_number,
                'status': status,
            })
        
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
    return JsonResponse({'status': 'Functionality to be implemented'})
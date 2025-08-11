#!/usr/bin/env python
"""
Script to set up all 48 PCs in the library according to the physical layout:
- 4 rows
- Each row has 12 PCs (6 on one side starting from 1, 6 on the other side starting from 7)
- Row 1: PCs 1-6, 7-12
- Row 2: PCs 13-18, 19-24  
- Row 3: PCs 25-30, 31-36
- Row 4: PCs 37-42, 43-48
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_automation.settings')
django.setup()

from library.models import PC

def setup_all_pcs():
    """Create all 48 PCs if they don't exist"""
    
    # Create all PCs from 1 to 48
    for pc_num in range(1, 49):
        pc, created = PC.objects.get_or_create(
            pc_number=pc_num,
            defaults={'is_dumb': False}
        )
        if created:
            print(f"Created PC {pc_num}")
        else:
            print(f"PC {pc_num} already exists")
    
    # Set some PCs as dumb for testing (you can modify this)
    dumb_pcs = [5, 15, 25, 35]  # Example: one dumb PC per row
    for pc_num in dumb_pcs:
        try:
            pc = PC.objects.get(pc_number=pc_num)
            pc.is_dumb = True
            pc.save()
            print(f"Set PC {pc_num} as dumb")
        except PC.DoesNotExist:
            print(f"PC {pc_num} not found")
    
    print(f"\nTotal PCs in database: {PC.objects.count()}")
    print("PC setup complete!")

if __name__ == "__main__":
    setup_all_pcs()

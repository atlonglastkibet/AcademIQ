import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import uuid
from faker import Faker
import random

# Set seeds for reproducibility
np.random.seed(42)
random.seed(42)
fake = Faker()
Faker.seed(42)

print("🚀 SchoolKit-soma Data Generator Starting...")
print("=" * 60)

# ============================================================================
# 1. SCHOOLS
# ============================================================================
print("\n📚 Generating Schools...")
schools_data = [{
    'school_id': str(uuid.uuid4()),
    'name': 'Lavington Primary School',
    'county': 'Nairobi',
    'created_at': datetime(2020, 1, 15, 8, 0, 0)
}]
df_schools = pd.DataFrame(schools_data)
school_id = df_schools.iloc[0]['school_id']
print(f"✅ Created 1 school: {df_schools.iloc[0]['name']}")

# ============================================================================
# 2. SUBJECTS (Kenya CBC Core Subjects)
# ============================================================================
print("\n📖 Generating Subjects...")
subjects_data = [
    {'subject_id': str(uuid.uuid4()), 'name': 'Mathematics', 'code': 'MATH'},
    {'subject_id': str(uuid.uuid4()), 'name': 'English', 'code': 'ENG'},
    {'subject_id': str(uuid.uuid4()), 'name': 'Kiswahili', 'code': 'KISW'},
    {'subject_id': str(uuid.uuid4()), 'name': 'Science and Technology', 'code': 'SCI'},
    {'subject_id': str(uuid.uuid4()), 'name': 'Social Studies', 'code': 'SST'},
    {'subject_id': str(uuid.uuid4()), 'name': 'Christian Religious Education', 'code': 'CRE'}
]
df_subjects = pd.DataFrame(subjects_data)
print(f"✅ Created {len(df_subjects)} subjects")

# ============================================================================
# 3. USERS (Teachers, Drivers, Admin first - then Parents and Students)
# ============================================================================
print("\n👥 Generating Users...")

# Class Teachers (12 teachers for 12 classes)
class_teachers = []
for i in range(12):
    first_name = fake.first_name()
    last_name = fake.last_name()
    class_teachers.append({
        'user_id': str(uuid.uuid4()),
        'email': f"{first_name.lower()}.{last_name.lower()}@lavington.ac.ke",
        'phone': f"+2547{random.randint(10000000, 99999999)}",
        'first_name': first_name,
        'last_name': last_name,
        'role': 'teacher',
        'created_at': datetime(2020, 1, 20, 9, 0, 0)
    })

# Drivers (10 drivers for 10 buses)
drivers = []
for i in range(10):
    first_name = fake.first_name()
    last_name = fake.last_name()
    drivers.append({
        'user_id': str(uuid.uuid4()),
        'email': f"{first_name.lower()}.{last_name.lower()}.driver@lavington.ac.ke",
        'phone': f"+2547{random.randint(10000000, 99999999)}",
        'first_name': first_name,
        'last_name': last_name,
        'role': 'driver',
        'created_at': datetime(2020, 2, 1, 8, 0, 0)
    })

# Admin
admin = [{
    'user_id': str(uuid.uuid4()),
    'email': 'admin@lavington.ac.ke',
    'phone': '+254712345678',
    'first_name': 'John',
    'last_name': 'Mwangi',
    'role': 'admin',
    'created_at': datetime(2020, 1, 10, 8, 0, 0)
}]

users_list = class_teachers + drivers + admin

# ============================================================================
# 4. CLASSES (12 classes: Grade 1-6, 2 classes each)
# ============================================================================
print("\n🏫 Generating Classes...")
classes_data = []
class_names = ['Blue', 'Red']
class_idx = 0

for grade in range(1, 7):  # Grade 1 to 6
    for class_name in class_names:
        classes_data.append({
            'class_id': str(uuid.uuid4()),
            'school_id': school_id,
            'grade_level': grade,
            'class_name': f"Grade {grade} {class_name}",
            'class_teacher_id': class_teachers[class_idx]['user_id'],
            'capacity': 30
        })
        class_idx += 1

df_classes = pd.DataFrame(classes_data)
print(f"✅ Created {len(df_classes)} classes")

# ============================================================================
# 5. STUDENTS (360 students: 30 per class)
# ============================================================================
print("\n👨‍🎓 Generating Students...")
students_data = []
student_users = []
parents_data = []
student_parents_data = []

admission_start_date = datetime(2019, 1, 7)

for idx, class_row in df_classes.iterrows():
    for student_num in range(30):
        # Create student user
        first_name = fake.first_name()
        last_name = fake.last_name()
        student_user_id = str(uuid.uuid4())
        
        student_users.append({
            'user_id': student_user_id,
            'email': f"{first_name.lower()}.{last_name.lower()}.student@lavington.ac.ke",
            'phone': f"+2547{random.randint(10000000, 99999999)}",
            'first_name': first_name,
            'last_name': last_name,
            'role': 'student',
            'created_at': datetime(2020, 1, 5, 8, 0, 0)
        })
        
        # Create student record
        admission_date = admission_start_date + timedelta(days=random.randint(0, 365))
        students_data.append({
            'student_id': str(uuid.uuid4()),
            'user_id': student_user_id,
            'admission_number': f"LPS{2019 + class_row['grade_level']}{idx:02d}{student_num:02d}",
            'class_id': class_row['class_id'],
            'date_of_admission': admission_date.date(),
            'status': 'active',
            'dropout_date': None,
            'dropout_reason': None
        })
        
        # Create 1-2 parents per student
        num_parents = random.choice([1, 2])
        relationships = ['mother', 'father'] if num_parents == 2 else [random.choice(['mother', 'father', 'guardian'])]
        
        for rel_idx, relationship in enumerate(relationships):
            parent_first = fake.first_name()
            parent_last = last_name  # Same last name as student
            parent_user_id = str(uuid.uuid4())
            
            parents_data.append({
                'user_id': parent_user_id,
                'email': f"{parent_first.lower()}.{parent_last.lower()}.parent@gmail.com",
                'phone': f"+2547{random.randint(10000000, 99999999)}",
                'first_name': parent_first,
                'last_name': parent_last,
                'role': 'parent',
                'created_at': datetime(2020, 1, 5, 8, 0, 0)
            })
            
            student_parents_data.append({
                'id': str(uuid.uuid4()),
                'student_id': students_data[-1]['student_id'],
                'parent_user_id': parent_user_id,
                'relationship': relationship,
                'is_primary': (rel_idx == 0)
            })

df_students = pd.DataFrame(students_data)

# Add a few dropout cases (5% of students)
dropout_indices = random.sample(range(len(df_students)), k=18)  # 5% of 360
for idx in dropout_indices:
    df_students.loc[idx, 'status'] = 'dropped_out'
    df_students.loc[idx, 'dropout_date'] = (datetime(2024, 6, 15) + timedelta(days=random.randint(0, 180))).date()
    df_students.loc[idx, 'dropout_reason'] = random.choice([
        'Financial difficulties',
        'Family relocation',
        'Health issues',
        'Academic struggles',
        'Personal reasons'
    ])

print(f"✅ Created {len(df_students)} students ({len(dropout_indices)} dropouts)")

# Combine all users
users_list.extend(student_users)
users_list.extend(parents_data)
df_users = pd.DataFrame(users_list)
df_student_parents = pd.DataFrame(student_parents_data)
print(f"✅ Created {len(df_users)} total users")
print(f"✅ Created {len(df_student_parents)} student-parent relationships")

# ============================================================================
# 6. TERMS (8 terms: 2023 T1-T3, 2024 T1-T3, 2025 T1-T2)
# ============================================================================
print("\n📅 Generating Terms...")
terms_data = [
    # 2023
    {'term_id': str(uuid.uuid4()), 'year': 2023, 'term_number': 1, 'start_date': datetime(2023, 1, 9).date(), 'end_date': datetime(2023, 4, 7).date()},
    {'term_id': str(uuid.uuid4()), 'year': 2023, 'term_number': 2, 'start_date': datetime(2023, 5, 8).date(), 'end_date': datetime(2023, 8, 4).date()},
    {'term_id': str(uuid.uuid4()), 'year': 2023, 'term_number': 3, 'start_date': datetime(2023, 9, 4).date(), 'end_date': datetime(2023, 11, 17).date()},
    # 2024
    {'term_id': str(uuid.uuid4()), 'year': 2024, 'term_number': 1, 'start_date': datetime(2024, 1, 8).date(), 'end_date': datetime(2024, 4, 5).date()},
    {'term_id': str(uuid.uuid4()), 'year': 2024, 'term_number': 2, 'start_date': datetime(2024, 5, 6).date(), 'end_date': datetime(2024, 8, 2).date()},
    {'term_id': str(uuid.uuid4()), 'year': 2024, 'term_number': 3, 'start_date': datetime(2024, 9, 2).date(), 'end_date': datetime(2024, 11, 15).date()},
    # 2025
    {'term_id': str(uuid.uuid4()), 'year': 2025, 'term_number': 1, 'start_date': datetime(2025, 1, 6).date(), 'end_date': datetime(2025, 4, 4).date()},
    {'term_id': str(uuid.uuid4()), 'year': 2025, 'term_number': 2, 'start_date': datetime(2025, 5, 5).date(), 'end_date': datetime(2025, 8, 1).date()},
]
df_terms = pd.DataFrame(terms_data)
print(f"✅ Created {len(df_terms)} terms")

# ============================================================================
# 7. EXAMS (24 exams: 3 per term × 8 terms)
# ============================================================================
print("\n📝 Generating Exams...")
exams_data = []

for _, term in df_terms.iterrows():
    term_start = term['start_date']
    term_end = term['end_date']
    term_duration = (term_end - term_start).days
    
    # Opener exam (Week 3)
    opener_date = term_start + timedelta(days=14)
    # Midterm exam (Middle of term)
    midterm_date = term_start + timedelta(days=term_duration // 2)
    # End term exam (Last week)
    endterm_date = term_end - timedelta(days=7)
    
    for class_row in df_classes.itertuples():
        exams_data.append({
            'exam_id': str(uuid.uuid4()),
            'term_id': term['term_id'],
            'exam_type': 'opener',
            'exam_date': opener_date,
            'class_id': class_row.class_id
        })
        exams_data.append({
            'exam_id': str(uuid.uuid4()),
            'term_id': term['term_id'],
            'exam_type': 'midterm',
            'exam_date': midterm_date,
            'class_id': class_row.class_id
        })
        exams_data.append({
            'exam_id': str(uuid.uuid4()),
            'term_id': term['term_id'],
            'exam_type': 'endterm',
            'exam_date': endterm_date,
            'class_id': class_row.class_id
        })

df_exams = pd.DataFrame(exams_data)
print(f"✅ Created {len(df_exams)} exams")

# ============================================================================
# 8. STUDENT RESULTS - THE ML CORE
# ============================================================================
print("\n🎯 Generating Student Results (This will take a moment)...")

# Define student performance archetypes
ARCHETYPES = {
    'improving': {'weight': 0.25, 'start_mean': 55, 'end_mean': 78, 'std': 5},
    'declining': {'weight': 0.20, 'start_mean': 72, 'end_mean': 54, 'std': 6},
    'fluctuating': {'weight': 0.25, 'start_mean': 65, 'end_mean': 65, 'std': 10},
    'high_performer': {'weight': 0.20, 'start_mean': 82, 'end_mean': 85, 'std': 4},
    'at_risk': {'weight': 0.10, 'start_mean': 68, 'end_mean': 48, 'std': 8}
}

# Assign archetype to each student
student_archetypes = {}
for student_id in df_students['student_id']:
    archetype = np.random.choice(
        list(ARCHETYPES.keys()),
        p=[ARCHETYPES[k]['weight'] for k in ARCHETYPES.keys()]
    )
    student_archetypes[student_id] = archetype

results_data = []

# Get exams sorted by date
df_exams_sorted = df_exams.sort_values('exam_date')

for student_row in df_students.itertuples():
    student_id = student_row.student_id
    class_id = student_row.class_id
    archetype_name = student_archetypes[student_id]
    archetype = ARCHETYPES[archetype_name]
    
    # Get exams for this student's class
    student_exams = df_exams_sorted[df_exams_sorted['class_id'] == class_id].copy()
    num_exams = len(student_exams)
    
    if num_exams == 0:
        continue
    
    # Generate performance trajectory
    start_mean = archetype['start_mean']
    end_mean = archetype['end_mean']
    std = archetype['std']
    
    # Linear progression from start to end
    progression = np.linspace(start_mean, end_mean, num_exams)
    
    # Add Gaussian noise
    noise = np.random.normal(0, std, num_exams)
    marks_trajectory = progression + noise
    
    # Clip to valid range [0, 100]
    marks_trajectory = np.clip(marks_trajectory, 0, 100)
    
    # For each subject, add slight variation
    for subject in df_subjects.itertuples():
        subject_variation = np.random.normal(0, 3, num_exams)  # Small subject-specific variation
        subject_marks = np.clip(marks_trajectory + subject_variation, 0, 100)
        
        for idx, exam in enumerate(student_exams.itertuples()):
            marks = round(subject_marks[idx], 1)
            
            results_data.append({
                'result_id': str(uuid.uuid4()),
                'student_id': student_id,
                'exam_id': exam.exam_id,
                'subject_id': subject.subject_id,
                'marks': marks,
                'class_mean': 0,  # Will calculate after
                'class_rank': 0,  # Will calculate after
                'recorded_at': exam.exam_date + timedelta(days=7)
            })

df_results = pd.DataFrame(results_data)

# Calculate class means and ranks
print("📊 Calculating class means and ranks...")
for exam_id in df_results['exam_id'].unique():
    exam_results = df_results[df_results['exam_id'] == exam_id]
    
    for subject_id in df_results['subject_id'].unique():
        mask = (df_results['exam_id'] == exam_id) & (df_results['subject_id'] == subject_id)
        subject_marks = df_results.loc[mask, 'marks']
        
        if len(subject_marks) > 0:
            class_mean = round(subject_marks.mean(), 1)
            df_results.loc[mask, 'class_mean'] = class_mean
            
            # Assign ranks (1 = highest)
            df_results.loc[mask, 'class_rank'] = subject_marks.rank(method='min', ascending=False).astype(int)

print(f"✅ Created {len(df_results)} student results")

# ============================================================================
# 9. CLASS ATTENDANCE
# ============================================================================
print("\n📅 Generating Class Attendance...")

attendance_data = []

for term_row in df_terms.itertuples():
    term_start = term_row.start_date
    term_end = term_row.end_date
    current_date = term_start
    
    # Generate attendance for each school day
    while current_date <= term_end:
        # Skip weekends
        if current_date.weekday() < 5:  # Monday = 0, Friday = 4
            
            for student_row in df_students.itertuples():
                student_id = student_row.student_id
                class_id = student_row.class_id
                archetype_name = student_archetypes[student_id]
                
                # Attendance probability based on archetype
                if archetype_name == 'high_performer':
                    attendance_prob = 0.97
                elif archetype_name == 'at_risk':
                    attendance_prob = 0.70
                elif archetype_name == 'declining':
                    attendance_prob = 0.80
                else:
                    attendance_prob = 0.92
                
                # Random attendance
                status = 'present' if random.random() < attendance_prob else random.choice(['absent', 'absent', 'late'])
                
                attendance_data.append({
                    'attendance_id': str(uuid.uuid4()),
                    'student_id': student_id,
                    'class_id': class_id,
                    'date': current_date,
                    'term_id': term_row.term_id,
                    'status': status,
                    'recorded_at': datetime.combine(current_date, datetime.min.time()) + timedelta(hours=8, minutes=30)
                })
        
        current_date += timedelta(days=1)

df_attendance = pd.DataFrame(attendance_data)
print(f"✅ Created {len(df_attendance)} attendance records")

# ============================================================================
# 10. BUSES
# ============================================================================
print("\n🚌 Generating Buses...")
buses_data = []
bus_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

for i, letter in enumerate(bus_letters):
    buses_data.append({
        'bus_id': str(uuid.uuid4()),
        'bus_number': f"Bus {letter}",
        'capacity': random.choice([35, 40, 45]),
        'driver_user_id': drivers[i]['user_id']
    })

df_buses = pd.DataFrame(buses_data)
print(f"✅ Created {len(df_buses)} buses")

# ============================================================================
# 11. ROUTES
# ============================================================================
print("\n🗺️ Generating Routes...")
route_names = [
    'Kilimani Route', 'Lavington Circuit', 'Westlands Loop', 'Kileleshwa Line',
    'Parklands Path', 'Hurlingham Route', 'Spring Valley Circuit', 'Riverside Drive'
]

routes_data = []
for i, route_name in enumerate(route_names):
    routes_data.append({
        'route_id': str(uuid.uuid4()),
        'route_name': route_name,
        'total_distance_km': round(random.uniform(8, 20), 1),
        'estimated_duration_min': random.randint(35, 75)
    })

df_routes = pd.DataFrame(routes_data)
print(f"✅ Created {len(df_routes)} routes")

# ============================================================================
# 12. ROUTE STOPS
# ============================================================================
print("\n🚏 Generating Route Stops...")

# Nairobi coordinates (approximately Lavington area)
BASE_LAT = -1.2764
BASE_LON = 36.7689

stops_data = []

for route in df_routes.itertuples():
    num_stops = random.randint(5, 8)
    
    for stop_num in range(num_stops):
        # Generate coordinates in a reasonable radius
        lat_offset = random.uniform(-0.02, 0.02)
        lon_offset = random.uniform(-0.02, 0.02)
        
        stops_data.append({
            'stop_id': str(uuid.uuid4()),
            'route_id': route.route_id,
            'stop_name': f"{route.route_name} Stop {stop_num + 1}",
            'stop_order': stop_num + 1,
            'latitude': round(BASE_LAT + lat_offset, 6),
            'longitude': round(BASE_LON + lon_offset, 6),
            'time_from_prev_stop_min': 0 if stop_num == 0 else random.randint(4, 12)
        })

df_route_stops = pd.DataFrame(stops_data)
print(f"✅ Created {len(df_route_stops)} route stops")

# ============================================================================
# 13. STUDENT TRANSPORT (70% of students use transport)
# ============================================================================
print("\n🎒 Generating Student Transport Assignments...")

transport_data = []
num_transport_students = int(len(df_students) * 0.70)
transport_student_ids = random.sample(list(df_students['student_id']), num_transport_students)

for student_id in transport_student_ids:
    # Assign random bus and route
    bus = random.choice(df_buses.to_dict('records'))
    route = random.choice(df_routes.to_dict('records'))
    
    # Get stops for this route
    route_stops = df_route_stops[df_route_stops['route_id'] == route['route_id']].sort_values('stop_order')
    
    if len(route_stops) >= 2:
        pickup_stop = route_stops.iloc[random.randint(0, len(route_stops) - 1)]
        dropoff_stop = pickup_stop  # Usually same stop for both
        
        transport_data.append({
            'id': str(uuid.uuid4()),
            'student_id': student_id,
            'bus_id': bus['bus_id'],
            'pickup_stop_id': pickup_stop['stop_id'],
            'dropoff_stop_id': dropoff_stop['stop_id'],
            'is_active': True
        })

df_student_transport = pd.DataFrame(transport_data)
print(f"✅ Created {len(df_student_transport)} student transport assignments")

# ============================================================================
# 14. FEE PAYMENTS
# ============================================================================
print("\n💰 Generating Fee Payments...")

fee_payments_data = []

for student_row in df_students.itertuples():
    student_id = student_row.student_id
    archetype_name = student_archetypes[student_id]
    
    for term_row in df_terms.itertuples():
        # Fee required per term
        amount_required = 15000.0
        
        # Payment probability based on archetype
        if archetype_name == 'at_risk':
            payment_percentage = random.uniform(0.3, 0.7)
            status = random.choice(['unpaid', 'partial'])
        elif archetype_name == 'declining':
            payment_percentage = random.uniform(0.6, 0.9)
            status = random.choice(['partial', 'paid'])
        else:
            payment_percentage = random.uniform(0.85, 1.0)
            status = 'paid' if payment_percentage >= 0.95 else 'partial'
        
        amount_paid = round(amount_required * payment_percentage, 2)
        balance = round(amount_required - amount_paid, 2)
        
        # Last payment date
        last_payment = term_row.start_date + timedelta(days=random.randint(1, 30))
        
        fee_payments_data.append({
            'payment_id': str(uuid.uuid4()),
            'student_id': student_id,
            'term_id': term_row.term_id,
            'amount_required': amount_required,
            'amount_paid': amount_paid,
            'balance': balance,
            'payment_status': status,
            'last_payment_date': last_payment
        })

df_fee_payments = pd.DataFrame(fee_payments_data)
print(f"✅ Created {len(df_fee_payments)} fee payment records")

# ============================================================================
# EXPORT TO CSV
# ============================================================================
print("\n💾 Exporting to CSV files...")
print("=" * 60)

dataframes = {
    'schools.csv': df_schools,
    'subjects.csv': df_subjects,
    'users.csv': df_users,
    'classes.csv': df_classes,
    'students.csv': df_students,
    'student_parents.csv': df_student_parents,
    'terms.csv': df_terms,
    'exams.csv': df_exams,
    'student_results.csv': df_results,
    'class_attendance.csv': df_attendance,
    'buses.csv': df_buses,
    'routes.csv': df_routes,
    'route_stops.csv': df_route_stops,
    'student_transport.csv': df_student_transport,
    'fee_payments.csv': df_fee_payments
}

for filename, df in dataframes.items():
    df.to_csv(filename, index=False)
    print(f"✅ {filename}: {len(df):,} rows")

# ============================================================================
# SUMMARY STATISTICS
# ============================================================================
print("\n" + "=" * 60)
print("📊 DATA GENERATION SUMMARY")
print("=" * 60)

print(f"\n🏫 School Data:")
print(f"   Schools: {len(df_schools)}")
print(f"   Classes: {len(df_classes)}")
print(f"   Subjects: {len(df_subjects)}")

print(f"\n👥 User Data:")
print(f"   Total Users: {len(df_users):,}")
print(f"   Students: {len(df_students)}")
print(f"   Parents: {len([u for u in users_list if u['role'] == 'parent'])}")
print(f"   Teachers: {len([u for u in users_list if u['role'] == 'teacher'])}")
print(f"   Drivers: {len([u for u in users_list if u['role'] == 'driver'])}")
print(f"   Dropouts: {len(df_students[df_students['status'] == 'dropped_out'])}")

print(f"\n📊 Academic Data:")
print(f"   Terms: {len(df_terms)}")
print(f"   Exams: {len(df_exams)}")
print(f"   Student Results: {len(df_results):,}")
print(f"   Attendance Records: {len(df_attendance):,}")

print(f"\n🚌 Transport Data:")
print(f"   Buses: {len(df_buses)}")
print(f"   Routes: {len(df_routes)}")
print(f"   Route Stops: {len(df_route_stops)}")
print(f"   Students Using Transport: {len(df_student_transport)}")

print(f"\n💰 Financial Data:")
print(f"   Fee Payment Records: {len(df_fee_payments):,}")

# Performance archetype distribution
print(f"\n🎯 Student Performance Archetypes:")
archetype_counts = pd.Series(student_archetypes).value_counts()
for archetype, count in archetype_counts.items():
    percentage = (count / len(student_archetypes)) * 100
    print(f"   {archetype.capitalize()}: {count} ({percentage:.1f}%)")

print("\n" + "=" * 60)
print("✅ DATA GENERATION COMPLETE!")
print("=" * 60)
print("\n📁 All CSV files saved in current directory")
print("🚀 Ready for database import and ML modeling!")
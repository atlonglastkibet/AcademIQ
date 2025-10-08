# AcademIQ Synthetic Data

## Dataset Overview
Clean, ML-ready data for a Kenyan primary school (2023-2025). No missing values, standardized casing.

## Files (16 CSVs)

### Core Structure
- **schools.csv** - 1 school (Lavington Primary)
- **classes.csv** - 12 classes (Grade 1-6, 2 classes each)
- **subjects.csv** - 6 CBC subjects (Math, English, Kiswahili, Science, Social Studies, CRE)

### Users
- **users.csv** - 750+ users (all roles: students, parents, teachers, drivers, admin)
- **students.csv** - 360 students (5% dropouts for modeling)
- **student_parents.csv** - Parent-student relationships

### Academic Performance (ML Core)
- **terms.csv** - 8 terms (2023 T1-T3, 2024 T1-T3, 2025 T1-T2)
- **exams.csv** - 288 exams (opener, midterm, endterm per class per term)
- **student_results.csv** - 52,000+ results with Gaussian variance
  - 5 archetypes: improving (25%), declining (20%), fluctuating (25%), high-performers (20%), at-risk (10%)
- **class_attendance.csv** - 86,000+ records (correlates with performance)

### Transport
- **buses.csv** - 10 buses (Bus A-J)
- **routes.csv** - 8 routes with distances and durations
- **route_stops.csv** - 50+ stops with GPS coordinates
- **student_transport.csv** - 70% of students use transport
- **student_transport_logs.csv** - 1M+ daily events (morning/afternoon pickups/dropoffs) with scheduled/actual timestamps, distances, delays, and statuses (on_time, late, missed, no_show; ties to archetypes and attendance)

### Financial
- **fee_payments.csv** - Fee records per student per term (at-risk students have payment issues)

## Key ML Features
Performance trends (improving/declining patterns)  
Attendance-performance correlation  
Financial hardship signals  
Dropout prediction data (18 dropout cases)  
Transport ETA calculation (GPS coordinates)  
Transport delay prediction (archetype-based variances, time-series logs for logistics optimization)

## Quick Stats
- 360 students across 12 classes
- 2.5 years of academic history
- 52,000+ exam results
- 86,000+ attendance records
- 1M+ transport logs for time-series analysis
- Gaussian distribution with realistic variance
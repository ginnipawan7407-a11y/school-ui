import { Routes } from '@angular/router';

import { DashboardPageComponent } from './feature/dashboard/dashboard-page.component';
import { TeacherAttendanceComponent } from './feature/attendance/teacher-attendance.component';
import { TeacherHomeworkComponent } from './feature/homework/teacher-homework.component';
import { TeacherLeaveComponent } from './feature/leave/teacher-leave.component';
import { TeacherStudentsComponent } from './feature/people/teacher-students.component';
import { StudentAttendanceComponent } from './feature/attendance/student-attendance.component';
import { StudentLeaveComponent } from './feature/leave/student-leave.component';
import { StudentClassmatesComponent } from './feature/people/student-classmates.component';
import { StudentTeachersComponent } from './feature/people/student-teachers.component';
import { StudentHomeworkComponent } from './feature/homework/student-homework.component';
import { FeaturePageComponent } from './feature/main/feature-page.component';

export const routes: Routes = [
	{ path: '', component: DashboardPageComponent },
	{ path: 'workspace/attendance', component: TeacherAttendanceComponent },
	{ path: 'workspace/homework', component: TeacherHomeworkComponent },
	{ path: 'workspace/leave-management', component: TeacherLeaveComponent },
	{ path: 'workspace/student-details', component: TeacherStudentsComponent },
	{ path: 'student/attendance', component: StudentAttendanceComponent },
	{ path: 'student/leave', component: StudentLeaveComponent },
	{ path: 'student/classmates', component: StudentClassmatesComponent },
	{ path: 'student/teacher', component: StudentTeachersComponent },
	{ path: 'student/homework', component: StudentHomeworkComponent },
	{ path: 'workspace/:id', component: FeaturePageComponent },
	{ path: 'profile', component: FeaturePageComponent },
	{ path: 'notifications', component: FeaturePageComponent },
	{ path: '**', redirectTo: '' }
];

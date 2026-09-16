import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { FALLBACK_DASHBOARD_DATA, MenuItem, Role } from '../../common/model/dashboard.models';
import { AnnouncementsService } from '../announcements/announcements.service';
import { AttendanceService } from '../attendance/attendance.service';
import { EventsService } from '../events/events.service';
import { ExamsService } from '../exams/exams.service';
import { FeesService } from '../fees/fees.service';
import { HomeworkService } from '../homework/homework.service';
import { LeaveService } from '../leave/leave.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PeopleService } from '../people/people.service';
import { ProfileService } from '../profile/profile.service';

interface FeatureMetric { label: string; value: string | number; }
@Component({
  selector: 'app-feature-page',
  imports: [RouterLink],
  templateUrl: './feature-page.component.html',
  styleUrl: './feature-page.component.css'
})
export class FeaturePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly attendanceService = inject(AttendanceService);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly eventsService = inject(EventsService);
  private readonly examsService = inject(ExamsService);
  private readonly feesService = inject(FeesService);
  private readonly homeworkService = inject(HomeworkService);
  private readonly leaveService = inject(LeaveService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly peopleService = inject(PeopleService);
  private readonly profileService = inject(ProfileService);
  protected readonly featureId = this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.routeConfig?.path ?? '';
  protected readonly item: MenuItem = this.findItem(this.featureId);
  protected readonly role = this.getRole(this.route.snapshot.queryParamMap.get('role'));
  protected readonly metrics = toSignal(this.getMetrics(this.featureId), { initialValue: [] as FeatureMetric[] });
  private getMetrics(id: string): Observable<FeatureMetric[]> {
    switch (id) {
      case 'attendance': return this.attendanceService.getSummary().pipe(map(data => [
        { label: 'Present', value: data.present }, { label: 'Absent', value: data.absent }, { label: 'Late', value: data.late }
      ]));
      case 'homework': return this.homeworkService.getSummary().pipe(map(data => [
        { label: 'Pending', value: data.pending }, { label: 'Submitted', value: data.submitted }, { label: 'Next due', value: data.nextDue }
      ]));
      case 'leave': case 'leave-management': return this.leaveService.getSummary().pipe(map(data => [
        { label: 'Pending', value: data.pending }, { label: 'Approved', value: data.approved }, { label: 'Remaining', value: data.remaining }
      ]));
      case 'announcements': return this.announcementsService.getRecent().pipe(map(data => data.map(announcement => ({ label: announcement.date, value: announcement.title }))));
      case 'events': return this.eventsService.getUpcoming().pipe(map(data => data.map(event => ({ label: event.date, value: event.title }))));
      case 'exam-result': case 'result': case 'datesheet': return this.examsService.getSummary().pipe(map(data => [
        { label: 'Next exam', value: data.nextExam }, { label: 'Subject', value: data.subject }, { label: 'Result', value: data.resultStatus }
      ]));
      case 'fee': case 'fees': return this.feesService.getSummary().pipe(map(data => [
        { label: 'Outstanding', value: data.outstanding }, { label: 'Paid', value: data.paid }, { label: 'Due date', value: data.dueDate }
      ]));
      case 'profile': return this.profileService.getProfile().pipe(map(data => [
        { label: 'Name', value: data.name },
        { label: 'Username', value: data.username },
        { label: 'Mobile', value: data.mobile },
        { label: 'Email', value: data.email },
        { label: 'Role', value: data.role },
        { label: 'Status', value: data.active ? 'Active' : 'Inactive' }
      ]));
      case 'notifications': return this.notificationsService.getSummary().pipe(map(data => [
        { label: 'Unread', value: data.unread }, { label: 'Latest', value: data.latest }
      ]));
      case 'student-details': case 'classmates': case 'teacher': case 'teachers': case 'students': case 'update-teachers': case 'update-students':
        return this.peopleService.getSummary().pipe(map(data => [
          { label: 'Students', value: data.students }, { label: 'Teachers', value: data.teachers }, { label: 'Classmates', value: data.classmates }
        ]));
      default: return of([]);
    }
  }

  private findItem(id: string): MenuItem {
    const item = Object.values(FALLBACK_DASHBOARD_DATA.menus).flat().find(menuItem => menuItem.id === id);
    return item ?? {
      id,
      label: 'Workspace',
      detail: 'Your selected school workspace',
      icon: 'event',
      tone: 'teal',
      roles: ['Teacher', 'Student', 'Admin']
    };
  }

  private getRole(value: string | null): Role {
    switch (value?.toLowerCase()) {
      case 'student': return 'Student';
      case 'admin': return 'Admin';
      default: return 'Teacher';
    }
  }
}

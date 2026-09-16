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
import { AdminDataService, AdminDataType } from './admin-data.service';

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
  private readonly adminDataService = inject(AdminDataService);
  protected readonly featureId = this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.routeConfig?.path ?? '';
  protected readonly item: MenuItem = this.findItem(this.featureId);
  protected readonly role = this.getRole(this.route.snapshot.queryParamMap.get('role'));
  protected readonly metrics = toSignal(this.getMetrics(this.featureId), { initialValue: [] as FeatureMetric[] });
  protected readonly adminDataTypes: AdminDataType[] = ['Student', 'Teacher', 'Class & Section'];
  protected activeDataTab: 'import' | 'sample' | 'records' = 'import';
  protected selectedImportType: AdminDataType = 'Student';
  protected selectedSampleType: AdminDataType = 'Student';
  protected selectedExportType: AdminDataType = 'Student';
  protected selectedFile: File | null = null;
  protected dataMessage = '';
  protected dataError = '';

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.dataMessage = '';
    this.dataError = '';
  }

  protected selectDataTab(tab: 'import' | 'sample' | 'records'): void {
    this.activeDataTab = tab;
    this.dataMessage = '';
    this.dataError = '';
  }

  protected importSelectedFile(): void {
    if (!this.selectedFile) {
      this.dataError = 'Choose a CSV file before importing.';
      this.dataMessage = '';
      return;
    }

    this.dataMessage = '';
    this.dataError = '';
    this.adminDataService.importFile(this.selectedFile, this.selectedImportType).subscribe({
      next: () => {
        this.dataMessage = `${this.selectedImportType} records imported successfully.`;
        this.selectedFile = null;
      },
      error: () => {
        this.dataError = 'The file could not be imported. Check the CSV format and try again.';
      }
    });
  }

  protected downloadSample(): void {
    const headers: Record<AdminDataType, string> = {
      Student: 'name,username,className,section,email,mobile',
      Teacher: 'name,username,subject,email,mobile',
      'Class & Section': 'className,section'
    };
    this.downloadCsv(`${this.selectedSampleType.toLowerCase().replaceAll(' & ', '-')}-sample.csv`, `${headers[this.selectedSampleType]}\n`);
    this.dataMessage = `${this.selectedSampleType} sample template downloaded.`;
    this.dataError = '';
  }

  protected exportRecords(): void {
    this.dataMessage = '';
    this.dataError = '';
    this.adminDataService.exportRecords(this.selectedExportType).subscribe({
      next: file => this.downloadBlob(`${this.selectedExportType.toLowerCase().replaceAll(' & ', '-')}-records.csv`, file),
      error: () => {
        this.dataError = 'Existing records could not be exported. Please try again.';
      }
    });
  }

  private downloadCsv(fileName: string, content: string): void {
    this.downloadBlob(fileName, new Blob([content], { type: 'text/csv;charset=utf-8' }));
  }

  private downloadBlob(fileName: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

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

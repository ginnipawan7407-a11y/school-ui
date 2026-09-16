import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HomeworkService, StudentWorkItem } from './homework.service';

interface WeekDay { date: string; label: string; dayNumber: number; }

@Component({
  selector: 'app-student-homework',
  imports: [RouterLink],
  templateUrl: './student-homework.component.html'
})
export class StudentHomeworkComponent {
  private readonly homeworkService = inject(HomeworkService);
  protected readonly tab = signal<'CLASSWORK' | 'HOMEWORK'>('CLASSWORK');
  protected readonly work = signal<StudentWorkItem[]>([]);
  protected readonly selectedDate = signal(this.today());
  protected readonly weekDays = computed(() => this.buildWeek(this.selectedDate()));

  constructor() {
    this.homeworkService.getStudentWork(1).subscribe(work => this.work.set(work));
  }

  protected selectTab(tab: 'CLASSWORK' | 'HOMEWORK'): void {
    this.tab.set(tab);
  }

  protected selectDate(date: string): void {
    this.selectedDate.set(date);
  }

  protected filteredWork(): StudentWorkItem[] {
    return this.work().filter(item => item.type === this.tab() && item.date === this.selectedDate());
  }

  private buildWeek(selectedDate: string): WeekDay[] {
    const selected = new Date(`${selectedDate}T00:00:00`);
    const start = new Date(selected);
    start.setDate(selected.getDate() - selected.getDay());
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date: this.toDateString(date),
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
        dayNumber: date.getDate()
      };
    });
  }

  private today(): string {
    return this.toDateString(new Date());
  }

  private toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
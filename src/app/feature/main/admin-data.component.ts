import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminDataService, AdminDataType } from './admin-data.service';

@Component({
  selector: 'app-admin-data',
  imports: [RouterLink],
  templateUrl: './admin-data.component.html',
  styleUrl: './admin-data.component.css'
})
export class AdminDataComponent {
  private readonly adminDataService = inject(AdminDataService);

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
}

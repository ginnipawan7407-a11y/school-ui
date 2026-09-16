import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AdminDataType = 'Student' | 'Teacher' | 'Class & Section';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly http = inject(HttpClient);

  importFile(file: File, dataType: AdminDataType): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', dataType);
    return this.http.post<void>('/api/admin/import', formData);
  }

  exportRecords(dataType: AdminDataType): Observable<Blob> {
    return this.http.get('/api/admin/export', {
      params: { type: dataType },
      responseType: 'blob'
    });
  }
}

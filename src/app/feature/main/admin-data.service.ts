import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type AdminDataType = 'Student' | 'Teacher' | 'Section';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly http = inject(HttpClient);

  importFile(file: File, dataType: AdminDataType): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>('/rest/user-service/api/v1/bulk/import-csv/'+dataType, formData);
  }

  exportRecords(dataType: AdminDataType): Observable<Blob> {
    if (dataType === 'Teacher') {
      return this.http.get('/rest/user-service/api/v1/bulk/export/teacher', {
        responseType: 'blob'
      });
    }
    else if (dataType === 'Student') {
      return this.http.get('/rest/user-service/api/v1/bulk/export/student/class/0/section/0', {
        responseType: 'blob'
      });
    }
    else {
      return this.http.get('/rest/user-service/api/v1/bulk/export/section', {
        responseType: 'blob'
      });
    }
  }
    exportSample(dataType: AdminDataType): Observable<Blob> {
    return this.http.get('/rest/user-service/api/v1/bulk/template/'+dataType, {
      responseType: 'blob'
    });
  }
}

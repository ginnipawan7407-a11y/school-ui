import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { classSectionApiUrl } from '../../core/config/api.config';
import { ClassSectionApiResponse, ClassSectionOption } from '../../common/model/models';

@Injectable({ providedIn: 'root' })
export class ClassSectionService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<ClassSectionOption[]> {
    return this.http.get<ClassSectionApiResponse>(classSectionApiUrl('')).pipe(
      map(response => {
        const classSections = new Map<string, ClassSectionOption>();

        response.data.forEach(classSection => {
          const option = classSections.get(classSection.classId);
          const section = {
            sectionId: classSection.id,
            sectionName: classSection.sectionName,
            capacity: classSection.capacity
          };

          if (option) {
            option.sections.push(section);
          } else {
            classSections.set(classSection.classId, {
              classId: classSection.classId,
              sections: [section]
            });
          }
        });

        return [...classSections.values()];
      })
    );
  }
}

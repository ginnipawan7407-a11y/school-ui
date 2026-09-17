export interface AttendanceSummary { present: number; absent: number; late: number; }

export interface AttendanceStudent {
  id: number;
  name: string;
  rollNumber: string;
  present: boolean;
  onLeave?: boolean;
  admissionNumber?: number;
  classId?: number;
  sectionName?: string;
  attendanceId?: number;
}

export interface AttendanceRecord { date: string; present: boolean; onLeave?: boolean; }
export interface ClassAttendanceDay { date: string; present: number; absent: number; onLeave: number; }

export interface StudentRosterEntry {
  id: number;
  name: string;
  rollNumber: number;
  admissionNumber: number;
  classId: number;
  sectionName: string;
}

export interface AttendanceApiRecord {
  id: number;
  admissionNumber: number;
  teacherId: number;
  classId: number;
  sectionName: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | string;
  remarks: string;
}

export interface AttendanceApiResponse { data: AttendanceApiRecord[]; }

export interface AttendanceSubmission {
  id: number;
  admissionNumber: number;
  teacherId: number;
  classId: number;
  sectionName: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT';
  remarks: string;
}

export const API_BASE_URL = '/rest/user-service';
export const ATTENDANCE_API_BASE_URL = '/attendance';

export const apiUrl = (path: string): string => `${API_BASE_URL}${path}`;
export const attendanceApiUrl = (path: string): string => `${ATTENDANCE_API_BASE_URL}${path}`;

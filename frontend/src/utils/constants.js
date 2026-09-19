export const API_BASE_URL = 'http://127.0.0.1:8000';

export const COMPLAINT_CATEGORIES = [
  'Hostel Maintenance',
  'Mess/Food',
  'Electrical',
  'Plumbing',
  'Internet/Wi-Fi',
  'Room/Furniture',
  'Academic',
  'Infrastructure',
  'Other',
];

export const COMPLAINT_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const COMPLAINT_STATUSES = [
  'Pending',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

export const OUTPASS_STATUSES = [
  'Pending',
  'Parent Verification',
  'Warden Review',
  'Approved',
  'Rejected',
  'Completed',
];

export const ROLES = {
  STUDENT: 'STUDENT',
  WARDEN: 'WARDEN',
  ADMIN: 'ADMIN',
};

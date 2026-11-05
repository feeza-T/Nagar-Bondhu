export const AREAS = ['Dhaka', 'Chattogram', 'Khulna', 'Rajshahi', 'Sylhet', 'Barishal', 'Rangpur'];
export const CATEGORIES = ['overflow', 'dumping', 'drain', 'hazard', 'other'];
export const REPORT_STATUSES = ['pending', 'confirmed', 'campaign', 'cleaned', 'rejected'];
export const dashboardPath = (role) => (role === 'admin' ? '/admin' : role === 'worker' ? '/worker' : null);

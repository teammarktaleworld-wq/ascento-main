// --- MOCKED API FOR "CLIENT DEMO" ---
// This file simulates a live database with functional modules.

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  console.log(`[DEMO MODE] Bypassed API Call to: ${endpoint}`);
  return { success: true, data: [] };
}

export const adminApi = {
  getDashboard: async () => {
    return {
      success: true,
      data: {
        totalStudents: 12,
        totalTeachers: 4,
        attendanceTodayPercentage: 85,
        feesCollectedThisMonth: 15400,
        recentEnquiries: [
          { studentName: "Rahul Verma", course: "Abacus Level 1", source: "Website", status: "New", createdAt: new Date().toISOString() },
          { studentName: "Sanya Gupta", course: "Vedic Math", source: "Instagram", status: "Follow-up", createdAt: new Date().toISOString() }
        ]
      }
    };
  },
  getStudents: async (params: any) => {
    return {
      success: true,
      data: [
        { studentName: "John Doe", studentId: "ASC001", course: "Abacus Level 1", batchCode: "BATCH-A", admissionDate: new Date().toISOString(), status: "Active" },
        { studentName: "Jane Smith", studentId: "ASC002", course: "Advanced Abacus", batchCode: "BATCH-B", admissionDate: new Date().toISOString(), status: "Active" }
      ]
    };
  },
  getEnquiries: async (params: any) => {
    return {
      success: true,
      data: [
        { studentName: "Rahul Verma", email: "rahul@demo.com", phone: "+91 9999999999", course: "Abacus Level 1", status: "New", createdAt: new Date().toISOString() }
      ]
    };
  },
  getAttendance: async (params: any = {}) => {
    return { success: true, data: [] };
  },
  getFees: async (params: any = {}) => {
    return { success: true, data: [] };
  },
  getExams: async (params: any = {}) => {
    return { success: true, data: [] };
  },
};

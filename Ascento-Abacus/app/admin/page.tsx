"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  MessageSquare,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  UserPlus,
  Plus,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  X,
  ClipboardList,
  Send,
  BookOpen,
  Save,
  Clock,
  MoreVertical,
  Upload,
  Trash2,
  Edit3,
  Download,
  Layers,
  Table,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab =
  | "dashboard"
  | "students"
  | "enquiries"
  | "attendance"
  | "fees"
  | "exams"
  | "marks"
  | "notifications"
  | "teachers"
  | "sections"
  | "timetable";

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Data state
  const [students, setStudents] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<Record<string, any[]>>({});
  const [selectedTimetableSectionId, setSelectedTimetableSectionId] = useState("");
  const [timetableEditing, setTimetableEditing] = useState(false);
  const [timetableSlots, setTimetableSlots] = useState<Record<string, Record<number, {subjectId: string, teacherId: string}>>>({});

  // Marks
  const [selectedExamId, setSelectedExamId] = useState("");
  const [marksData, setMarksData] = useState<any[]>([]);
  const [marksInput, setMarksInput] = useState<Record<string, string>>({});
  const [marksTotalInput, setMarksTotalInput] = useState<Record<string, string>>({});

  // Attendance
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSectionId, setSelectedSectionId] = useState("");

  // Teacher edit
  const [editingTeacher, setEditingTeacher] = useState<any>(null);

  // Bulk upload
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [bulkMarksCsvText, setBulkMarksCsvText] = useState("");

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Saved successfully");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Student credentials modal (shown after creating a student)
  const [showCredentials, setShowCredentials] = useState(false);
  const [studentCredentials, setStudentCredentials] = useState<{
    studentId: string;
    loginEmail: string;
    temporaryPassword: string;
  } | null>(null);

  const router = useRouter();

  // ── Load data on mount ─────────────────────────────────────────────
  useEffect(() => {
    fetchDashboard();
    fetchStudents();
    fetchEnquiries();
    fetchExams();
    fetchTeachers();
    fetchNotifications();
    fetchSections();
    fetchSubjects();
    fetchDomains();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Data Fetchers ───────────────────────────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) setDashboardStats(await res.json());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (res.ok) setStudents(await res.json());
    } catch (err) {
      console.error("Students fetch error:", err);
    }
  }, []);

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) setEnquiries(await res.json());
    } catch (err) {
      console.error("Enquiries fetch error:", err);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      let url = `/api/admin/attendance?date=${selectedDate}`;
      if (selectedSectionId) url += `&sectionId=${selectedSectionId}`;
      const res = await fetch(url);
      if (res.ok) setAttendanceData(await res.json());
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  }, [selectedDate, selectedSectionId]);

  const fetchFees = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/fees");
      if (res.ok) setFees(await res.json());
    } catch (err) {
      console.error("Fees fetch error:", err);
    }
  }, []);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/exams");
      if (res.ok) setExams(await res.json());
    } catch (err) {
      console.error("Exams fetch error:", err);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/teachers");
      if (res.ok) setTeachers(await res.json());
    } catch (err) {
      console.error("Teachers fetch error:", err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error("Notifications fetch error:", err);
    }
  }, []);

  const fetchMarks = useCallback(async (examId: string) => {
    if (!examId) return;
    try {
      const res = await fetch(`/api/admin/marks?examId=${examId}`);
      if (res.ok) {
        const data = await res.json();
        setMarksData(data);
        // Pre-fill existing marks
        const inputs: Record<string, string> = {};
        const totals: Record<string, string> = {};
        if (Array.isArray(data)) {
          data.forEach((m: any) => {
            const key = `${m.studentId}_${m.subjectId}`;
            inputs[key] = m.marksObtained?.toString() ?? "";
            totals[key] = m.totalMarks?.toString() ?? "50";
          });
        }
        setMarksInput(inputs);
        setMarksTotalInput(totals);
      }
    } catch (err) {
      console.error("Marks fetch error:", err);
    }
  }, []);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sections");
      if (res.ok) setSections(await res.json());
    } catch {
      // Sections endpoint may not exist yet
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/subjects");
      if (res.ok) setSubjects(await res.json());
    } catch {
      // Subjects endpoint may not exist yet
    }
  }, []);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/domains");
      if (res.ok) setDomains(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  const fetchTimetable = useCallback(async (sectionId: string) => {
    try {
      const res = await fetch(`/api/admin/timetable?sectionId=${sectionId}`);
      if (res.ok) setTimetableData(await res.json());
    } catch (err) { console.error(err); }
  }, []);

  // ── Load data when tab changes ──────────────────────────────────────
  useEffect(() => {
    setDataLoading(true);
    const load = async () => {
      switch (activeTab) {
        case "dashboard":
          await Promise.all([fetchDashboard(), fetchEnquiries(), fetchExams()]);
          break;
        case "students":
          await Promise.all([fetchStudents(), fetchSections()]);
          break;
        case "enquiries":
          await fetchEnquiries();
          break;
        case "attendance":
          await Promise.all([fetchAttendance(), fetchSections()]);
          break;
        case "fees":
          await Promise.all([fetchFees(), fetchStudents()]);
          break;
        case "exams":
          await fetchExams();
          break;
        case "marks":
          await Promise.all([fetchExams(), fetchStudents(), fetchSubjects()]);
          break;
        case "notifications":
          await Promise.all([fetchNotifications(), fetchStudents()]);
          break;
        case "teachers":
          await Promise.all([fetchTeachers(), fetchSubjects()]);
          break;
        case "sections":
          await Promise.all([fetchSections(), fetchDomains()]);
          break;
        case "timetable":
          await Promise.all([fetchSections(), fetchSubjects(), fetchTeachers()]);
          break;
      }
      setDataLoading(false);
    };
    load();
  }, [
    activeTab,
    fetchDashboard,
    fetchStudents,
    fetchEnquiries,
    fetchAttendance,
    fetchFees,
    fetchExams,
    fetchTeachers,
    fetchNotifications,
    fetchSections,
    fetchSubjects,
    fetchDomains,
    fetchTimetable,
  ]);

  // Refetch attendance when date or section changes
  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendance();
    }
  }, [selectedDate, selectedSectionId, activeTab, fetchAttendance]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleLogout = () => {
    router.push("/login");
  };

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: Record<string, any> = Object.fromEntries(formData.entries());

    try {
      let endpoint = "";
      let method = "POST";

      if (modalType === "student") {
        endpoint = "/api/admin/students";
        data.email = data.email || data.parentEmail || "";
      } else if (modalType === "enquiry") {
        endpoint = "/api/admin/enquiries";
      } else if (modalType === "fee") {
        endpoint = "/api/admin/fees";
        data.amount = parseFloat(data.amount as string);
      } else if (modalType === "exam") {
        endpoint = "/api/admin/exams";
      } else if (modalType === "notification") {
        endpoint = "/api/admin/notifications";
      } else if (modalType === "teacher") {
        endpoint = "/api/admin/teachers";
        // Collect subjectIds from checkboxes
        const form = e.currentTarget as HTMLFormElement;
        const checkedBoxes = form.querySelectorAll('input[name="subjectIds"]:checked');
        data.subjectIds = Array.from(checkedBoxes).map((cb: any) => cb.value);
        delete data.subjectIds; // remove the single FormData entry
        const subjectIds = Array.from(checkedBoxes).map((cb: any) => cb.value);
        data.subjectIds = subjectIds;
      } else if (modalType === "edit-teacher") {
        endpoint = "/api/admin/teachers";
        method = "PATCH";
        data.id = editingTeacher?.id;
        // Collect subjectIds from checkboxes
        const form = e.currentTarget as HTMLFormElement;
        const checkedBoxes = form.querySelectorAll('input[name="subjectIds"]:checked');
        data.subjectIds = Array.from(checkedBoxes).map((cb: any) => cb.value);
      } else if (modalType === "section") {
        endpoint = "/api/admin/sections";
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || "Request failed");
        }

        setIsModalOpen(false);
        setEditingTeacher(null);

        // Show credentials modal for student creation
        if (modalType === "student" && responseData.credentials) {
          setStudentCredentials(responseData.credentials);
          setShowCredentials(true);
        } else {
          showToast("Saved successfully");
        }

        // Refetch relevant data
        if (modalType === "student") fetchStudents();
        else if (modalType === "enquiry") fetchEnquiries();
        else if (modalType === "fee") fetchFees();
        else if (modalType === "exam") fetchExams();
        else if (modalType === "notification") fetchNotifications();
        else if (modalType === "teacher" || modalType === "edit-teacher") fetchTeachers();
        else if (modalType === "section") fetchSections();

        // Also refresh dashboard
        fetchDashboard();
      }
    } catch (err: any) {
      console.error("Submission Error:", err);
      alert(err.message || "Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAttendance = async (
    studentId: string,
    status: "present" | "absent" | "late"
  ) => {
    try {
      const res = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date: selectedDate, status }),
      });
      if (!res.ok) throw new Error("Failed");
      // Update local state immediately
      setAttendanceData((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, attendanceStatus: status } : s
        )
      );
    } catch (err) {
      console.error("Attendance error:", err);
      alert("Failed to mark attendance.");
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchEnquiries();
        showToast("Enquiry status updated");
      }
    } catch (err) {
      console.error("Enquiry update error:", err);
    }
  };

  const markFeeAsPaid = async (id: string) => {
    try {
      const res = await fetch("/api/admin/fees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus: "paid" }),
      });
      if (res.ok) {
        fetchFees();
        fetchDashboard();
        showToast("Fee marked as paid");
      }
    } catch (err) {
      console.error("Fee update error:", err);
    }
  };

  const saveMarks = async () => {
    if (!selectedExamId) return;
    setIsSubmitting(true);
    try {
      const entries = Object.entries(marksInput)
        .filter(([, val]) => val !== "")
        .map(([key, val]) => {
          const [studentId, subjectId] = key.split("_");
          return {
            studentId,
            subjectId,
            examId: selectedExamId,
            marksObtained: parseFloat(val),
            totalMarks: parseFloat(marksTotalInput[key] || "50"),
          };
        });

      if (entries.length === 0) {
        alert("No marks entered.");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/admin/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marks: entries }),
      });

      if (res.ok) {
        showToast("Marks saved successfully");
        fetchMarks(selectedExamId);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to save marks");
      }
    } catch (err: any) {
      console.error("Marks save error:", err);
      alert(err.message || "Failed to save marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Teacher ─────────────────────────────────────────────
  const deleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`/api/admin/teachers?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTeachers();
        fetchDashboard();
        showToast("Teacher deleted successfully");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete teacher");
      }
    } catch (err: any) {
      console.error("Delete teacher error:", err);
      alert(err.message || "Failed to delete teacher.");
    }
  };

  // ── Delete Section ─────────────────────────────────────────────
  const deleteSection = async (id: string) => {
    if (!confirm("Delete this section? This will fail if students are enrolled.")) return;
    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: "DELETE" });
      if (res.ok) { fetchSections(); showToast("Section deleted"); }
      else { const err = await res.json(); throw new Error(err.error); }
    } catch (err: any) { alert(err.message || "Failed to delete section."); }
  };

  // ── Save Timetable ────────────────────────────────────────────
  const saveTimetable = async () => {
    if (!selectedTimetableSectionId) return;
    setIsSubmitting(true);
    try {
      const slots: any[] = [];
      const days = ["monday","tuesday","wednesday","thursday","friday","saturday"];
      for (const day of days) {
        for (let period = 1; period <= 8; period++) {
          if (period === 4) continue;
          const edited = timetableSlots[day]?.[period];
          const existing = timetableData[day]?.find((s: any) => s.periodNumber === period);
          const subjectId = edited?.subjectId ?? existing?.subjectId ?? null;
          if (subjectId) {
            slots.push({ dayOfWeek: day, periodNumber: period, subjectId, teacherId: edited?.teacherId || existing?.teacherId || null });
          }
        }
      }
      const res = await fetch("/api/admin/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: selectedTimetableSectionId, slots }),
      });
      if (res.ok) {
        showToast("Timetable saved");
        setTimetableEditing(false);
        setTimetableSlots({});
        fetchTimetable(selectedTimetableSectionId);
      } else throw new Error("Failed to save");
    } catch (err: any) { alert(err.message || "Failed to save timetable."); }
    finally { setIsSubmitting(false); }
  };

  // ── Edit Teacher ──────────────────────────────────────────────
  const openEditTeacher = (teacher: any) => {
    setEditingTeacher(teacher);
    setModalType("edit-teacher");
    setIsModalOpen(true);
  };

  // ── Bulk Upload Students ──────────────────────────────────────
  const handleBulkStudentsUpload = async (sectionId: string, academicYear: string) => {
    if (!bulkCsvText.trim()) {
      alert("Please paste CSV data first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const lines = bulkCsvText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        alert("CSV must have a header row and at least one data row.");
        setIsSubmitting(false);
        return;
      }
      // Skip header row
      const studentRows = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        return {
          fullName: cols[0] || "",
          email: cols[1] || `${Date.now()}@placeholder.com`,
          phone: cols[2] || "",
          dateOfBirth: cols[3] || "",
          gender: cols[4] || "",
          bloodGroup: cols[5] || "",
          rollNumber: cols[6] || "",
          parentName: cols[7] || "",
          parentPhone: cols[8] || "",
          parentEmail: cols[9] || "",
          address: cols[10] || "",
          city: cols[11] || "",
          state: cols[12] || "",
        };
      });

      const res = await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: studentRows, sectionId, academicYear }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Bulk upload failed");
      }

      setIsModalOpen(false);
      setBulkCsvText("");
      showToast("Students uploaded successfully");
      fetchStudents();
      fetchDashboard();
    } catch (err: any) {
      console.error("Bulk students upload error:", err);
      alert(err.message || "Failed to upload students.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Bulk Upload Marks ─────────────────────────────────────────
  const handleBulkMarksUpload = async () => {
    if (!selectedExamId) {
      alert("Please select an exam first.");
      return;
    }
    if (!bulkMarksCsvText.trim()) {
      alert("Please paste CSV data first.");
      return;
    }
    setIsSubmitting(true);
    try {
      const lines = bulkMarksCsvText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        alert("CSV must have a header row and at least one data row.");
        setIsSubmitting(false);
        return;
      }
      // Skip header row
      const marksEntries = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim());
        const studentIdOrCode = cols[0] || "";
        const subjectCode = cols[1] || "";
        const marksObtained = parseFloat(cols[2] || "0");
        const totalMarks = parseFloat(cols[3] || "50");

        // Try to map studentId code to actual ID
        const matchedStudent = students.find(
          (s) => s.studentId === studentIdOrCode || s.id === studentIdOrCode
        );
        // Try to map subjectCode to actual subject ID
        const matchedSubject = subjects.find(
          (s) => s.code === subjectCode || s.name === subjectCode || s.id === subjectCode
        );

        return {
          studentId: matchedStudent?.id || studentIdOrCode,
          subjectId: matchedSubject?.id || subjectCode,
          examId: selectedExamId,
          marksObtained,
          totalMarks,
        };
      });

      const res = await fetch("/api/admin/marks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: selectedExamId, marks: marksEntries }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Bulk marks upload failed");
      }

      setBulkMarksCsvText("");
      showToast("Marks uploaded successfully");
      fetchMarks(selectedExamId);
    } catch (err: any) {
      console.error("Bulk marks upload error:", err);
      alert(err.message || "Failed to upload marks.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Download CSV Template helpers ──────────────────────────────
  const downloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadStudentTemplate = () => {
    const header = "fullName,email,phone,dateOfBirth,gender,bloodGroup,rollNumber,parentName,parentPhone,parentEmail,address,city,state";
    downloadCsv("students_template.csv", header + "\n");
  };

  const downloadMarksTemplate = () => {
    const header = "studentId,subjectCode,marksObtained,totalMarks";
    let csv = header + "\n";
    // Pre-fill with student/subject combinations
    students.forEach((s) => {
      subjects.forEach((sub) => {
        csv += `${s.studentId || s.id},${sub.code || sub.name},,50\n`;
      });
    });
    downloadCsv("marks_template.csv", csv);
  };

  // ── Loading Screen ──────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-16 h-16 border-4 border-[#197fe6] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-sm">
          Loading admin console...
        </p>
      </div>
    );
  }

  // ── Sidebar Items ───────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "students",
      label: "Students",
      icon: Users,
      badge: dashboardStats?.totalStudents || students.length || null,
    },
    {
      id: "enquiries",
      label: "Enquiries",
      icon: MessageSquare,
      badge: enquiries.length || null,
    },
    { id: "attendance", label: "Attendance", icon: CheckCircle2 },
    { id: "fees", label: "Fees", icon: CreditCard },
    { id: "exams", label: "Exams", icon: GraduationCap },
    { id: "marks", label: "Marks", icon: ClipboardList },
    { id: "notifications", label: "Notifications", icon: Bell },
    {
      id: "teachers",
      label: "Teachers",
      icon: BookOpen,
      badge: dashboardStats?.totalTeachers || teachers.length || null,
    },
    { id: "sections", label: "Sections", icon: Layers },
    { id: "timetable", label: "Timetable", icon: Table },
  ];

  const enquiryStatuses = ["New", "Follow-up", "Enrolled", "Closed"];

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col z-50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-[#197fe6]/20">
              <Image
                src="/Acento-Logo.jpg"
                alt="Ascento Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Admin Console
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                  activeTab === item.id
                    ? "bg-[#197fe6] text-white shadow-xl shadow-[#197fe6]/20 font-bold"
                    : "hover:bg-slate-50 text-slate-500 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                      activeTab === item.id
                        ? "bg-white text-[#197fe6]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm mt-8"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 mb-1 font-bold uppercase tracking-widest">
              Logged in as
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              Admin
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-40 sticky top-0">
          <div className="max-w-xl w-full">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#197fe6] transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#197fe6] focus:ring-4 focus:ring-[#197fe6]/5 py-3 pl-12 pr-4 rounded-2xl transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
              Online
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#197fe6] to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 uppercase">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/20">
          <AnimatePresence mode="wait">
            {/* ═══════════════════════════════════════════════════════════
                DASHBOARD TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      Dashboard
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">
                      Overview of your institution
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openModal("student")}
                      className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-xl shadow-[#197fe6]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} strokeWidth={3} /> Add Student
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Students"
                    value={dashboardStats?.totalStudents ?? 0}
                    change="Active enrollments"
                    icon={<Users className="text-blue-500" size={24} />}
                    color="blue"
                    trend="neutral"
                  />
                  <StatCard
                    title="Total Teachers"
                    value={dashboardStats?.totalTeachers ?? 0}
                    change="On staff"
                    icon={<BookOpen className="text-emerald-500" size={24} />}
                    color="emerald"
                    trend="neutral"
                  />
                  <StatCard
                    title="Fees Collected"
                    value={`₹${Number(dashboardStats?.totalFeesCollected ?? 0).toLocaleString()}`}
                    change={`₹${Number(dashboardStats?.pendingFees ?? 0).toLocaleString()} pending`}
                    icon={<CreditCard className="text-violet-500" size={24} />}
                    color="violet"
                    trend="up"
                  />
                  <StatCard
                    title="Attendance Today"
                    value={`${dashboardStats?.attendanceTodayPercentage ?? 0}%`}
                    change="Present today"
                    icon={
                      <CheckCircle2 className="text-orange-500" size={24} />
                    }
                    color="orange"
                    trend="neutral"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Recent Enquiries */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg">
                          Recent Enquiries
                        </h3>
                        <button
                          onClick={() => setActiveTab("enquiries")}
                          className="text-xs font-bold text-[#197fe6] hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                              <th className="px-8 py-4">Name</th>
                              <th className="px-8 py-4">Course</th>
                              <th className="px-8 py-4">Source</th>
                              <th className="px-8 py-4">Status</th>
                              <th className="px-8 py-4 text-right">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(
                              dashboardStats?.recentEnquiries ||
                              enquiries.slice(0, 5)
                            ).map((enq: any, i: number) => (
                              <tr
                                key={enq.id || i}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="px-8 py-4 font-bold text-slate-900 text-sm">
                                  {enq.studentName}
                                </td>
                                <td className="px-8 py-4 text-sm text-slate-500">
                                  {enq.course || "---"}
                                </td>
                                <td className="px-8 py-4">
                                  <span className="px-2.5 py-1 rounded-lg bg-[#197fe6]/5 text-[#197fe6] text-[10px] font-bold uppercase">
                                    {enq.source || "Direct"}
                                  </span>
                                </td>
                                <td className="px-8 py-4">
                                  <StatusBadge status={enq.status} />
                                </td>
                                <td className="px-8 py-4 text-xs text-slate-400 text-right">
                                  {enq.createdAt
                                    ? new Date(
                                        enq.createdAt
                                      ).toLocaleDateString()
                                    : "---"}
                                </td>
                              </tr>
                            ))}
                            {(!dashboardStats?.recentEnquiries ||
                              dashboardStats.recentEnquiries.length === 0) &&
                              enquiries.length === 0 && (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="p-16 text-center text-slate-300 font-medium text-sm"
                                  >
                                    No enquiries yet
                                  </td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Upcoming Exams */}
                    {dashboardStats?.upcomingExams?.length > 0 && (
                      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-slate-100">
                          <h3 className="font-bold text-slate-900 text-lg">
                            Upcoming Exams
                          </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                          {dashboardStats.upcomingExams.map((exam: any) => (
                            <div
                              key={exam.id}
                              className="px-8 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                              <div>
                                <p className="font-bold text-slate-900 text-sm">
                                  {exam.examName}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {exam.description || ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-[#197fe6]">
                                  {exam.examStartDate
                                    ? new Date(
                                        exam.examStartDate
                                      ).toLocaleDateString()
                                    : "TBD"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                      <h3 className="font-bold text-lg mb-8 flex items-center gap-2 relative z-10">
                        <Plus size={20} className="text-[#197fe6]" /> Quick
                        Actions
                      </h3>
                      <div className="grid grid-cols-1 gap-3 relative z-10">
                        <QuickActionBtn
                          onClick={() => openModal("student")}
                          label="Add Student"
                          icon={<UserPlus size={18} />}
                          color="#197fe6"
                        />
                        <QuickActionBtn
                          onClick={() => openModal("enquiry")}
                          label="New Enquiry"
                          icon={<MessageSquare size={18} />}
                          color="#10b981"
                        />
                        <QuickActionBtn
                          onClick={() => openModal("fee")}
                          label="Record Fee"
                          icon={<CreditCard size={18} />}
                          color="#8b5cf6"
                        />
                        <QuickActionBtn
                          onClick={() => openModal("notification")}
                          label="Send Notification"
                          icon={<Send size={18} />}
                          color="#f59e0b"
                        />
                      </div>
                    </div>

                    {/* Recent Payments */}
                    {dashboardStats?.recentPayments?.length > 0 && (
                      <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">
                          Recent Payments
                        </h3>
                        <div className="space-y-3">
                          {dashboardStats.recentPayments
                            .slice(0, 4)
                            .map((p: any) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                              >
                                <div>
                                  <p className="text-sm font-bold text-slate-900">
                                    {p.student?.fullName || "---"}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {p.feeType}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-emerald-600">
                                  ₹{Number(p.amount).toLocaleString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                STUDENTS TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "students" && (
              <motion.div
                key="students"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Students
                  </h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setBulkCsvText("");
                        openModal("bulk-students");
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-white text-[#197fe6] border border-[#197fe6] font-bold text-xs hover:bg-[#197fe6]/5 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Upload size={16} /> Bulk Upload
                    </button>
                    <button
                      onClick={() => openModal("student")}
                      className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Student
                    </button>
                  </div>
                </div>
                <DataTable
                  columns={[
                    { key: "fullName", label: "Full Name" },
                    { key: "studentId", label: "Student ID" },
                    { key: "phone", label: "Phone" },
                    { key: "parentName", label: "Parent" },
                    { key: "city", label: "City" },
                    {
                      key: "status",
                      label: "Status",
                      format: (v: any) => <StatusBadge status={v} />,
                    },
                  ]}
                  data={students.filter(
                    (s) =>
                      !searchQuery ||
                      s.fullName
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      s.studentId
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )}
                />
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                ENQUIRIES TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "enquiries" && (
              <motion.div
                key="enquiries"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Enquiries
                  </h2>
                  <button
                    onClick={() => openModal("enquiry")}
                    className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> New Enquiry
                  </button>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Phone</th>
                        <th className="px-8 py-5">Course</th>
                        <th className="px-8 py-5">Source</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {enquiries
                        .filter(
                          (e) =>
                            !searchQuery ||
                            e.studentName
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((enq: any) => (
                          <tr
                            key={enq.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-8 py-4 text-sm font-bold text-slate-900">
                              {enq.studentName}
                            </td>
                            <td className="px-8 py-4 text-sm text-slate-500">
                              {enq.email || "---"}
                            </td>
                            <td className="px-8 py-4 text-sm text-slate-500">
                              {enq.phone || "---"}
                            </td>
                            <td className="px-8 py-4 text-sm text-slate-500">
                              {enq.course || "---"}
                            </td>
                            <td className="px-8 py-4">
                              <span className="px-2.5 py-1 rounded-lg bg-[#197fe6]/5 text-[#197fe6] text-[10px] font-bold uppercase">
                                {enq.source || "Direct"}
                              </span>
                            </td>
                            <td className="px-8 py-4">
                              <select
                                value={enq.status || "New"}
                                onChange={(e) =>
                                  updateEnquiryStatus(enq.id, e.target.value)
                                }
                                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#197fe6]"
                              >
                                {enquiryStatuses.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-8 py-4 text-xs text-slate-400">
                              {enq.createdAt
                                ? new Date(
                                    enq.createdAt
                                  ).toLocaleDateString()
                                : "---"}
                            </td>
                            <td className="px-8 py-4 text-right">
                              <button className="p-2 rounded-xl hover:bg-white hover:shadow-md text-slate-300 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100">
                                <MoreVertical size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {enquiries.length === 0 && (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-16 text-center text-slate-300 font-medium text-sm"
                          >
                            No enquiries yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                ATTENDANCE TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Attendance
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white p-2 px-4 rounded-2xl border border-slate-200">
                      <Calendar size={18} className="text-[#197fe6]" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent font-bold outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 px-4 rounded-2xl border border-slate-200">
                      <Users size={18} className="text-[#197fe6]" />
                      <select
                        value={selectedSectionId}
                        onChange={(e) => setSelectedSectionId(e.target.value)}
                        className="bg-transparent font-bold outline-none text-sm cursor-pointer"
                      >
                        <option value="">All Sections</option>
                        {sections.map((sec: any) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.class?.name || ""} - {sec.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-8 py-5">Student</th>
                        <th className="px-8 py-5">Roll No.</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Saved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceData.map((student: any) => (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-8 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">
                                {student.fullName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {student.studentId}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">
                            {student.rollNumber || "---"}
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex gap-2">
                              {(
                                ["present", "absent", "late"] as const
                              ).map((status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    markAttendance(student.id, status)
                                  }
                                  className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                    student.attendanceStatus === status
                                      ? status === "present"
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                                        : status === "absent"
                                          ? "bg-red-500 text-white shadow-lg shadow-red-200"
                                          : "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                  }`}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            {student.attendanceStatus ? (
                              <div className="flex items-center justify-end gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                                <CheckCircle2 size={14} /> Saved
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-wider">
                                <Clock size={14} /> Not marked
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {attendanceData.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-16 text-center text-slate-300 font-medium text-sm"
                          >
                            No students found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                FEES TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "fees" && (
              <motion.div
                key="fees"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Fees & Payments
                  </h2>
                  <button
                    onClick={() => openModal("fee")}
                    className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Fee
                  </button>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-8 py-5">Student</th>
                        <th className="px-8 py-5">Fee Type</th>
                        <th className="px-8 py-5">Amount</th>
                        <th className="px-8 py-5">Due Date</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fees.map((fee: any) => (
                        <tr
                          key={fee.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">
                            {fee.student?.fullName || "---"}
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">
                            {fee.feeType}
                          </td>
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">
                            ₹{Number(fee.amount).toLocaleString()}
                          </td>
                          <td className="px-8 py-4 text-xs text-slate-400">
                            {fee.dueDate
                              ? new Date(fee.dueDate).toLocaleDateString()
                              : "---"}
                          </td>
                          <td className="px-8 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                fee.paymentStatus === "paid"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {fee.paymentStatus}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            {fee.paymentStatus !== "paid" && (
                              <button
                                onClick={() => markFeeAsPaid(fee.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {fees.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-16 text-center text-slate-300 font-medium text-sm"
                          >
                            No fee records yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                EXAMS TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "exams" && (
              <motion.div
                key="exams"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Exams
                  </h2>
                  <button
                    onClick={() => openModal("exam")}
                    className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Schedule Exam
                  </button>
                </div>
                <DataTable
                  columns={[
                    { key: "examName", label: "Exam Name" },
                    { key: "description", label: "Description" },
                    {
                      key: "examStartDate",
                      label: "Start Date",
                      format: (v: any) =>
                        v ? new Date(v).toLocaleDateString() : "---",
                    },
                    {
                      key: "examEndDate",
                      label: "End Date",
                      format: (v: any) =>
                        v ? new Date(v).toLocaleDateString() : "---",
                    },
                  ]}
                  data={exams}
                />
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                MARKS TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "marks" && (
              <motion.div
                key="marks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Marks Entry
                  </h2>
                  {selectedExamId && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setBulkMarksCsvText("");
                          openModal("bulk-marks");
                        }}
                        className="px-6 py-3.5 rounded-2xl bg-white text-[#197fe6] border border-[#197fe6] font-bold text-xs hover:bg-[#197fe6]/5 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Upload size={16} /> Bulk Upload
                      </button>
                      <button
                        onClick={saveMarks}
                        disabled={isSubmitting}
                        className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save size={16} /> Save Marks
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Exam Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Select Exam
                  </label>
                  <select
                    value={selectedExamId}
                    onChange={(e) => {
                      setSelectedExamId(e.target.value);
                      if (e.target.value) fetchMarks(e.target.value);
                    }}
                    className="w-full max-w-md bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium outline-none focus:border-[#197fe6] focus:ring-4 focus:ring-[#197fe6]/5"
                  >
                    <option value="">-- Choose an exam --</option>
                    {exams.map((exam: any) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.examName}
                        {exam.examStartDate
                          ? ` (${new Date(exam.examStartDate).toLocaleDateString()})`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marks Grid */}
                {selectedExamId && subjects.length > 0 && students.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-5 sticky left-0 bg-slate-50 z-10">
                              Student
                            </th>
                            {subjects.map((sub: any) => (
                              <th key={sub.id} className="px-4 py-5 text-center min-w-[120px]">
                                {sub.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {students.map((student: any) => (
                            <tr
                              key={student.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-3 sticky left-0 bg-white z-10">
                                <span className="font-bold text-slate-900 text-sm">
                                  {student.fullName}
                                </span>
                              </td>
                              {subjects.map((sub: any) => {
                                const key = `${student.id}_${sub.id}`;
                                return (
                                  <td key={sub.id} className="px-4 py-3 text-center">
                                    <input
                                      type="number"
                                      step="0.01"
                                      placeholder="--"
                                      value={marksInput[key] ?? ""}
                                      onChange={(e) =>
                                        setMarksInput((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      className="w-20 text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm font-medium outline-none focus:border-[#197fe6] focus:ring-2 focus:ring-[#197fe6]/10"
                                    />
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedExamId && subjects.length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                    <p className="text-slate-400 font-medium">
                      No subjects found. Please add subjects first.
                    </p>
                  </div>
                )}

                {!selectedExamId && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                    <ClipboardList
                      size={48}
                      className="text-slate-200 mx-auto mb-4"
                    />
                    <p className="text-slate-400 font-medium">
                      Select an exam above to begin entering marks.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                NOTIFICATIONS TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Notifications
                  </h2>
                  <button
                    onClick={() => openModal("notification")}
                    className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Send Notification
                  </button>
                </div>
                <DataTable
                  columns={[
                    { key: "title", label: "Title" },
                    { key: "message", label: "Message" },
                    {
                      key: "targetType",
                      label: "Target",
                      format: (v: any) => (
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            v === "broadcast"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          {v || "broadcast"}
                        </span>
                      ),
                    },
                    {
                      key: "createdAt",
                      label: "Sent",
                      format: (v: any) =>
                        v ? new Date(v).toLocaleDateString() : "---",
                    },
                  ]}
                  data={notifications}
                />
              </motion.div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                TEACHERS TAB
            ═══════════════════════════════════════════════════════════ */}
            {activeTab === "teachers" && (
              <motion.div
                key="teachers"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Teachers
                  </h2>
                  <button
                    onClick={() => openModal("teacher")}
                    className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Teacher
                  </button>
                </div>
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Phone</th>
                        <th className="px-8 py-5">Experience</th>
                        <th className="px-8 py-5">Subjects</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teachers.map((teacher: any) => (
                        <tr
                          key={teacher.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">
                            {teacher.name}
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">
                            {teacher.user?.email || "---"}
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">
                            {teacher.phone || "---"}
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">
                            {teacher.experience || "---"}
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects?.map((st: any) => (
                                <span
                                  key={st.id}
                                  className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold"
                                >
                                  {st.subject?.name || st.subjectId}
                                </span>
                              )) || (
                                <span className="text-sm text-slate-300">
                                  ---
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditTeacher(teacher)}
                                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-[#197fe6] hover:bg-blue-50 transition-all border border-slate-100"
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => deleteTeacher(teacher.id)}
                                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {teachers.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-16 text-center text-slate-300 font-medium text-sm"
                          >
                            No teachers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "sections" && (
              <motion.div key="sections" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sections</h2>
                  <button onClick={() => openModal("section")} className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                    <Plus size={16} /> Add Section
                  </button>
                </div>

                {sections.length === 0 ? (
                  <div className="bg-white rounded-2xl border p-20 text-center text-slate-300">No sections yet</div>
                ) : (
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <th className="px-8 py-5">Section</th>
                          <th className="px-8 py-5">Class</th>
                          <th className="px-8 py-5">Domain</th>
                          <th className="px-8 py-5">Students</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sections.map((sec: any) => (
                          <tr key={sec.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4 font-bold text-slate-900 text-sm">{sec.sectionName || sec.name}</td>
                            <td className="px-8 py-4 text-sm text-slate-500">{sec.className}</td>
                            <td className="px-8 py-4"><span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">{sec.domain}</span></td>
                            <td className="px-8 py-4 text-sm text-slate-500">{sec.enrollmentCount ?? sec._count?.enrollments ?? "—"}</td>
                            <td className="px-8 py-4 text-right">
                              <button onClick={() => deleteSection(sec.id)} className="p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "timetable" && (
              <motion.div key="timetable" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Timetable</h2>
                  <div className="flex items-center gap-3">
                    {timetableEditing && (
                      <button onClick={saveTimetable} disabled={isSubmitting} className="px-6 py-3.5 rounded-2xl bg-[#197fe6] text-white font-bold text-xs shadow-lg flex items-center gap-2">
                        <Save size={16} /> Save Timetable
                      </button>
                    )}
                    {selectedTimetableSectionId && (
                      <button onClick={() => setTimetableEditing(!timetableEditing)} className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-xs flex items-center gap-2">
                        <Edit3 size={16} /> {timetableEditing ? "Cancel" : "Edit"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Selector */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Section</label>
                  <select value={selectedTimetableSectionId} onChange={(e) => {
                    setSelectedTimetableSectionId(e.target.value);
                    setTimetableEditing(false);
                    if (e.target.value) fetchTimetable(e.target.value);
                  }} className="w-full max-w-md bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-medium outline-none focus:border-[#197fe6]">
                    <option value="">-- Choose a section --</option>
                    {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                {/* Weekly Grid */}
                {selectedTimetableSectionId && (
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                            <th className="px-6 py-5 sticky left-0 bg-slate-50 z-10 min-w-[80px]">Period</th>
                            {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => (
                              <th key={day} className="px-4 py-5 text-center min-w-[160px]">{day}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[1,2,3,4,5,6,7,8].map(period => (
                            <tr key={period} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-3 sticky left-0 bg-white z-10 font-bold text-slate-900 text-sm">{period === 4 ? "Break" : `P${period}`}</td>
                              {["monday","tuesday","wednesday","thursday","friday","saturday"].map(day => {
                                const slot = timetableData[day]?.find((s: any) => s.periodNumber === period);
                                if (timetableEditing && period !== 4) {
                                  return (
                                    <td key={day} className="px-2 py-2">
                                      <select value={timetableSlots[day]?.[period]?.subjectId || slot?.subjectId || ""} onChange={(e) => {
                                        setTimetableSlots(prev => ({...prev, [day]: {...(prev[day]||{}), [period]: {...(prev[day]?.[period]||{teacherId:""}), subjectId: e.target.value}}}));
                                      }} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-xs outline-none focus:border-[#197fe6]">
                                        <option value="">Free</option>
                                        {subjects.map((sub: any) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                      </select>
                                    </td>
                                  );
                                }
                                return (
                                  <td key={day} className="px-4 py-3 text-center">
                                    {period === 4 ? (
                                      <span className="text-xs text-slate-300 italic">—</span>
                                    ) : slot ? (
                                      <div>
                                        <div className="text-sm font-bold text-slate-800">{slot.subject?.name || slot.subjectName || "—"}</div>
                                        <div className="text-[10px] text-slate-400">{slot.teacher?.name || slot.teacherName || ""}</div>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-300">—</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {!selectedTimetableSectionId && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center">
                    <Table size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">Select a section above to view the timetable.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Success Toast ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-12 right-12 z-[200] bg-[#197fe6] text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-blue-400/30 backdrop-blur-xl"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold leading-none mb-1">
                {toastMessage}
              </p>
              <p className="text-[10px] font-medium opacity-70">
                Changes saved to database
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Student Credentials Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showCredentials && studentCredentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCredentials(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#197fe6] to-[#1565c0] p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Student Account Created</h3>
                <p className="text-blue-100 text-sm mt-2">Share these login credentials with the student/parent</p>
              </div>

              {/* Credentials */}
              <div className="p-8 space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID</label>
                  <p className="text-lg font-bold text-slate-900 mt-1 font-mono">{studentCredentials.studentId}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Login Email</label>
                  <p className="text-lg font-bold text-slate-900 mt-1">{studentCredentials.loginEmail}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                  <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Temporary Password</label>
                  <p className="text-xl font-black text-amber-700 mt-1 font-mono tracking-wider">{studentCredentials.temporaryPassword}</p>
                  <p className="text-[11px] text-amber-600 mt-2">Student must change this password on first login</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      const text = `Student ID: ${studentCredentials.studentId}\nLogin Email: ${studentCredentials.loginEmail}\nTemporary Password: ${studentCredentials.temporaryPassword}`;
                      navigator.clipboard.writeText(text);
                      showToast("Credentials copied to clipboard");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#197fe6] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#1565c0] transition-colors"
                  >
                    <ClipboardList size={18} />
                    Copy Credentials
                  </button>
                  <button
                    onClick={() => {
                      setShowCredentials(false);
                      setStudentCredentials(null);
                    }}
                    className="px-8 py-4 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal Layer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl relative overflow-hidden z-20 border border-white max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 pb-0 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
                    {modalType === "student" && "Add Student"}
                    {modalType === "enquiry" && "New Enquiry"}
                    {modalType === "fee" && "Add Fee"}
                    {modalType === "exam" && "Schedule Exam"}
                    {modalType === "notification" && "Send Notification"}
                    {modalType === "teacher" && "Add Teacher"}
                    {modalType === "edit-teacher" && "Edit Teacher"}
                    {modalType === "section" && "Add Section"}
                    {modalType === "bulk-students" && "Bulk Upload Students"}
                    {modalType === "bulk-marks" && "Bulk Upload Marks"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all border border-slate-100"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
                {/* ── Student Form ──────────────────────────────────── */}
                {modalType === "student" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Auto-Generated Credentials</p>
                      <p className="text-[13px] text-blue-700">A Student ID and temporary password will be generated automatically. You&apos;ll see the login credentials after saving.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="fullName"
                        label="Full Name"
                        placeholder="Rahul Sharma"
                        required
                      />
                      <SelectField
                        name="gender"
                        label="Gender"
                        options={["male", "female", "other"]}
                        optionLabels={["Male", "Female", "Other"]}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                      />
                      <SelectField
                        name="bloodGroup"
                        label="Blood Group"
                        options={[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ]}
                      />
                    </div>
                    <InputField
                      name="phone"
                      label="Student Phone"
                      placeholder="+91 98765 43210"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="parentName"
                        label="Parent / Guardian Name"
                        placeholder="Mr. Sharma"
                        required
                      />
                      <InputField
                        name="parentPhone"
                        label="Parent Phone"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <InputField
                      name="parentEmail"
                      label="Parent Email (used for login)"
                      type="email"
                      placeholder="parent@example.com"
                      required
                    />
                    <InputField
                      name="address"
                      label="Address"
                      placeholder="Street, Locality"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="city"
                        label="City"
                        placeholder="New Delhi"
                      />
                      <InputField
                        name="state"
                        label="State"
                        placeholder="Delhi"
                      />
                    </div>
                    {sections.length > 0 && (
                      <SelectField
                        name="sectionId"
                        label="Section"
                        options={sections.map((s: any) => s.id)}
                        optionLabels={sections.map(
                          (s: any) =>
                            `${s.class?.name || ""} - ${s.name}`
                        )}
                      />
                    )}
                  </div>
                )}

                {/* ── Enquiry Form ─────────────────────────────────── */}
                {modalType === "enquiry" && (
                  <div className="space-y-4">
                    <InputField
                      name="studentName"
                      label="Student Name"
                      placeholder="Sumit Jha"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="sumit@example.com"
                        required
                      />
                      <InputField
                        name="phone"
                        label="Phone"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <SelectField
                      name="source"
                      label="Source"
                      options={[
                        "Website",
                        "Instagram",
                        "Referral",
                        "Walk-in",
                        "Other",
                      ]}
                    />
                    <SelectField
                      name="course"
                      label="Interested Course"
                      options={[
                        "Abacus Level 1",
                        "Advanced Abacus",
                        "Vedic Math",
                        "Speed Math",
                        "Play School",
                      ]}
                    />
                    <InputField
                      name="message"
                      label="Notes"
                      placeholder="Any additional notes..."
                    />
                  </div>
                )}

                {/* ── Fee Form ─────────────────────────────────────── */}
                {modalType === "fee" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                        Student
                      </label>
                      <select
                        name="studentId"
                        required
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none"
                      >
                        <option value="">Select student...</option>
                        {students.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.studentId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <SelectField
                      name="feeType"
                      label="Fee Type"
                      options={[
                        "Tuition Fee",
                        "Registration Fee",
                        "Exam Fee",
                        "Activity Fee",
                        "Material Fee",
                        "Other",
                      ]}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="amount"
                        label="Amount (Rs.)"
                        type="number"
                        placeholder="2500"
                        required
                      />
                      <InputField
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* ── Exam Form ────────────────────────────────────── */}
                {modalType === "exam" && (
                  <div className="space-y-4">
                    <InputField
                      name="examName"
                      label="Exam Name"
                      placeholder="Unit Test 3"
                      required
                    />
                    <InputField
                      name="description"
                      label="Description"
                      placeholder="Brief description of the exam"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="examStartDate"
                        label="Start Date"
                        type="date"
                        required
                      />
                      <InputField
                        name="examEndDate"
                        label="End Date"
                        type="date"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* ── Notification Form ────────────────────────────── */}
                {modalType === "notification" && (
                  <div className="space-y-4">
                    <InputField
                      name="title"
                      label="Title"
                      placeholder="Notification title"
                      required
                    />
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={3}
                        placeholder="Write your notification message..."
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none resize-none"
                      />
                    </div>
                    <SelectField
                      name="targetType"
                      label="Target"
                      options={["broadcast", "individual"]}
                      optionLabels={[
                        "All Students (Broadcast)",
                        "Individual Student",
                      ]}
                    />
                    {/* Student selector for individual -- handled via JS if needed */}
                    <div id="notification-student-select">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                        Student (for individual)
                      </label>
                      <select
                        name="studentId"
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none"
                      >
                        <option value="">Select student (optional)...</option>
                        {students.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* ── Teacher Form ────────────────────────────────── */}
                {modalType === "teacher" && (
                  <div className="space-y-4">
                    <InputField
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="teacher@example.com"
                        required
                      />
                      <InputField
                        name="phone"
                        label="Phone"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <InputField
                      name="experience"
                      label="Experience"
                      placeholder="e.g. 5 years"
                    />
                    {subjects.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          Subjects
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          {subjects.map((sub: any) => (
                            <label
                              key={sub.id}
                              className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                name="subjectIds"
                                value={sub.id}
                                className="rounded border-slate-300 text-[#197fe6] focus:ring-[#197fe6]"
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Edit Teacher Form ──────────────────────────── */}
                {modalType === "edit-teacher" && editingTeacher && (
                  <div className="space-y-4">
                    <InputField
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      defaultValue={editingTeacher.name || ""}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="teacher@example.com"
                        defaultValue={editingTeacher.user?.email || ""}
                        required
                      />
                      <InputField
                        name="phone"
                        label="Phone"
                        placeholder="+91 98765 43210"
                        defaultValue={editingTeacher.phone || ""}
                      />
                    </div>
                    <InputField
                      name="experience"
                      label="Experience"
                      placeholder="e.g. 5 years"
                      defaultValue={editingTeacher.experience || ""}
                    />
                    {subjects.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          Subjects
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                          {subjects.map((sub: any) => (
                            <label
                              key={sub.id}
                              className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                name="subjectIds"
                                value={sub.id}
                                defaultChecked={editingTeacher.subjects?.some(
                                  (ts: any) => ts.subjectId === sub.id || ts.subject?.id === sub.id
                                )}
                                className="rounded border-slate-300 text-[#197fe6] focus:ring-[#197fe6]"
                              />
                              {sub.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Section Form ──────────────────────────────── */}
                {modalType === "section" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Domain</label>
                      <select name="domainId" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-medium outline-none focus:border-[#197fe6]">
                        <option value="">Select domain</option>
                        {domains.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                    <InputField name="className" label="Class Name" placeholder="e.g. Grade 10" required />
                    <InputField name="sectionName" label="Section Name" placeholder="e.g. Section A" required />
                  </div>
                )}

                {/* ── Bulk Students Form ─────────────────────────── */}
                {modalType === "bulk-students" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-700 mb-1">CSV Format</p>
                      <p className="text-[11px] text-blue-600 font-mono break-all">
                        fullName,email,phone,dateOfBirth,gender,bloodGroup,rollNumber,parentName,parentPhone,parentEmail,address,city,state
                      </p>
                      <p className="text-[10px] text-blue-500 mt-1">
                        First row should be the header. One student per line.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {sections.length > 0 && (
                        <SelectField
                          name="bulkSectionId"
                          label="Section"
                          options={["", ...sections.map((s: any) => s.id)]}
                          optionLabels={[
                            "Select section...",
                            ...sections.map(
                              (s: any) => `${s.class?.name || ""} - ${s.name}`
                            ),
                          ]}
                        />
                      )}
                      <InputField
                        name="bulkAcademicYear"
                        label="Academic Year"
                        placeholder="2025-26"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Paste CSV Data
                      </label>
                      <textarea
                        value={bulkCsvText}
                        onChange={(e) => setBulkCsvText(e.target.value)}
                        rows={8}
                        placeholder="fullName,email,phone,dateOfBirth,gender,bloodGroup,rollNumber,parentName,parentPhone,parentEmail,address,city,state&#10;Rahul Sharma,rahul@test.com,9876543210,2015-03-15,Male,B+,101,Mr. Sharma,9876543211,parent@test.com,Street 1,Mumbai,Maharashtra"
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-mono focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={downloadStudentTemplate}
                        className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-2"
                      >
                        <Download size={14} /> Download Template
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const form = document.querySelector('select[name="bulkSectionId"]') as HTMLSelectElement;
                          const yearInput = document.querySelector('input[name="bulkAcademicYear"]') as HTMLInputElement;
                          handleBulkStudentsUpload(
                            form?.value || "",
                            yearInput?.value || ""
                          );
                        }}
                        disabled={isSubmitting}
                        className="flex-[2] py-3 rounded-xl bg-[#197fe6] text-white font-bold text-xs shadow-xl shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload size={14} /> Upload Students
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Bulk Marks Form ────────────────────────────── */}
                {modalType === "bulk-marks" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-700 mb-1">CSV Format</p>
                      <p className="text-[11px] text-blue-600 font-mono">
                        studentId,subjectCode,marksObtained,totalMarks
                      </p>
                      <p className="text-[10px] text-blue-500 mt-1">
                        First row should be the header. One entry per line. Use student IDs and subject codes/names.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        Paste CSV Data
                      </label>
                      <textarea
                        value={bulkMarksCsvText}
                        onChange={(e) => setBulkMarksCsvText(e.target.value)}
                        rows={8}
                        placeholder="studentId,subjectCode,marksObtained,totalMarks&#10;STU001,MATH,45,50&#10;STU001,ENG,38,50"
                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-mono focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={downloadMarksTemplate}
                        className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-2"
                      >
                        <Download size={14} /> Download Template
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkMarksUpload}
                        disabled={isSubmitting}
                        className="flex-[2] py-3 rounded-xl bg-[#197fe6] text-white font-bold text-xs shadow-xl shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload size={14} /> Upload Marks
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Submit / Cancel ──────────────────────────────── */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-xl bg-slate-50 text-slate-400 font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 rounded-xl bg-[#197fe6] text-white font-bold text-xs shadow-xl shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Helper Components
// ═══════════════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  let classes = "bg-slate-100 text-slate-500";
  if (s === "active" || s === "enrolled" || s === "paid" || s === "present")
    classes = "bg-emerald-50 text-emerald-600";
  else if (s === "new") classes = "bg-blue-50 text-blue-600";
  else if (s === "follow-up" || s === "pending")
    classes = "bg-amber-50 text-amber-600";
  else if (s === "closed" || s === "inactive" || s === "absent")
    classes = "bg-red-50 text-red-600";

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${classes}`}
    >
      {status || "---"}
    </span>
  );
}

function StatCard({ title, value, change, icon, color, trend }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    orange: "bg-orange-50 text-orange-600 ring-orange-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
  };
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-4 rounded-2xl ring-1 ${colors[color]}`}>
          {icon}
        </div>
        {trend === "up" && (
          <ArrowUpRight size={18} className="text-emerald-500" />
        )}
        {trend === "neutral" && (
          <TrendingUp size={18} className="text-slate-200" />
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
        {title}
      </p>
      <h3 className="text-3xl font-black text-slate-900 mt-1 relative z-10">
        {value}
      </h3>
      <p className="text-[10px] font-medium text-slate-400 mt-2 relative z-10">
        {change}
      </p>
      <div
        className={`absolute -right-8 -bottom-8 w-32 h-32 ${colors[color]} opacity-10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150`}
      ></div>
    </div>
  );
}

function DataTable({ columns, data }: any) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {columns.map((col: any) => (
              <th key={col.key} className="px-8 py-5">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row: any, i: number) => (
            <tr key={row.id || i} className="hover:bg-slate-50 transition-colors">
              {columns.map((col: any) => (
                <td
                  key={col.key}
                  className="px-8 py-4 text-sm font-medium text-slate-600"
                >
                  {col.format
                    ? col.format(row[col.key], row)
                    : row[col.key] || "---"}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-16 text-center text-slate-300 font-medium text-sm"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function QuickActionBtn({ label, icon, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-all text-left group border border-white/5 hover:border-white/10 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl bg-white/10 text-white transition-transform group-hover:scale-110"
          style={{ color }}
        >
          {icon}
        </div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <ChevronRight
        size={14}
        className="opacity-30 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  name,
  optionLabels,
}: {
  label: string;
  options: string[];
  name: string;
  optionLabels?: string[];
}) {
  return (
    <div className="space-y-1.5 flex flex-col">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-[#197fe6]/5 focus:bg-white focus:border-[#197fe6] transition-all outline-none appearance-none cursor-pointer"
        >
          {options.map((opt, i) => (
            <option key={opt} value={opt}>
              {optionLabels ? optionLabels[i] : opt}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDownIcon size={16} />
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon({ size, ...props }: any) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

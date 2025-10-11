import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Edit,
  Trash2,
  Eye,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  Crown,
  BookOpen,
  Calendar,
  TrendingUp,
  Filter,
  Download,
  Upload,
} from "lucide-react";


import { auth, db } from "../firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp 
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Footer from "./Footer";

const THEME_COLORS = {
  DEEP_FOREST: "#1a4d2e",
  BOTANIC_TEAL: "#2d7a5f",
  BRIGHT_TEAL: "#4fa783",
  LIGHT_TEXT: "#e8f5e9",
  SIDEBAR_HOVER: "#235840",
};

function Admindash() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchReports(),
        fetchAnnouncements()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", "student")
      );
      const snapshot = await getDocs(studentsQuery);
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const reportsQuery = query(
        collection(db, "reports"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(reportsQuery);
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const announcementsQuery = query(
        collection(db, "announcements"),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(announcementsQuery);
      const announcementsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "reports", label: "Reports", icon: MessageSquare },
    { id: "announcements", label: "Announcements", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewView students={students} reports={reports} announcements={announcements} />;
      case "students":
        return <StudentsView students={students} refreshStudents={fetchStudents} />;
      case "reports":
        return <ReportsView reports={reports} refreshReports={fetchReports} />;
      case "announcements":
        return <AnnouncementsView announcements={announcements} refreshAnnouncements={fetchAnnouncements} />;
      case "settings":
        return <SettingsView />;
      default:
        return <OverviewView students={students} reports={reports} announcements={announcements} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`text-white transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        } flex flex-col`}
        style={{
          backgroundColor: THEME_COLORS.DEEP_FOREST,
          background: `linear-gradient(180deg, ${THEME_COLORS.DEEP_FOREST} 0%, ${THEME_COLORS.SIDEBAR_HOVER} 100%)`,
        }}
      >
        
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Crown size={24} className="text-gray-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Admin</h2>
                <p className="text-xs text-white/70">Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-white/10 ${!sidebarOpen && "mx-auto"}`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                      isActive ? "bg-white/20 shadow-lg" : "hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => auth.signOut()}
            className="w-full flex items-center p-4 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-4">Log Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-gray-600">Manage your school efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// Overview View
function OverviewView({ students, reports, announcements }) {
  const pendingReports = reports.filter(r => r.status === "pending").length;
  const activeStudents = students.filter(s => s.status === "active").length;

  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "blue",
      change: "+12%"
    },
    {
      title: "Pending Reports",
      value: pendingReports,
      icon: MessageSquare,
      color: "red",
      change: "-5%"
    },
    {
      title: "Active Students",
      value: activeStudents,
      icon: CheckCircle,
      color: "green",
      change: "+8%"
    },
    {
      title: "Announcements",
      value: announcements.length,
      icon: Bell,
      color: "purple",
      change: "+3"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClass = {
            blue: "bg-blue-100 text-blue-600",
            red: "bg-red-100 text-red-600",
            green: "bg-green-100 text-green-600",
            purple: "bg-purple-100 text-purple-600"
          }[stat.color];

          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <MessageSquare size={20} className="mr-2" />
            Recent Reports
          </h3>
          <div className="space-y-3">
            {reports.slice(0, 5).map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm capitalize">{report.category}</p>
                  <p className="text-xs text-gray-500">
                    {report.isAnonymous ? "Anonymous" : report.userEmail || "Student"}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Users size={20} className="mr-2" />
            Recent Students
          </h3>
          <div className="space-y-3">
            {students.slice(0, 5).map((student, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{student.class || "No Class"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {student.status || "active"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Students View
function StudentsView({ students, refreshStudents }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("all");

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = filterClass === "all" || student.class === filterClass;
    
    return matchesSearch && matchesClass;
  });

  const classes = [...new Set(students.map(s => s.class).filter(Boolean))];

  // Delete student function
  const deleteStudent = async (studentId, studentEmail) => {
    if (!confirm(`Are you sure you want to delete this student? This action cannot be undone.`)) return;
    
    try {
      await deleteDoc(doc(db, "users", studentId));
      alert("Student deleted successfully!");
      refreshStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Student</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Class</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {student.firstName?.[0]}{student.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {student.firstName} {student.lastName}
                        </p>
                        {student.admissionNo && (
                          <p className="text-xs text-gray-500">ID: {student.admissionNo}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{student.email}</td>
                  <td className="p-4 text-sm text-gray-600">{student.class || "Not assigned"}</td>
                  <td className="p-4 text-sm text-gray-600">{student.phone || "N/A"}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "active" 
                        ? "bg-green-100 text-green-700" 
                        : student.status === "inactive"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {student.status || "active"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Student"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteStudent(student.id, student.email)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View Profile"
                        onClick={() => {
                          alert(`Viewing profile of ${student.firstName} ${student.lastName}`);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterClass !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first student"
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Student Modal */}
      {(showAddModal || editingStudent) && (
        <StudentModal
          student={editingStudent}
          onClose={() => {
            setShowAddModal(false);
            setEditingStudent(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingStudent(null);
            refreshStudents();
          }}
        />
      )}
    </div>
  );
}

// Student Modal
function StudentModal({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: student?.firstName || "",
    lastName: student?.lastName || "",
    email: student?.email || "",
    phone: student?.phone || "",
    class: student?.class || "",
    admissionNo: student?.admissionNo || "",
    status: student?.status || "active",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (student) {
        // Update existing student
        const studentRef = doc(db, "users", student.id);
        const updateData = { 
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          class: formData.class,
          admissionNo: formData.admissionNo,
          status: formData.status,
          updatedAt: new Date().toISOString()
        };
        
        await updateDoc(studentRef, updateData);
        alert("Student updated successfully!");
      } else {
        // Create new student
        if (!formData.password || formData.password.length < 6) {
          alert("Password must be at least 6 characters");
          setSubmitting(false);
          return;
        }

       
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Add to Firestore
        await addDoc(collection(db, "users"), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          class: formData.class,
          admissionNo: formData.admissionNo,
          role: "student",
          status: formData.status,
          createdAt: new Date().toISOString(),
          uid: userCredential.user.uid,
        });

        alert("Student added successfully!");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving student:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please use a different email.");
      } else {
        alert(error.message || "Failed to save student");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {student ? "Edit Student" : "Add New Student"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  student ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
                disabled={!!student}
                title={student ? "Email cannot be changed" : ""}
              />
              {student && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed for existing students</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+254..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class *
              </label>
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Class</option>
                <option value="Form 1A">Form 1A</option>
                <option value="Form 1B">Form 1B</option>
                <option value="Form 2A">Form 2A</option>
                <option value="Form 2B">Form 2B</option>
                <option value="Form 3A">Form 3A</option>
                <option value="Form 3B">Form 3B</option>
                <option value="Form 4A">Form 4A</option>
                <option value="Form 4B">Form 4B</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admission Number
              </label>
              <input
                type="text"
                value={formData.admissionNo}
                onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="STD2024001"
              />
            </div>

            {!student && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password * (min. 6 characters)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!student}
                  minLength={6}
                  placeholder="Enter temporary password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Student will use this password to login initially
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : student ? (
                <>
                  <CheckCircle size={18} />
                  <span>Update Student</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reports View
function ReportsView({ reports, refreshReports }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = reports.filter(report => 
    filterStatus === "all" || report.status === filterStatus
  );

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      alert("Report status updated successfully!");
      refreshReports();
    } catch (error) {
      console.error("Error updating report:", error);
      alert("Failed to update report status");
    }
  };

  const deleteReport = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await deleteDoc(doc(db, "reports", reportId));
      alert("Report deleted successfully!");
      refreshReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Reports</h2>
          <p className="text-gray-600">Manage and review student reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {report.category}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      From: {report.isAnonymous ? "Anonymous" : report.userEmail || "Student"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === "pending" 
                      ? "bg-yellow-100 text-yellow-700" 
                      : report.status === "resolved" 
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {report.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700">{report.description}</p>
                  
                  {report.timestamp && (
                    <p className="text-xs text-gray-500">
                      Submitted: {new Date(report.timestamp).toLocaleDateString()} at {new Date(report.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2 lg:w-full"
                >
                  <Eye size={18} />
                  <span className="lg:hidden">View</span>
                </button>
                
                {report.status === "pending" && (
                  <button
                    onClick={() => updateReportStatus(report.id, "in-progress")}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center space-x-2 lg:w-full"
                  >
                    <AlertCircle size={18} />
                    <span className="lg:hidden">In Progress</span>
                  </button>
                )}
                
                {report.status !== "resolved" && (
                  <button
                    onClick={() => updateReportStatus(report.id, "resolved")}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center space-x-2 lg:w-full"
                  >
                    <CheckCircle size={18} />
                    <span className="lg:hidden">Resolve</span>
                  </button>
                )}
                
                <button
                  onClick={() => deleteReport(report.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2 lg:w-full"
                >
                  <Trash2 size={18} />
                  <span className="lg:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Reports Found</h3>
            <p className="text-gray-600">There are no reports matching your current filters.</p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {selectedReport.category} Report
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <p className="text-gray-800 capitalize">{selectedReport.category}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedReport.status === "pending" 
                      ? "bg-yellow-100 text-yellow-700" 
                      : selectedReport.status === "resolved" 
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submitted By
                  </label>
                  <p className="text-gray-800">
                    {selectedReport.isAnonymous ? "Anonymous" : selectedReport.userEmail || "Student"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Submitted
                  </label>
                  <p className="text-gray-800">
                    {selectedReport.timestamp ? new Date(selectedReport.timestamp).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedReport.status !== "resolved" && (
                  <button
                    onClick={() => {
                      updateReportStatus(selectedReport.id, "resolved");
                      setSelectedReport(null);
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Announcements View
function AnnouncementsView({ announcements, refreshAnnouncements }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const deleteAnnouncement = async (announcementId) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    
    try {
      await deleteDoc(doc(db, "announcements", announcementId));
      alert("Announcement deleted successfully!");
      refreshAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
          <p className="text-gray-600">Manage school announcements and notifications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-4">
                {announcement.title}
              </h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingAnnouncement(announcement)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteAnnouncement(announcement.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {announcement.message}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {announcement.timestamp ? new Date(announcement.timestamp).toLocaleDateString() : 'N/A'}
              </span>
              <span className={`px-2 py-1 rounded-full ${
                announcement.priority === "high" 
                  ? "bg-red-100 text-red-700" 
                  : announcement.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {announcement.priority || "normal"}
              </span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Announcements</h3>
            <p className="text-gray-600 mb-4">Create your first announcement to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 mx-auto"
            >
              <Plus size={20} />
              <span>Create Announcement</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Announcement Modal */}
      {(showAddModal || editingAnnouncement) && (
        <AnnouncementModal
          announcement={editingAnnouncement}
          onClose={() => {
            setShowAddModal(false);
            setEditingAnnouncement(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingAnnouncement(null);
            refreshAnnouncements();
          }}
        />
      )}
    </div>
  );
}

// Announcement Modal
function AnnouncementModal({ announcement, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: announcement?.title || "",
    message: announcement?.message || "",
    priority: announcement?.priority || "normal",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const announcementData = {
        ...formData,
        timestamp: new Date().toISOString(),
        author: "Admin",
      };

      if (announcement) {
        // Update existing announcement
        const announcementRef = doc(db, "announcements", announcement.id);
        await updateDoc(announcementRef, announcementData);
        alert("Announcement updated successfully!");
      } else {
        // Create new 
        await addDoc(collection(db, "announcements"), announcementData);
        alert("Announcement created successfully!");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {announcement ? "Edit Announcement" : "Create New Announcement"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : announcement ? "Update Announcement" : "Create Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Settings View
function SettingsView() {
  const [settings, setSettings] = useState({
    schoolName: "Greenwood High School",
    academicYear: "2024",
    maxStudentsPerClass: 40,
    enableReports: true,
    enableAnnouncements: true,
    autoApproveStudents: false,
  });

  const handleSaveSettings = async () => {
    try {
      
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h2>
        
        <div className="space-y-6">
          {/* School Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Students Per Class
                </label>
                <input
                  type="number"
                  value={settings.maxStudentsPerClass}
                  onChange={(e) => setSettings({ ...settings, maxStudentsPerClass: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Feature Toggles</h3>
            <div className="space-y-3">
              {[
                { key: 'enableReports', label: 'Enable Reporting System' },
                { key: 'enableAnnouncements', label: 'Enable Announcements' },
                { key: 'autoApproveStudents', label: 'Auto-approve New Students' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[feature.key]}
                      onChange={(e) => setSettings({ ...settings, [feature.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              Reset to Defaults
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    
 
  );
}

export default Admindash;
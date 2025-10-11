
import React, { useState, useEffect } from "react";
import {
  Bell,
  Bus,
  BookOpen,
  Users,
  AlertTriangle,
  Home,
  Calendar,
  MessageSquare,
  Award,
  Send,
  Clock,
  Menu,
  X,
  LogOut,
  Play,
  Clipboard,
  ChevronLeft,
  Search,
  Sparkles,
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  Crown,
  CheckCircle,
  FileText,
  AlertCircle,
  ShieldOff,
  User
} from "lucide-react";
import Footer from "./Footer";
import FloatingChat from "./FloatingChat";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore";

const THEME_COLORS = {
  DEEP_FOREST: "#04736f",
  BOTANIC_TEAL: "#00918C",
  BRIGHT_TEAL: "#00ABA7",
  LIGHT_TEXT: "#B8DBD9",
  SIDEBAR_HOVER: "#006B68",
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper functions
const getWelcomeEmoji = () => {
  const emojis = ["👋", "🎉", "🌟", "🚀", "💫"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getWelcomeMessage = (academicStatus, riskScore) => {
  if (riskScore > 70) {
    return "Let's work together to improve your academic performance!";
  } else if (riskScore > 40) {
    return "You're making good progress! Keep up the consistent work.";
  } else if (academicStatus === "needs_attention") {
    return "We've identified areas for improvement - let's focus on those!";
  } else {
    return "You're doing great! Keep up the amazing work.";
  }
};

// Firebase Data Service
class FirebaseDataService {

  static async getStudentProfile(userId) {
    try {
      console.log('👤 Fetching student profile from Firebase for user:', userId);
      
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error('❌ No user profile found in Firebase');
        return null;
      }

      const userData = userDocSnap.data();
      console.log('✅ Firebase profile data:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Error fetching student profile from Firebase:', error);
      return null;
    }
  }

  // Get student academic data
  static async getStudentAcademicData(userId) {
    try {
      console.log('📊 Fetching academic data from Firebase for user:', userId);
      
      
      const studentsQuery = query(
        collection(db, "students"),
        where("user_id", "==", userId)
      );
      const querySnapshot = await getDocs(studentsQuery);
      
      if (!querySnapshot.empty) {
        const studentData = querySnapshot.docs[0].data();
        console.log('✅ Firebase academic data:', studentData);
        return studentData;
      }

      // If no students collection, check users collection for academic data
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log('✅ Using user data for academic info:', userData);
        return userData;
      }

      return null;
    } catch (error) {
      console.error('❌ Error fetching academic data from Firebase:', error);
      return null;
    }
  }

  // Get student results
  static async getStudentResults(userId) {
    try {
      console.log('🎓 Fetching student results from Firebase for user:', userId);
      
      
      const studentsQuery = query(
        collection(db, "students"),
        where("user_id", "==", userId)
      );
      const studentSnapshot = await getDocs(studentsQuery);
      
      if (studentSnapshot.empty) {
        console.log(' No student record found');
        return [];
      }

      const studentId = studentSnapshot.docs[0].id;
      
      // Get results
      const resultsQuery = query(
        collection(db, "student_results"),
        where("student_id", "==", studentId)
      );
      const resultsSnapshot = await getDocs(resultsQuery);
      
      const results = resultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Firebase results data:', results);
      return results;
    } catch (error) {
      console.error('❌ Error fetching student results from Firebase:', error);
      return [];
    }
  }

  // Get all subjects
  static async getStudentSubjects() {
    try {
      console.log('📚 Fetching subjects from Firebase');
      
      const subjectsSnapshot = await getDocs(collection(db, "subjects"));
      const subjects = subjectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Firebase subjects data:', subjects);
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects from Firebase:', error);
      return [];
    }
  }

  // Get attendance data
  static async getStudentAttendance(userId) {
    try {
      console.log('📅 Fetching attendance from Firebase for user:', userId);
      
     
      const studentsQuery = query(
        collection(db, "students"),
        where("user_id", "==", userId)
      );
      const studentSnapshot = await getDocs(studentsQuery);
      
      if (studentSnapshot.empty) {
        console.log('❌ No student record found for attendance');
        return [];
      }

      const studentId = studentSnapshot.docs[0].id;
      
      // Get attendance
      const attendanceQuery = query(
        collection(db, "class_attendance"),
        where("student_id", "==", studentId)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      const attendance = attendanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Firebase attendance data:', attendance);
      return attendance;
    } catch (error) {
      console.error('❌ Error fetching attendance from Firebase:', error);
      return [];
    }
  }

  // Get predictions
  static async getStudentPredictions(userId) {
    try {
      console.log('🔮 Fetching predictions from Firebase for user:', userId);
      
      
      const studentsQuery = query(
        collection(db, "students"),
        where("user_id", "==", userId)
      );
      const studentSnapshot = await getDocs(studentsQuery);
      
      if (studentSnapshot.empty) {
        console.log('❌ No student record found for predictions');
        return null;
      }

      const studentId = studentSnapshot.docs[0].id;
      
      // Get predictions
      const predictionsQuery = query(
        collection(db, "unified_predictions"),
        where("student_id", "==", studentId)
      );
      const predictionsSnapshot = await getDocs(predictionsQuery);
      
      if (predictionsSnapshot.empty) {
        console.log('No predictions found');
        return null;
      }

      const predictions = predictionsSnapshot.docs[0].data();
      console.log('✅ Firebase predictions data:', predictions);
      return predictions;
    } catch (error) {
      console.error('Error fetching predictions from Firebase:', error);
      return null;
    }
  }

  // Debug: Check what data actually exists in Firebase
  static async debugUserData(userId) {
    try {
      console.log('🔍 DEBUGGING USER DATA IN FIREBASE FOR:', userId);
      
      // Check users collection
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      
      console.log('👤 Firebase user data:', userDocSnap.exists() ? userDocSnap.data() : 'No user document');
      
      // Check students collection
      const studentsQuery = query(
        collection(db, "students"),
        where("user_id", "==", userId)
      );
      const studentSnapshot = await getDocs(studentsQuery);
      
      console.log('🎓 Firebase student data:', !studentSnapshot.empty ? studentSnapshot.docs[0].data() : 'No student document');

      if (!studentSnapshot.empty) {
        const studentId = studentSnapshot.docs[0].id;
        
        
        const resultsQuery = query(
          collection(db, "student_results"),
          where("student_id", "==", studentId)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        console.log('📊 Firebase results data:', resultsSnapshot.docs.map(doc => doc.data()));
        
        
        const attendanceQuery = query(
          collection(db, "class_attendance"),
          where("student_id", "==", studentId)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        console.log('📅 Firebase attendance data:', attendanceSnapshot.docs.map(doc => doc.data()));
        
        
        const predictionsQuery = query(
          collection(db, "unified_predictions"),
          where("student_id", "==", studentId)
        );
        const predictionsSnapshot = await getDocs(predictionsQuery);
        console.log('Firebase predictions data:', !predictionsSnapshot.empty ? predictionsSnapshot.docs[0].data() : 'No predictions');
      }

      // Check subjects
      const subjectsSnapshot = await getDocs(collection(db, "subjects"));
      console.log('Firebase subjects data:', subjectsSnapshot.docs.map(doc => doc.data()));

    } catch (error) {
      console.error('Firebase debug error:', error);
    }
  }

  // Get complete student data
  static async getCompleteStudentData(userId) {
    try {
      console.log('Fetching COMPLETE student data from Firebase for user:', userId);
      
      
      await this.debugUserData(userId);
      
      
      const [
        profileData,
        academicData,
        resultsData,
        subjectsData,
        attendanceData,
        predictionsData
      ] = await Promise.all([
        this.getStudentProfile(userId),
        this.getStudentAcademicData(userId),
        this.getStudentResults(userId),
        this.getStudentSubjects(),
        this.getStudentAttendance(userId),
        this.getStudentPredictions(userId)
      ]);

      const completeData = {
        profile: profileData,
        academic: academicData,
        results: resultsData,
        subjects: subjectsData,
        attendance: attendanceData,
        predictions: predictionsData
      };

      console.log(' COMPLETE FIREBASE STUDENT DATA STRUCTURE:', completeData);
      return completeData;

    } catch (error) {
      console.error(' Error fetching complete student data from Firebase:', error);
      return null;
    }
  }
}

// Header Component
const Header = ({ studentData, activeTabLabel }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className={`w-3 h-3 rounded-full absolute -top-1 -right-1 border-2 border-white ${
            studentData?.academicStatus === "good" ? "bg-green-400" :
            studentData?.academicStatus === "moderate" ? "bg-yellow-400" : "bg-red-400"
          }`}></div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`,
            }}
          >
            {studentData?.avatar || "S"}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{activeTabLabel}</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {studentData?.name ? studentData.name.split(" ")[0] : "Student"}! • 
            Attendance: {studentData?.attendanceRate}% • 
            Risk Score: {studentData?.riskScore}%
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden md:block bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border border-blue-100">
          <p className="text-sm font-medium text-gray-700">
            {getCurrentDate()}
          </p>
        </div>
        <button className="relative p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
          <Bell size={20} className="text-gray-600 group-hover:text-gray-800" />
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
            3
          </span>
        </button>
      </div>
    </div>
  </header>
);

// Dashboard View Component
const DashboardView = ({
  studentData,
  academicData,
  communityData,
  assignments,
  setActiveTab,
}) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Hello, {studentData.name.split(" ")[0]}! {getWelcomeEmoji()}
          </h2>
          <p className="text-blue-100">
            {getWelcomeMessage(studentData.academicStatus, studentData.riskScore)}
          </p>
          <p className="text-blue-100 text-sm mt-1">
            Class: {studentData.class} • Admission: {studentData.admissionNo}
          </p>
        </div>
      </div>
    </div>

    {studentData.riskScore > 30 && (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-start">
          
          <div>
            <h3 className="font-semibold">Academic Support Recommended</h3>
            <p className="text-sm opacity-90 mt-1">
              Your teacher has noticed you might benefit from additional support.
            </p>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-1">Attendance</p>
            <p className="text-3xl font-bold text-blue-800">
              {studentData.attendanceRate}%
            </p>
          </div>
          
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-600 mb-1">Avg Grade</p>
            <p className="text-3xl font-bold text-green-800">
              {academicData.overallAverage}%
            </p>
          </div>
          
        </div>
      </div>

      <div
        onClick={() => setActiveTab("myclasses")}
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-purple-600 mb-1">
              Assignments Due
            </p>
            <p className="text-3xl font-bold text-purple-800">
              {assignments.filter((a) => a.status !== "completed").length}
            </p>
          </div>
          
        </div>
      </div>

      <div
        onClick={() => setActiveTab("community")}
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600 mb-1">
              Study Groups
            </p>
            <p className="text-3xl font-bold text-orange-800">
              {communityData.studyGroups.length}
            </p>
          </div>
          
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            Academic Performance
          </h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-700">
            {academicData.overallAverage >= 80 ? "Excellent" : 
             academicData.overallAverage >= 70 ? "Good Progress" : 
             "Needs Improvement"}
          </span>
        </div>
        <div className="space-y-4">
          {academicData.subjects.slice(0, 3).map((subject, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    subject.trend === "up"
                      ? "bg-green-500"
                      : subject.trend === "down"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-800">{subject.name}</p>
                  <p className="text-sm text-gray-600">
                    Last test: {subject.lastTest}%
                  </p>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {subject.currentGrade}%
              </div>
            </div>
          ))}
        </div>
        <button
          className="w-full mt-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 text-white"
          style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
          onClick={() => setActiveTab("myclasses")}
        >
          View Full Performance Report
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Zap className="mr-2" size={20} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveTab("revisiontools")}
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-purple-50 inline-block mb-2">
              <BookOpen
                className="text-purple-500 group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">Study Now</p>
          </button>
          <button className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
            <div className="p-2 rounded-lg bg-blue-50 inline-block mb-2">
              <Target
                className="text-blue-500 group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">Set Goals</p>
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
          >
            <div className="p-2 rounded-lg bg-green-50 inline-block mb-2">
              <Users
                className="text-green-500 group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">Join Group</p>
          </button>
          <button className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
            <div className="p-2 rounded-lg bg-orange-50 inline-block mb-2">
              <BarChart3
                className="text-orange-500 group-hover:scale-110 transition-transform"
                size={20}
              />
            </div>
            <p className="text-sm font-medium text-gray-700">Progress</p>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// My Classes View Component
const MyClassesView = ({
  academicData,
  revisionData,
  todaySchedule,
  assignments,
  setActiveTab
}) => {
  const [subActiveTab, setSubActiveTab] = useState("overview");

  const subMenuItems = [
    {
      id: "performance",
      label: "My Performance",
      icon: Award,
      description: "View grades and progress analytics",
      gradient: "from-green-400 to-emerald-500",
    },
    {
      id: "schedule",
      label: "Today's Classes",
      icon: Calendar,
      description: "Smart timetable with locations",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      id: "assignments",
      label: "My Assignments",
      icon: Clipboard,
      description: "Track deadlines and submissions",
      gradient: "from-red-400 to-orange-500",
    },
    {
      id: "resources",
      label: "Class Resources",
      icon: BookOpen,
      description: "Notes and study materials",
      gradient: "from-blue-400 to-cyan-500",
    },
  ];

  const renderSubView = () => {
    switch (subActiveTab) {
      case "performance":
        return (
          <PerformanceDetails
            academicData={academicData}
            revisionData={revisionData}
            setActiveTab={setActiveTab} 
          />
        );
      case "schedule":
        return <ScheduleDetails todaySchedule={todaySchedule} />;
      case "assignments":
        return <AssignmentsDetails assignments={assignments} />;
      case "resources":
        return <ResourcesDetails />;
      case "overview":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subMenuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSubActiveTab(item.id)}
                className="group cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-4`}
                  >
                    <item.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.label}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="flex items-center mt-4 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                    <span>Explore</span>
                    <ChevronLeft
                      size={16}
                      className="ml-1 transform rotate-180"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  const currentTitle =
    subActiveTab === "overview"
      ? "My Classes Overview"
      : subMenuItems.find((i) => i.id === subActiveTab)?.label;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">{currentTitle}</h2>
        {subActiveTab !== "overview" && (
          <button
            onClick={() => setSubActiveTab("overview")}
            className="flex items-center font-medium px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ color: THEME_COLORS.BOTANIC_TEAL }}
          >
            <ChevronLeft size={18} className="mr-1" /> Back to Overview
          </button>
        )}
      </div>
      {renderSubView()}
    </div>
  );
};

// Performance Details Component
const PerformanceDetails = ({ academicData, revisionData, setActiveTab }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center">
        <Award className="mr-3" size={28} />
        My Performance
      </h3>
      <p className="text-green-100">
        Overall Average:{" "}
        <span className="font-bold text-lg">
          {academicData.overallAverage}%
        </span>
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-xl">
                Subject
              </th>
              <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Current Grade
              </th>
              <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-xl">
                Last Test
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {academicData.subjects.map((subject, idx) => (
              <tr
                key={idx}
                className={
                  subject.currentGrade < 70
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-gray-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        subject.trend === "up"
                          ? "bg-green-500"
                          : subject.trend === "down"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    {subject.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                  {subject.currentGrade}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subject.lastTest}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <Lightbulb className="mr-3 text-yellow-500" size={24} />
        <h4 className="text-lg font-semibold text-gray-800">
          Smart Recommendations
        </h4>
      </div>
      <div className="space-y-4">
        {revisionData.recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border-l-4 ${
              rec.priority === "high"
                ? "bg-red-50 border-red-400"
                : rec.priority === "medium"
                ? "bg-yellow-50 border-yellow-400"
                : "bg-green-50 border-green-400"
            }`}
          >
            <div className="flex flex-col">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">
                  {rec.subject}: {rec.topic}
                </p>
                <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                  onClick={() => setActiveTab("revisiontools")}
                >
                  Start Revision
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Schedule Details Component
const ScheduleDetails = ({ todaySchedule }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center">
        <Calendar className="mr-3" size={28} />
        Today's Schedule
      </h3>
      <p className="text-purple-100">{getCurrentDate()}</p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="space-y-3">
        {todaySchedule.map((cls, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border-l-4 ${
              cls.status === "completed"
                ? "bg-gray-50 border-gray-400"
                : cls.status === "ongoing"
                ? "bg-green-50 border-green-500"
                : "bg-blue-50 border-blue-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {cls.subject}
                </p>
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <Clock size={16} className="inline mr-2" />
                  {cls.time}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {cls.room} • {cls.teacher}
                </p>
              </div>
              <span
                className={`text-xs px-4 py-2 rounded-full font-medium ${
                  cls.status === "completed"
                    ? "bg-gray-200 text-gray-700"
                    : cls.status === "ongoing"
                    ? "bg-green-200 text-green-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {cls.status === "completed"
                  ? "Completed"
                  : cls.status === "ongoing"
                  ? "Ongoing"
                  : "Upcoming"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Assignments Details Component
const AssignmentsDetails = ({ assignments }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center">
        <Clipboard className="mr-3" size={28} />
        My Assignments
      </h3>
      <p className="text-red-100">
        {assignments.filter((a) => a.status !== "completed").length} assignments
        pending
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="space-y-4">
        {assignments.map((assignment, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border-l-4 ${
              assignment.status === "overdue"
                ? "bg-red-50 border-red-500"
                : assignment.status === "in-progress"
                ? "bg-yellow-50 border-yellow-500"
                : "bg-blue-50 border-blue-500"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="font-semibold text-lg text-gray-900">
                    {assignment.title}
                  </p>
                  {assignment.priority === "high" && (
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{assignment.subject}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Due:{" "}
                  {new Date(assignment.dueDate).toLocaleDateString("en-GB")}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    assignment.status === "overdue"
                      ? "bg-red-200 text-red-800"
                      : assignment.status === "in-progress"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-blue-200 text-blue-800"
                  }`}
                >
                  {assignment.status === "overdue"
                    ? "Overdue"
                    : assignment.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Resources Details Component
const ResourcesDetails = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center">
        <BookOpen className="mr-3" size={28} />
        Class Resources
      </h3>
      <p className="text-blue-100">Access all your study materials</p>
    </div>

    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          "Mathematics Notes",
          "Physics Lab Reports",
          "Chemistry Revision Guide",
          "Biology Past Papers",
          "English Essays",
          "History Timeline",
        ].map((resource, idx) => (
          <div
            key={idx}
            className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <FileText size={24} className="text-blue-600" />
            </div>
            <p className="font-medium text-gray-800">{resource}</p>
            <p className="text-sm text-gray-500 mt-1">PDF • 2.4MB</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
              Download →
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Revision Tools View Component
const RevisionToolsView = ({ revisionData }) => {
  const [khanAcademyVideos, setKhanAcademyVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const quickAccessSubjects = [
    { id: 'math', name: 'Mathematics', url: 'https://www.khanacademy.org/math' },
    { id: 'science', name: 'Science', url: 'https://www.khanacademy.org/science' },
    { id: 'test-prep', name: 'Test Prep', url: 'https://www.khanacademy.org/test-prep' },
    { id: 'computing', name: 'Computing', url: 'https://www.khanacademy.org/computing' },
    { id: 'arts-humanities', name: 'Arts & Humanities', url: 'https://www.khanacademy.org/humanities' },
    { id: 'economics', name: 'Economics', url: 'https://www.khanacademy.org/economics-finance-domain' },
    { id: 'physics', name: 'Physics', url: 'https://www.khanacademy.org/science/physics' },
    { id: 'chemistry', name: 'Chemistry', url: 'https://www.khanacademy.org/science/chemistry' },
    { id: 'biology', name: 'Biology', url: 'https://www.khanacademy.org/science/biology' },
  ];

  const handleSubjectSelect = (subject) => {
    window.open(subject.url, '_blank');
  };

  const searchKhanAcademy = async (topic, subject) => {
    setLoading(true);
    setSelectedTopic({ topic, subject });
    
    
    setTimeout(() => {
      const videos = getKhanAcademyFallback(topic, subject);
      setKhanAcademyVideos(videos);
      setLoading(false);
    }, 1000);
  };

  const getKhanAcademyFallback = (topic, subject) => {
    const fallbackVideos = {
      mathematics: [
        { 
          id: 'Tr1qee-rX_k', 
          title: 'Algebra Basics - Khan Academy', 
          description: 'Learn the fundamentals of algebra with Khan Academy',
          topic: 'algebra'
        },
        { 
          id: 'WUvTyaaN5zY', 
          title: 'Calculus Introduction', 
          description: 'Introduction to calculus concepts and principles',
          topic: 'calculus'
        },
      ],
      physics: [
        { 
          id: 'ZLkP14DtY70', 
          title: 'Physics and Motion', 
          description: 'Understanding motion and forces in physics',
          topic: 'motion'
        },
      ],
      chemistry: [
        { 
          id: 'FSyAehMdpyI', 
          title: 'Chemistry Introduction', 
          description: 'Basic chemistry concepts and principles',
          topic: 'chemistry'
        },
      ],
      biology: [
        { 
          id: 'ukYOd7PCezo', 
          title: 'Biology Introduction', 
          description: 'Introduction to biology and life sciences',
          topic: 'biology'
        },
      ]
    };

    const subjectKey = subject.toLowerCase();
    const videos = fallbackVideos[subjectKey] || fallbackVideos.mathematics;
    
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`,
      channelTitle: 'Khan Academy',
      url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      duration: '15 min',
      subject: subject
    }));
  };

  const VideoCard = ({ video }) => (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => window.open(video.url, '_blank')}
    >
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
          <span className="mr-1">🎓</span>
          Khan Academy
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm">
          {video.title}
        </h3>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {video.description}
        </p>
        
        <button
          className="w-full py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 flex items-center justify-center text-sm"
          style={{ backgroundColor: '#14bf96' }}
        >
          <Play size={14} className="mr-2" />
          Watch on Khan Academy
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <BookOpen className="mr-3" size={28} />
              Khan Academy Revision
            </h2>
            <p className="text-green-100">Free world-class education for everyone</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl">
            <span className="text-2xl">🎓</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Access to Subjects</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickAccessSubjects.map((subject) => (
              <button
                key={subject.id}
                className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl text-black transition-all duration-200 backdrop-blur-sm text-sm font-medium hover:scale-105"
                onClick={() => handleSubjectSelect(subject)}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTopic ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedTopic(null);
                setKhanAcademyVideos([]);
              }}
              className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
            >
              <ChevronLeft size={20} className="mr-2" />
              Back to Topics
            </button>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTopic.subject}: {selectedTopic.topic}
              </h2>
              <p className="text-gray-600">Khan Academy tutorials and exercises</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <span className="text-green-600">🎓</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Khan Academy Content</h3>
                <p className="text-sm text-green-700">
                  All content is provided by Khan Academy - a free, world-class education platform. 
                  Includes videos, articles, and practice exercises.
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Loading Khan Academy content...</span>
            </div>
          )}

          {!loading && khanAcademyVideos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {khanAcademyVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}

          {!loading && khanAcademyVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen size={64} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Khan Academy content found
              </h3>
              <p className="text-gray-600 mb-4">
                Try searching for a different topic or visit Khan Academy directly.
              </p>
              <button
                onClick={() => window.open('https://www.khanacademy.org', '_blank')}
                className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#14bf96' }}
              >
                Visit Khan Academy
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="mr-2 text-green-600" size={20} />
              Recommended Study Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revisionData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => searchKhanAcademy(rec.topic, rec.subject)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : rec.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {rec.priority} priority
                    </span>
                    <BookOpen size={20} className="text-gray-400" />
                  </div>
                  
                  <h4 className="font-bold text-gray-800 mb-2">{rec.subject}</h4>
                  <p className="text-gray-600 text-sm mb-3">{rec.topic}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Khan Academy
                    </span>
                    <button
                      className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 flex items-center"
                      style={{ backgroundColor: '#14bf96' }}
                    >
                      <Play size={16} className="mr-1" />
                      Study
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2 text-green-600">🎓</span>
              Why Khan Academy?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">📚</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Free Content</p>
                <p className="text-xs text-gray-600">Completely free forever</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">🎯</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Personalized</p>
                <p className="text-xs text-gray-600">Adapts to your level</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">🏆</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Trusted</p>
                <p className="text-xs text-gray-600">Used by millions</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">⚡</span>
                </div>
                <p className="text-sm font-medium text-gray-800">Practice</p>
                <p className="text-xs text-gray-600">Interactive exercises</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Community View Component
const CommunityView = ({ communityData }) => {
  const whatsappGroups = {
    "mathematics excellence": "https://chat.whatsapp.com/HzLIVuQxUXuCdpIJa5pnjI?mode=ems_wa_t",
    mathematics: "https://chat.whatsapp.com/your-math-group-link",
    physics: "https://chat.whatsapp.com/your-physics-group-link",
    chemistry: "https://chat.whatsapp.com/your-chemistry-group-link", 
    biology: "https://chat.whatsapp.com/your-biology-group-link",
    english: "https://chat.whatsapp.com/your-english-group-link",
    history: "https://chat.whatsapp.com/your-history-group-link",
    computing: "https://chat.whatsapp.com/your-computing-group-link",
    default: "https://chat.whatsapp.com/general-study-group"
  };

  const getWhatsAppLink = (groupName, topic) => {
    const normalizedName = groupName.toLowerCase();
    const normalizedTopic = topic.toLowerCase();
    return whatsappGroups[normalizedName] || 
           whatsappGroups[normalizedTopic] || 
           whatsappGroups.default;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Users className="mr-3" size={28} />
          Learning Community
        </h2>
        <p className="text-green-100">Connect, collaborate, and learn together on WhatsApp</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Groups</p>
              <p className="text-3xl font-bold text-gray-800">
                {communityData.studyGroups.length}
              </p>
            </div>
            <Users className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-3xl font-bold text-gray-800">
                {communityData.activePeerConnections}
              </p>
            </div>
            <User className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">WhatsApp Groups</p>
              <p className="text-3xl font-bold text-gray-800">
                {Object.keys(whatsappGroups).length - 1} 
              </p>
            </div>
            <MessageSquare className="text-green-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-start">
          <MessageSquare className="mr-3 mt-1 text-blue-600" size={24} />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">How to Join Study Groups</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click "Join WhatsApp" to open the group invite</li>
              <li>• Tap "Join Group" in WhatsApp to participate</li>
              <li>• Introduce yourself when you join</li>
              <li>• Follow group rules and be respectful</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Available Study Groups</h3>
          <div className="flex items-center text-sm text-gray-600">
            <MessageSquare size={16} className="mr-2 text-green-500" />
            Connected via WhatsApp
          </div>
        </div>
        <div className="space-y-4">
          {communityData.studyGroups.map((group, idx) => (
            <div
              key={idx}
              className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-lg text-gray-900">
                      {group.name}
                    </p>
                    <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      WhatsApp Group
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {group.members} members • {group.topic}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Next session: {new Date(group.nextSession).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => window.open(getWhatsAppLink(group.name, group.topic), '_blank')}
                  className="ml-4 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 flex items-center"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Join WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Don't see your study group?
        </h3>
        <p className="text-gray-600 mb-4">
          Start a new WhatsApp group for your subject and share the link with your classmates
        </p>
        <button
          onClick={() => window.open('https://chat.whatsapp.com/invite/new-group', '_blank')}
          className="px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 inline-flex items-center"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageSquare size={20} className="mr-2" />
          Create New WhatsApp Group
        </button>
      </div>
    </div>
  );
};

// Report Issue View Component
const ReportIssueView = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category || !description) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const reportData = {
        category,
        description,
        isAnonymous,
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      if (!isAnonymous && auth.currentUser) {
        reportData.userId = auth.currentUser.uid;
        reportData.userEmail = auth.currentUser.email;
      }

      
      await addDoc(collection(db, "reports"), reportData);

      setSubmitSuccess(true);
      setCategory("");
      setDescription("");
      setIsAnonymous(false);

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting report to Firebase:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <MessageSquare className="mr-3" size={28} />
          Report an Issue or Get Help
        </h2>
        <p className="text-pink-100">We're here to support you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldOff, title: "Safety Concern", color: "red" },
          { icon: AlertTriangle, title: "Academic Issue", color: "yellow" },
          { icon: User, title: "Personal Support", color: "blue" },
        ].map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setCategory(cat.title)}
            className={`bg-white rounded-xl shadow-lg p-6 border ${
              category === cat.title ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
            } hover:shadow-xl transition-all duration-300 hover:scale-105 text-left`}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-${cat.color}-100 flex items-center justify-center mb-4`}
            >
              <cat.icon size={24} className={`text-${cat.color}-600`} />
            </div>
            <h3 className="font-bold text-gray-800">{cat.title}</h3>
            <p className="text-sm text-gray-600 mt-2">Report or seek help</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Submit a Report</h3>
        
        {submitSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="font-medium text-green-900">Report Submitted Successfully!</p>
              <p className="text-sm text-green-700">
                {isAnonymous 
                  ? "Your anonymous report has been received. We'll look into it."
                  : "Your report has been received. We'll get back to you soon."}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category...</option>
              <option value="Safety Concern">Safety Concern</option>
              <option value="Bullying">Bullying</option>
              <option value="Academic Issue">Academic Issue</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="6"
              placeholder="Please describe the issue in detail..."
              required
            ></textarea>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="anonymous" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-900 block">
                  Submit Anonymously
                </span>
                <span className="text-sm text-gray-600">
                  Your identity will not be shared with anyone. The report will be completely anonymous.
                </span>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-medium text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit Report</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-800 mb-3">Emergency Contacts</h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">
            School Counselor:{" "}
            <span className="font-medium">+254 700 123 456</span>
          </p>
          <p className="text-gray-700">
            Principal's Office:{" "}
            <span className="font-medium">+254 700 123 457</span>
          </p>
          <p className="text-gray-700">
            Emergency Hotline: <span className="font-medium">999</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Main StudentPortal Component
function StudentPortal() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [revisionData, setRevisionData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Firebase auth state changed:', currentUser?.uid);
      setUser(currentUser);

      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      console.log('🔄 Starting data fetch for Firebase user:', userId);
      
      
      const completeData = await FirebaseDataService.getCompleteStudentData(userId);
      
      if (completeData) {
        processFirebaseData(completeData, userId);
      } else {
        console.log('❌ No data found in Firebase, using fallback');
        setFallbackData(userId);
      }

    } catch (error) {
      console.error("Error fetching user data from Firebase:", error);
      setFallbackData(userId);
    } finally {
      setLoading(false);
    }
  };

  const processFirebaseData = (firebaseData, userId) => {
    const { profile, academic, results, subjects, attendance, predictions } = firebaseData;

    console.log('🔄 Processing Firebase data:', { 
      hasProfile: !!profile, 
      hasAcademic: !!academic, 
      resultsCount: results?.length,
      subjectsCount: subjects?.length,
      attendanceCount: attendance?.length,
      hasPredictions: !!predictions
    });

    // Process Profile Data - handle Firebase data structure
    if (profile) {
      const displayName = profile.full_name || 
                         (profile.first_name && profile.last_name 
                           ? `${profile.first_name} ${profile.last_name}` 
                           : profile.first_name || profile.email?.split('@')[0] || "Student");
      
      setUserData(profile);
      setStudentData({
        name: displayName,
        class: academic?.class_id || academic?.class || "Form 3A",
        admissionNo: academic?.admission_number || academic?.admissionNo || `STD${userId.slice(-6)}`,
        attendanceRate: calculateAttendanceRate(attendance),
        academicStatus: getAcademicStatus(predictions),
        riskScore: predictions?.dropout_risk ? Math.round(predictions.dropout_risk * 100) : 
                  predictions?.risk_score || 25,
        avatar: displayName.split(" ").map(n => n[0]).join("").toUpperCase() || "S",
        email: profile.email || "",
        phone: profile.phone || "",
        status: academic?.status || "active",
      });
    } else {
      console.log('❌ No profile data found in Firebase');
      setStudentData(getFallbackStudentData(userId));
    }

    // Process Academic Data
    const processedAcademicData = processAcademicResults(results, subjects);
    setAcademicData(processedAcademicData);

    // Process Revision Data
    const processedRevisionData = processRevisionData(results, predictions, processedAcademicData);
    setRevisionData(processedRevisionData);

    // Process Community Data (using fallback for now)
    setCommunityData(getFallbackCommunityData());

    // Process Schedule (using fallback for now)
    setTodaySchedule(getFallbackSchedule());

    // Process Assignments (using fallback for now)
    setAssignments(getFallbackAssignments());
  };

  const calculateAttendanceRate = (attendanceData) => {
    if (!attendanceData || attendanceData.length === 0) return 92;
    
    const totalClasses = attendanceData.length;
    const presentClasses = attendanceData.filter(record => 
      record.status === 'present' || record.status === 'Present'
    ).length;
    
    return Math.round((presentClasses / totalClasses) * 100);
  };

  const getAcademicStatus = (predictions) => {
    if (!predictions) return "good";
    
    const dropoutRisk = predictions.dropout_risk || 0;
    if (dropoutRisk > 0.7) return "needs_attention";
    if (dropoutRisk > 0.4) return "moderate";
    return "good";
  };

  const processAcademicResults = (results, subjects) => {
    if (!results || results.length === 0 || !subjects || subjects.length === 0) {
      return getFallbackAcademicData();
    }

    // Create a map of subject IDs to names
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.subject_id] = subject.name;
    });

    // Group results by subject
    const subjectResults = {};
    results.forEach(result => {
      const subjectName = subjectMap[result.subject_id] || 'Unknown Subject';
      if (!subjectResults[subjectName]) {
        subjectResults[subjectName] = [];
      }
      subjectResults[subjectName].push(result.marks);
    });

    // Create academic subjects array
    const academicSubjects = Object.entries(subjectResults).map(([subjectName, marks]) => {
      const averageGrade = Math.round(marks.reduce((sum, mark) => sum + mark, 0) / marks.length);
      const lastTest = marks[0]; // Most recent test
      const trend = marks.length > 1 ? 
        (marks[0] > marks[1] ? "up" : marks[0] < marks[1] ? "down" : "stable") : 
        "stable";

      return {
        name: subjectName,
        currentGrade: averageGrade,
        trend: trend,
        lastTest: lastTest
      };
    });

    
    if (academicSubjects.length === 0) {
      return getFallbackAcademicData();
    }

    const overallAverage = Math.round(
      academicSubjects.reduce((sum, subject) => sum + subject.currentGrade, 0) / academicSubjects.length
    );

    return {
      subjects: academicSubjects,
      overallAverage: overallAverage,
      warnings: []
    };
  };

  const processRevisionData = (results, predictions, academicData) => {
    const recommendations = [];

    
    if (academicData && academicData.subjects) {
      academicData.subjects.forEach(subject => {
        if (subject.currentGrade < 70) {
          recommendations.push({
            subject: subject.name,
            topic: `${subject.name} Review`,
            reason: `Current grade: ${subject.currentGrade}% - needs improvement`,
            priority: subject.currentGrade < 50 ? "high" : "medium",
            resources: 4
          });
        }
      });
    }

    
    if (results && results.length > 0) {
      const recentLowResults = results
        .filter(result => result.marks < 70)
        .slice(0, 2);
      
      recentLowResults.forEach(result => {
        recommendations.push({
          subject: "Recent Test",
          topic: "Test Performance Review",
          reason: `Low score in test: ${result.marks}%`,
          priority: result.marks < 50 ? "high" : "medium",
          resources: 3
        });
      });
    }

    
    if (predictions && predictions.dropout_risk > 0.5) {
      recommendations.push({
        subject: "Overall Performance",
        topic: "Academic Support",
        reason: "High dropout risk detected - seek additional support",
        priority: "high",
        resources: 5
      });
    }

    
    if (recommendations.length === 0) {
      recommendations.push(
        {
          subject: "General",
          topic: "Study Skills Improvement",
          reason: "Maintain your excellent academic performance",
          priority: "low",
          resources: 4
        }
      );
    }

    return { recommendations };
  };

  
  const getFallbackStudentData = (userId) => {
    const userEmail = auth.currentUser?.email || "";
    const userName = auth.currentUser?.displayName || userEmail.split('@')[0] || "Student";
    
    return {
      name: userName,
      class: "Form 3A",
      admissionNo: `STD${userId ? userId.slice(-6) : '2023001'}`,
      attendanceRate: 92,
      academicStatus: "good",
      riskScore: 25,
      avatar: userName.split(" ").map(n => n[0]).join("").toUpperCase() || "S",
      email: userEmail,
    };
  };

  const getFallbackAcademicData = () => ({
    subjects: [
      { name: "Mathematics", currentGrade: 78, trend: "up", lastTest: 82 },
      { name: "English", currentGrade: 85, trend: "stable", lastTest: 84 },
      { name: "Physics", currentGrade: 65, trend: "down", lastTest: 62 },
      { name: "Chemistry", currentGrade: 72, trend: "up", lastTest: 75 },
      { name: "Biology", currentGrade: 88, trend: "up", lastTest: 90 },
    ],
    overallAverage: 77.6,
    warnings: [],
  });

  const getFallbackRevisionData = (academicData) => {
    
    const lowPerformingSubjects = academicData?.subjects?.filter(subject => subject.currentGrade < 70) || [];
    
    const recommendations = lowPerformingSubjects.map(subject => ({
      subject: subject.name,
      topic: `${subject.name} Fundamentals`,
      reason: `Low score in recent tests (${subject.currentGrade}%)`,
      priority: subject.currentGrade < 50 ? "high" : "medium",
      resources: 3
    }));

    
    if (recommendations.length === 0) {
      recommendations.push(
        {
          subject: "Mathematics",
          topic: "Advanced Problem Solving",
          reason: "Maintain excellent performance",
          priority: "low",
          resources: 4
        },
        {
          subject: "Science",
          topic: "Experimental Methods",
          reason: "Prepare for upcoming labs",
          priority: "medium",
          resources: 3
        }
      );
    }

    return { recommendations };
  };

  const getFallbackCommunityData = () => ({
    studyGroups: [
      {
        name: "Mathematics Excellence",
        members: 12,
        nextSession: new Date(Date.now() + 86400000).toISOString(),
        topic: "Calculus Practice",
      },
      {
        name: "Science Study Group", 
        members: 8,
        nextSession: new Date(Date.now() + 2 * 86400000).toISOString(),
        topic: "Physics & Chemistry",
      },
    ],
    mentorshipRequests: 0,
    activePeerConnections: 8,
  });

  const getFallbackSchedule = () => [
    {
      subject: "Mathematics",
      time: "08:00 - 09:00",
      room: "Room 101",
      teacher: "Mr. Smith",
      status: "upcoming"
    },
    {
      subject: "Physics", 
      time: "09:15 - 10:15",
      room: "Lab 3",
      teacher: "Mrs. Johnson",
      status: "upcoming"
    },
    {
      subject: "English",
      time: "10:30 - 11:30", 
      room: "Room 205",
      teacher: "Ms. Davis",
      status: "upcoming"
    },
  ];

  const getFallbackAssignments = () => [
    {
      title: "Mathematics Problem Set",
      subject: "Mathematics",
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: "pending",
      priority: "medium"
    },
    {
      title: "Physics Lab Report",
      subject: "Physics", 
      dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
      status: "in-progress",
      priority: "high"
    },
  ];

  const setFallbackData = (userId) => {
    const fallbackStudentData = getFallbackStudentData(userId);
    const fallbackAcademicData = getFallbackAcademicData();
    const fallbackRevisionData = getFallbackRevisionData(fallbackAcademicData);
    
    setStudentData(fallbackStudentData);
    setAcademicData(fallbackAcademicData);
    setRevisionData(fallbackRevisionData);
    setCommunityData(getFallbackCommunityData());
    setTodaySchedule(getFallbackSchedule());
    setAssignments(getFallbackAssignments());
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: Home },
    { id: "myclasses", label: "My Classes", icon: Calendar },
    { id: "revisiontools", label: "Revision Tools", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "reportissue", label: "Report/Need Help", icon: MessageSquare },
  ];

  const getActiveTabLabel = () => {
    const item = menuItems.find((item) => item.id === activeTab);
    return item ? item.label : "Portal";
  };

  const renderContent = () => {
    if (!studentData || !academicData || !revisionData || !communityData) {
      return <div className="flex justify-center items-center h-64">Loading data...</div>;
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            studentData={studentData}
            academicData={academicData}
            communityData={communityData}
            assignments={assignments}
            setActiveTab={setActiveTab}
          />
        );
      case "myclasses":
        return (
          <MyClassesView
            academicData={academicData}
            revisionData={revisionData}
            todaySchedule={todaySchedule}
            assignments={assignments}
            setActiveTab={setActiveTab}
          />
        );
      case "revisiontools":
        return <RevisionToolsView revisionData={revisionData} />;
      case "community":
        return <CommunityView communityData={communityData} />;
      case "reportissue":
        return <ReportIssueView />;
      default:
        return <h2 className="text-xl">404: View Not Found</h2>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <p>You need to be logged in to access the student portal.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50/30"
        style={{
          "--color-deep-forest": THEME_COLORS.DEEP_FOREST,
          "--color-botanic-teal": THEME_COLORS.BOTANIC_TEAL,
          "--color-bright-teal": THEME_COLORS.BRIGHT_TEAL,
          "--color-light-text": THEME_COLORS.LIGHT_TEXT,
          "--color-sidebar-hover": THEME_COLORS.SIDEBAR_HOVER,
        }}
      >
        
        <div
          className={`text-white transition-all duration-300 ${
            sidebarOpen ? "w-80" : "w-20"
          } flex flex-col relative z-40`}
          style={{
            backgroundColor: "var(--color-deep-forest)",
            background: `linear-gradient(180deg, ${THEME_COLORS.DEEP_FOREST} 0%, ${THEME_COLORS.SIDEBAR_HOVER} 100%)`,
          }}
        >
          
          <div
            className={`p-6 flex items-center justify-between border-b border-white/10`}
          >
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Crown size={18} className="text-yellow-300" />
                </div>
                <h2 className="text-xl font-bold">Student Portal</h2>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                !sidebarOpen && "mx-auto"
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* User Profile */}
          <div className={`p-6 border-b border-white/10`}>
            <div
              className={`flex items-center ${
                !sidebarOpen && "justify-center"
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.BRIGHT_TEAL})`,
                }}
              >
                {studentData?.avatar || "S"}
              </div>
              {sidebarOpen && studentData && (
                <div className="ml-4">
                  <p className="font-semibold">{studentData.name}</p>
                  <p className="text-sm opacity-80">{studentData.class}</p>
                  <p className="text-xs opacity-60">{studentData.admissionNo}</p>
                </div>
              )}
            </div>
          </div>

          
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
                      <Icon
                        size={20}
                        className={isActive ? "text-white" : "text-white/80"}
                      />
                      {sidebarOpen && (
                        <span className="ml-4 font-medium">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          
          <div className={`p-4 border-t border-white/10 space-y-2`}>
            <button 
              onClick={() => auth.signOut()}
              className="w-full flex items-center p-4 rounded-xl hover:bg-red-500/20 transition-colors text-white/80 hover:text-white"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="ml-4">Log Out</span>}
            </button>
          </div>
        </div>

        
        <div className="flex-1 flex flex-col overflow-hidden">
          {studentData && (
            <Header
              studentData={studentData}
              activeTabLabel={getActiveTabLabel()}
            />
          )}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      <Footer />
      <FloatingChat />
    </>
  );
}

export default StudentPortal;
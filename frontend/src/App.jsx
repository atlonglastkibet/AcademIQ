// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Components
import HomePage from "./Components/HomePage";
import Roles from "./Components/Roles";
import RegLog from "./Components/RegLog";
import ParentDashboard from "./Components/Parentdash";
import Admindash from "./Components/Admindash";
import StudentPortal from "./Components/StudentPortal";
import Teacherdash from "./Components/Teacherdash";

// Firebase (since you're using Firebase auth, not Supabase auth)
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Supabase for data only (not auth)
// import { supabase } from "./services/supabaseDataScience";

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use Firebase for authentication
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔥 Firebase auth state changed:', currentUser?.uid);
      setUser(currentUser);

      if (currentUser) {
        try {
          // Try to get role from Firebase first
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log('🔥 Firebase user data:', userData);
            setUserRole(userData.role || "student");
          } else {
            // If no Firebase doc, try Supabase
            console.log('🔄 No Firebase user doc, checking Supabase...');
            const { data, error } = await supabase
              .from("users")
              .select("role")
              .eq("user_id", currentUser.uid)
              .single();

            if (error) {
              console.log('No user found in Supabase either, defaulting to student');
              setUserRole("student");
            } else {
              console.log('Supabase user role:', data.role);
              setUserRole(data.role);
            }
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole("student"); // Default to student on error
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Debug loading state
  useEffect(() => {
    if (loading) {
      console.log('🔄 App is loading...', { user, userRole });
    } else {
      console.log('✅ App loaded:', { user: user?.uid, userRole });
    }
  }, [loading, user, userRole]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading AcademIQ...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/auth" element={<RegLog />} />
        <Route path="/register" element={<RegLog />} />
        <Route path="/login" element={<RegLog />} />

        {/* Protected Role-based Routes */}
        <Route
          path="/studentportal"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : userRole === "student" || !userRole ? (
              <StudentPortal />
            ) : (
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                  <p className="text-gray-600 mb-4">You don't have permission to access the student portal.</p>
                  <p className="text-sm text-gray-500">Your role: {userRole}</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )
          }
        />
        
        <Route
          path="/parentdashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : userRole === "parent" ? (
              <ParentDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        <Route
          path="/admindash"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : userRole === "admin" ? (
              <Admindash />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/teacherdash"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : userRole === "teacher" ? (
              <Teacherdash />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
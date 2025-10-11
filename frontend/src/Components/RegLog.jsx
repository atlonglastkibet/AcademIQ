import React, { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock, X } from "lucide-react";
import regi1 from "../assets/regi1.jpg";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const RegLog = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    firstName: "", 
    lastName: "", 
    password: "", 
    confirmPassword: "", 
  });
  const navigate = useNavigate();

  // ✅ Firebase Login
  const handleLoginSubmit = async () => {
    // Clean and validate
    const email = loginData.email?.trim();
    const password = loginData.password;
    
    console.log("Attempting Firebase login...");
    console.log("Email:", email);
    console.log("Password length:", password?.length);

    // Validate inputs
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase login successful!");
      
      // Get user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userRole = userData.role || "student";
        
        console.log("User role:", userRole);
        
        // Redirect based on role
        switch (userRole) {
          case "student":
            navigate("/studentportal");
            break;
          case "parent":
            navigate("/parentdashboard");
            break;
          case "admin":
            navigate("/admindash");
            break;
          case "teacher":
            navigate("/teacherdashboard");
            break;
          default:
            navigate("/studentportal");
        }
      } else {
        // Default to student portal if no role found
        navigate("/studentportal");
      }
      
    } catch (error) {
      console.error("Firebase login error:", error);
      
      if (error.code === 'auth/invalid-credential') {
        alert("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        alert("No account found with this email. Please sign up first.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Incorrect password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        alert("Too many failed login attempts. Please try again later.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  // ✅ Firebase Signup
  const handleSignupSubmit = async () => {
    if (!acceptTerms) {
      alert("Please accept Terms of Service");
      return;
    }

    // Clean inputs
    const email = signupData.email?.trim();
    const firstName = signupData.firstName?.trim();
    const lastName = signupData.lastName?.trim();
    const password = signupData.password;
    const confirmPassword = signupData.confirmPassword;

    // Validate
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    console.log("Attempting Firebase signup with:", email);

    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Firebase auth user created:", user.uid);

      // 2. Get role from URL parameter or default to student
      const urlParams = new URLSearchParams(window.location.search);
      const role = urlParams.get('role') || 'student';

      // 3. Create user document in Firestore with the correct role
      await setDoc(doc(db, "users", user.uid), {
        user_id: user.uid,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        email: email,
        role: role, // Use the role from URL parameter
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log("Firestore user document created with role:", role);

      // 4. Also create a student document if role is student
      if (role === "student") {
        try {
          await setDoc(doc(db, "students", user.uid), {
            user_id: user.uid,
            admission_number: `STD${Date.now()}`,
            class_id: "default",
            status: "active",
            created_at: new Date().toISOString(),
          });
          console.log("Student document created successfully!");
        } catch (studentError) {
          console.log("Student document creation optional - continuing:", studentError);
        }
      }

      // 5. Redirect based on role
      switch (role) {
        case "student":
          navigate("/studentportal");
          break;
        case "parent":
          navigate("/parentdashboard");
          break;
        case "admin":
          navigate("/admindash");
          break;
        case "teacher":
          navigate("/teacherdash");
          break;
        default:
          navigate("/studentportal");
      }
      
    } catch (error) {
      console.error("Firebase signup error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please log in instead.");
        setActiveTab("login");
      } else if (error.code === 'auth/weak-password') {
        alert("Password is too weak. Please choose a stronger password.");
      } else if (error.code === 'auth/invalid-email') {
        alert("Invalid email address format.");
      } else {
        alert("Signup failed: " + error.message);
      }
    }
  };

  // ✅ Handlers for input fields
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  if (!isModalOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <button onClick={() => setIsModalOpen(true)}>Open Login/Register</button>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-green-100 relative">
        {/* Return Home */}
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => navigate("/")} 
            className="text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-full shadow-md transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Branding */}
        <div className="text-center p-2">
          <h1 className="text-4xl font-bold text-black mb-2">AcademIQ</h1>
          <p className="text-black">Smart learning for bright futures.</p>
        </div>

        {/* Modal */}
        <div className="flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full relative overflow-hidden flex">
            {/* Left Image */}
            <div className="hidden md:block w-1/2 relative">
              <img src={regi1} alt="Registration visual" className="h-full w-full object-cover" />
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 relative flex flex-col">
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X size={24} className="text-gray-600" />
              </button>

              {/* Tabs */}
              <div className="grid grid-cols-2">
                <button 
                  onClick={() => setActiveTab("login")}
                  className={`p-4 text-lg font-semibold transition-all ${
                    activeTab === "login" 
                      ? "bg-gray-100 text-gray-800" 
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setActiveTab("signup")}
                  className={`p-4 text-lg font-semibold transition-all ${
                    activeTab === "signup" 
                      ? "bg-green-600 text-white" 
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Area */}
              <div className="p-8 overflow-y-auto max-h-[90vh]">
                {activeTab === "login" ? (
                  // ✅ Login Form
                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                          <Mail size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email" 
                          value={loginData.email} 
                          onChange={handleLoginChange}
                          className="flex-1 px-4 py-3 outline-none text-gray-700" 
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                          <Lock size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" 
                          placeholder="Password" 
                          value={loginData.password} 
                          onChange={handleLoginChange}
                          className="flex-1 px-4 py-3 outline-none text-gray-700" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} className="text-gray-600" />
                          ) : (
                            <Eye size={20} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleLoginSubmit}
                      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      LOGIN
                    </button>
                  </div>
                ) : (
                  // Signup Form
                  <div className="space-y-5">
                    {/* Email */}
                    <div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                          <Mail size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email" 
                          value={signupData.email} 
                          onChange={handleSignupChange}
                          className="flex-1 px-4 py-3 outline-none text-gray-700" 
                        />
                      </div>
                    </div>

                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-3 py-3 border-r border-gray-300">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type="text" 
                          name="firstName" 
                          placeholder="First Name" 
                          value={signupData.firstName} 
                          onChange={handleSignupChange}
                          className="flex-1 px-3 py-3 outline-none text-gray-700" 
                        />
                      </div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-3 py-3 border-r border-gray-300">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type="text" 
                          name="lastName" 
                          placeholder="Last Name" 
                          value={signupData.lastName} 
                          onChange={handleSignupChange}
                          className="flex-1 px-3 py-3 outline-none text-gray-700" 
                        />
                      </div>
                    </div>

                    {/* Passwords */}
                    <div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                          <Lock size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          name="password" 
                          placeholder="Password" 
                          value={signupData.password} 
                          onChange={handleSignupChange}
                          className="flex-1 px-4 py-3 outline-none text-gray-700" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} className="text-gray-600" />
                          ) : (
                            <Eye size={20} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-green-600 transition-colors">
                        <div className="bg-gray-100 px-4 py-3 border-r border-gray-300">
                          <Lock size={20} className="text-gray-600" />
                        </div>
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          name="confirmPassword" 
                          placeholder="Confirm Password" 
                          value={signupData.confirmPassword} 
                          onChange={handleSignupChange}
                          className="flex-1 px-4 py-3 outline-none text-gray-700" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} className="text-gray-600" />
                          ) : (
                            <Eye size={20} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={acceptTerms} 
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5 cursor-pointer" 
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer select-none">
                        I accept the{" "}
                        <span className="text-green-600 hover:text-green-700 font-medium">
                          Terms of Service
                        </span>
                      </label>
                    </div>

                    <button 
                      onClick={handleSignupSubmit}
                      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      SIGN UP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegLog;
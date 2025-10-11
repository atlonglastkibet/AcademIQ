import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, GraduationCap, BookOpen, Bus, Settings } from "lucide-react";
import bgImage from "../assets/roles.jpg";

function Roles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const defaultRoles = ["student", "parent", "teacher", "admin", "driver"];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log("🔄 Fetching roles from Supabase...");
        
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .not("role", "is", null);

        if (error) {
          console.error("Supabase error:", error);
          
          setRoles(defaultRoles);
          return;
        }

        console.log("Raw roles data:", data);

        if (!data || data.length === 0) {
          console.log("No roles found in database, using defaults");
          setRoles(defaultRoles);
        } else {
          
          const uniqueRoles = [...new Set(data.map((u) => u.role).filter(Boolean))];
          console.log("Unique roles:", uniqueRoles);
          
          if (uniqueRoles.length === 0) {
            setRoles(defaultRoles);
          } else {
            setRoles(uniqueRoles);
          }
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        
        setRoles(defaultRoles);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading roles...</p>
      </div>
    );
  }

  const getRoleStyle = (roleName) => {
    const cleanRole = roleName?.trim().toLowerCase();
    
    const styles = {
      parent: { color: "bg-blue-500", icon: <User size={32} /> },
      student: { color: "bg-green-500", icon: <GraduationCap size={32} /> },
      teacher: { color: "bg-purple-500", icon: <BookOpen size={32} /> },
      driver: { color: "bg-orange-500", icon: <Bus size={32} /> },
      admin: { color: "bg-gray-700", icon: <Settings size={32} /> }
    };

    return styles[cleanRole] || { color: "bg-gray-400", icon: <User size={32} /> };
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-4xl font-bold text-white mb-2">AcademIQ</h1>
        <p className="text-gray-200 mb-8">
          Your caring digital companion for the educational journey
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl">
          {roles.map((roleName) => {
            const style = getRoleStyle(roleName);
            
            return (
              <button
                key={roleName}
                onClick={() => navigate(`/register?role=${roleName.toLowerCase()}`)}
                className="flex flex-col items-center justify-center w-72 h-48 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
              >
                <div className={`p-3 rounded-xl text-white mb-4 ${style.color}`}>
                  {style.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {roleName}
                </h3>
                <p className="text-sm text-gray-600 mt-2">Click to continue as {roleName}</p>
              </button>
            );
          })}
        </div>

        <p className="mt-8 text-white text-lg">Select your role to continue</p>
        
        
      </div>
    </div>
  );
}

export default Roles;
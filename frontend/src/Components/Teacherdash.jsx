import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  ClipboardList,
  Users,
  BookOpen,
  Home,
  CalendarCheck
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from './Footer'


const Teacherdash = () => {
  const [activeSection, setActiveSection] = useState("dashboard");


  
const [selectedDate, setSelectedDate] = useState(new Date());
const [events, setEvents] = useState([
  { date: new Date(), title: "" },
]);
const [newEvent, setNewEvent] = useState("");


const handleAddEvent = () => {
  if (newEvent.trim() === "") return;
  setEvents([...events, { date: selectedDate, title: newEvent }]);
  setNewEvent("");
};

const termStart = new Date("2025-08-23"); //school term start
const today = new Date();
const weekNumber = Math.ceil((today - termStart) / (7 * 24 * 60 * 60 * 1000));

const [newClassName, setNewClassName] = useState("");
const [newClassSchedule, setNewClassSchedule] = useState("");
const [newLastLesson, setNewLastLesson] = useState("");
const [newLastAssignment, setNewLastAssignment] = useState("");
const [newNextTopic, setNewNextTopic] = useState("");
const [newNextAssignment, setNewNextAssignment] = useState("");

const addClass = () => {
  if (!newClassName.trim()) return alert("Please enter a class name.");

  const newClass = {
    name: newClassName,
    students: 0,
    studentsList: [],
    schedule: newClassSchedule,
    lastLesson: newLastLesson,
    lastAssignment: newLastAssignment,
    nextTopic: newNextTopic,
    nextAssignment: newNextAssignment
  };

  setClasses([...classes, newClass]);

  // Clear inputs after adding
  setNewClassName("");
  setNewClassSchedule("");
  setNewLastLesson("");
  setNewLastAssignment("");
  setNewNextTopic("");
  setNewNextAssignment("");
};



  // --- TASKS ---
const [tasks, setTasks] = useState([
 { id: 1, title: "Grade Assignment 3 (Math 101)", due: "Today", status: "Pending", submissions: 35, graded: 5 }, // submission data
 { id: 2, title: "Prepare Lesson Notes", due: "Tomorrow", status: "In Progress", submissions: 0, graded: 0 },
 { id: 3, title: "Submit Exam Report", due: "Friday", status: "Completed", submissions: 0, graded: 0 },
]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("Pending");
  const [taskSearch, setTaskSearch] = useState("");

  const addTask = () => {
    if (!newTaskTitle || !newTaskDue) return;
    setTasks([
      ...tasks,
      { id: tasks.length + 1, title: newTaskTitle, due: newTaskDue, status: newTaskStatus },
    ]);
    setNewTaskTitle("");
    setNewTaskDue("");
    setNewTaskStatus("Pending");
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(taskSearch.toLowerCase())
  );

  // STUDENT DATA (Mock) 
const [students, setStudents] = useState([
  { id: 101, name: "Alice Johnson", averageGrade: 85, missingAssignments: 0 },
  { id: 102, name: "Bob Williams", averageGrade: 55, missingAssignments: 3 }, // Flag: Low Grade & Missing Work
  { id: 103, name: "Charlie Brown", averageGrade: 72, missingAssignments: 1 },
  { id: 104, name: "Diana Prince", averageGrade: 62, missingAssignments: 2 }, // Flag: Low Grade & Missing Work
]);

//  RESOURCES 
const [resources, setResources] = useState([]);
const [newResourceTitle, setNewResourceTitle] = useState("");
const [newResourceNotes, setNewResourceNotes] = useState("");
const [newResourcePDF, setNewResourcePDF] = useState(null);
const [newResourceVideo, setNewResourceVideo] = useState("");

const addResource = () => {
  if (!newResourceTitle) return;

  setResources([
    ...resources,
    {
      title: newResourceTitle,
      notes: newResourceNotes,
      pdf: newResourcePDF,
      video: newResourceVideo,
    },
  ]);

  setNewResourceTitle("");
  setNewResourceNotes("");
  setNewResourcePDF(null);
  setNewResourceVideo("");
};

// CLASSES WITH STUDENT GRADES
const [classes, setClasses] = useState([
  {
    name: "Mathematics 101",
    students: 5, // optional
    studentsList: [
      { name: "Alice", grades: [85, 90, 78] },
      { name: "Bob", grades: [70, 68, 75] },
      { name: "Charlie", grades: [88, 92, 85] },
      { name: "David", grades: [95, 89, 92] },
      { name: "Emma", grades: [80, 85, 88] }
    ],
    schedule: "Mon & Wed 8:00AM",
    lastLesson: "Linear Equations",
    lastAssignment: "Solve 10 exercises from page 32",
    nextTopic: "Quadratic Equations",
    nextAssignment: "Prepare practice problems"
  },
  {
    name: "Physics 201",
    students: 5,
    studentsList: [
      { name: "Fiona", grades: [88, 92, 85] },
      { name: "George", grades: [60, 70, 65] },
      { name: "Hannah", grades: [75, 80, 78] },
      { name: "Ian", grades: [85, 87, 90] },
      { name: "Jack", grades: [70, 72, 68] }
    ],
    schedule: "Tue & Thu 10:00AM",
    lastLesson: "Newton's Laws",
    lastAssignment: "Lab report on motion",
    nextTopic: "Work and Energy",
    nextAssignment: "Answer textbook questions"
  },
  {
    name: "Chemistry 301",
    students: 5,
    studentsList: [
      { name: "Karen", grades: [95, 90, 92] },
      { name: "Leo", grades: [80, 85, 78] },
      { name: "Mia", grades: [88, 87, 90] },
      { name: "Nina", grades: [75, 80, 70] },
      { name: "Oscar", grades: [85, 82, 88] }
    ],
    schedule: "Fri 9:00AM",
    lastLesson: "Periodic Table Trends",
    lastAssignment: "Element classification worksheet",
    nextTopic: "Chemical Bonding",
    nextAssignment: "Prepare bonding diagrams"
  },
  {
    name: "Biology 401",
    students: 5,
    studentsList: [
      { name: "George", grades: [75, 80, 70] },
      { name: "Hannah", grades: [85, 88, 90] },
      { name: "Isaac", grades: [90, 92, 88] },
      { name: "Julia", grades: [78, 82, 80] },
      { name: "Kevin", grades: [85, 87, 89] }
    ],
    schedule: "Mon & Thu 11:00AM",
    lastLesson: "Cell Structure",
    lastAssignment: "Microscope lab report",
    nextTopic: "Photosynthesis",
    nextAssignment: "Answer textbook questions"
  }
]);

// Compute average grade per class
const classAverages = classes.map((cls) => {
  const totalGrades = cls.studentsList.reduce((sum, student) => {
    const studentTotal = student.grades.reduce((a, b) => a + b, 0);
    return sum + studentTotal / student.grades.length; // average per student
  }, 0);
  const average = cls.studentsList.length ? totalGrades / cls.studentsList.length : 0;
  return {
    name: cls.name,
    average: parseFloat(average.toFixed(2)),
  };
});



// COMMUNITY 
const [communityGroups, setCommunityGroups] = useState([
  { id: 1, name: "Mathematics 101 Students", messages: [] },
  { id: 2, name: "Physics 201 Parents", messages: [] },
  { id: 3, name: "School Admin", messages: [] },
  { id: 4, name: "Drama Club", messages: [] },
]);

const [activeGroupId, setActiveGroupId] = useState(null);
const [groupMessage, setGroupMessage] = useState("");

// For attachments in community messages
const [groupFiles, setGroupFiles] = useState([]);
const [showGroupAttachmentOptions, setShowGroupAttachmentOptions] = useState(false);
const groupAttachmentRef = useRef(null);

const handleSendGroupMessage = () => {
  if ((!groupMessage.trim() && groupFiles.length === 0) || activeGroupId === null) return;

  setCommunityGroups(
    communityGroups.map(group =>
      group.id === activeGroupId
        ? { 
            ...group, 
            messages: [...group.messages, { from: "You", text: groupMessage, time: "Now", files: groupFiles }] 
          }
        : group
    )
  );
  setGroupMessage("");
  setGroupFiles([]);
  setShowGroupAttachmentOptions(false);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (groupAttachmentRef.current && !groupAttachmentRef.current.contains(event.target)) {
      setShowGroupAttachmentOptions(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);



 // MESSAGES 
const [messages, setMessages] = useState([
  { from: "Student: Alice", text: "Good morning sir!", time: "9:20 AM", files: [] },
  { from: "You", text: "Morning Alice, how can I help?", time: "9:22 AM", files: [] },
]);
const [newMessage, setNewMessage] = useState("");
const [messageSearch, setMessageSearch] = useState("");



// For multiple file attachments
const [files, setFiles] = useState([]);

// Attachment popup toggle
const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

// Send message handler
const handleSend = () => {
  if (!newMessage.trim() && files.length === 0) return; 
  setMessages([
    ...messages,
    {
      from: "You",
      text: newMessage,
      time: "Now",
      files: files,
    },
  ]);
  setNewMessage("");
  setFiles([]);
  setShowAttachmentOptions(false);
};

// Filtered messages for search
const filteredMessages = messages.filter(
  (msg) =>
    msg.from.toLowerCase().includes(messageSearch.toLowerCase()) ||
    msg.text.toLowerCase().includes(messageSearch.toLowerCase())
);

// Filter students for the needs attention section
const needsAttentionStudents = students.filter(
    (student) => student.averageGrade < 70 || student.missingAssignments >= 2
);

// Filter and sort tasks that require grading
const gradingQueue = tasks
    .filter((t) => t.submissions > t.graded)
    .sort((a, b) => (b.submissions - b.graded) - (a.submissions - a.graded));

  return (
    <>
    <div className="flex min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-6 flex flex-col">
        <h2 className="text-3xl font-bold mb-10">NeoStudy</h2>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "dashboard" ? "bg-indigo-500" : ""}`}
          >
            <Home size={18} /> Dashboard
          </button>
          <button
            onClick={() => setActiveSection("classes")}
            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "classes" ? "bg-indigo-500" : ""}`}
          >
            <BookOpen size={18} /> My Classes
          </button>
<button
  onClick={() => setActiveSection("attendance")}
  className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "attendance" ? "bg-indigo-500" : ""}`}><CalendarCheck size={18} /> Attendance</button>

          <button
            onClick={() => setActiveSection("tasks")}
            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "tasks" ? "bg-indigo-500" : ""}`}
          >
            <ClipboardList size={18} /> Tasks
          </button>
          <button
            onClick={() => setActiveSection("community")}
            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "community" ? "bg-indigo-500" : ""}`}
          >
            <Users size={18} /> Community
          </button>

          <button
  onClick={() => setActiveSection("resources")}
  className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${
    activeSection === "resources" ? "bg-indigo-500" : ""
  }`}
>
  <BookOpen size={18} /> Resources
</button>

          <button
            onClick={() => setActiveSection("messages")}
            className={`flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-indigo-500 transition ${activeSection === "messages" ? "bg-indigo-500" : ""}`}
          >
            <MessageCircle size={18} /> Messages
          </button>
        </nav>
        <div className="mt-auto">
          <p className="text-sm opacity-80">Logged in as</p>
          <p className="font-semibold">Mr. Daniel</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {/* Dashboard */}
        {activeSection === "dashboard" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
         {/* Calendar Section */}
<div className="bg-white shadow-md rounded-xl p-6 flex items-start justify-between gap-8">
  {/* Left Side: Academic Info */}
  <div className="flex flex-col justify-start items-start w-1/3">
    <h2 className="text-xl font-bold text-indigo-700 mb-1">
      Wk {weekNumber}- Term 1
    </h2>
    <p className="text-green-600 text-small mb-10">Academic Year: 2025</p>
    
    {/* Add Event */}
    <div className="w-full">
      <input
        type="text"
        placeholder="Add event or reminder..."
        value={newEvent}
        onChange={(e) => setNewEvent(e.target.value)}
        className="border border-gray-300 rounded-lg w-full p-2 mb-2 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <button
        onClick={handleAddEvent}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all w-full"
      >
        Add Event
      </button>
    </div>

    {/* Upcoming Events */}
    <div className="mt-4 bg-indigo-50 p-3 rounded-lg w-full max-h-40 overflow-y-auto">
      <h3 className="text-sm font-semibold text-indigo-600 mb-1">
        Upcoming Events
      </h3>
      {events.length === 0 ? (
        <p className="text-gray-500 text-sm">No events added yet.</p>
      ) : (
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          {events
            .filter(
              (event) =>
                new Date(event.date).toDateString() ===
                selectedDate.toDateString()
            )
            .map((event, index) => (
              <li key={index}>{event.title}</li>
            ))}
        </ul>
      )}
    </div>
  </div>

  {/* Right Side: Calendar */}
  <div className="flex-1">
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      className="rounded-lg border-none shadow-inner w-full"
      view="month"
    />
  </div>
</div>

   <div className="bg-white shadow-md rounded-xl p-6">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">Class Performance</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={classAverages} // make sure this is calculated dynamically
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="average" fill="#4f46e5" name="Average Grade" />
    </BarChart>
  </ResponsiveContainer>
</div>



      {/* Calendar (Existing) */}
      <div className="bg-white shadow-md rounded-xl p-6"></div>
       </div>
     

<div>
    
    {/* Adjust to a two-column grid for the actionable cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* GRADING QUEUE CARD (NEW) */}
      <div className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Grading Queue 📚
        </h2>
        <ul className="space-y-3 max-h-40 overflow-y-auto">
          {gradingQueue.slice(0, 3).map((task) => ( // Show top 3
            <li key={task.id} className="bg-blue-50 p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{task.title}</p>
                <p className="text-sm text-blue-700">
                  **{task.submissions - task.graded}** to grade (out of {task.submissions})
                </p>
              </div>
              <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
                Start Grading
              </button>
            </li>
          ))}
          {gradingQueue.length === 0 && (
            <li className="text-gray-500">Queue clear! Go you!</li>
          )}
        </ul>
      </div>
      
    </div>
    
   
  </div>

              {/* Timetable */}
              <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">My Timetable & Lesson Details</h2>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-2 text-gray-600">Class</th>
                      <th className="border-b p-2 text-gray-600">Students</th>
                      <th className="border-b p-2 text-gray-600">Schedule</th>
                      <th className="border-b p-2 text-gray-600">Last Lesson</th>
                      <th className="border-b p-2 text-gray-600">Last Assignment</th>
                      <th className="border-b p-2 text-gray-600">Next Topic</th>
                      <th className="border-b p-2 text-gray-600">Next Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((cls, i) => (
                      <tr key={i} className="hover:bg-gray-100 transition">
                        <td className="border-b p-2">{cls.name}</td>
                        <td className="border-b p-2">{cls.students}</td>
                        <td className="border-b p-2">{cls.schedule}</td>
                        <td className="border-b p-2">{cls.lastLesson}</td>
                        <td className="border-b p-2">{cls.lastAssignment}</td>
                        <td className="border-b p-2">{cls.nextTopic}</td>
                        <td className="border-b p-2">{cls.nextAssignment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assignments Completed */}
              <div className="bg-white shadow-md rounded-xl p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Assignments Completed</h2>
                <p className="text-3xl font-bold text-green-500">
                  {Math.round((tasks.filter((t) => t.status === "Completed").length / tasks.length) * 100)}%
                </p>
              </div>

              {/* Class Engagement */}
              <div className="bg-white shadow-md rounded-xl p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Class Engagement</h2>
                <p className="text-3xl font-bold text-yellow-500">90%</p>
              </div>
            </div>
        )}

        {/* Classes Section */}
        {activeSection === "classes" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">My Classes</h1>
            <div className="mb-6 flex gap-2 flex-wrap items-center">
              <input value={newClassName} onChange={(e) => setNewClassName(e.target.value)} placeholder="Class Name" className="p-2 border rounded" />
              <input value={newClassSchedule} onChange={(e) => setNewClassSchedule(e.target.value)} placeholder="Schedule" className="p-2 border rounded" />
              <input value={newLastLesson} onChange={(e) => setNewLastLesson(e.target.value)} placeholder="Last Lesson" className="p-2 border rounded" />
              <input value={newLastAssignment} onChange={(e) => setNewLastAssignment(e.target.value)} placeholder="Last Assignment" className="p-2 border rounded" />
              <input value={newNextTopic} onChange={(e) => setNewNextTopic(e.target.value)} placeholder="Next Topic" className="p-2 border rounded" />
              <input value={newNextAssignment} onChange={(e) => setNewNextAssignment(e.target.value)} placeholder="Next Assignment" className="p-2 border rounded" />
              <button onClick={addClass} className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-500">Add Class</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((cls, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{cls.name}</h2>
                  <p className="text-gray-600">Students Enrolled: {cls.students}</p>
                  <p className="text-gray-600">Schedule: {cls.schedule}</p>
                  <p className="text-gray-600">Last Lesson: {cls.lastLesson}</p>
                  <p className="text-gray-600">Last Assignment: {cls.lastAssignment}</p>
                  <p className="text-gray-600">Next Topic: {cls.nextTopic}</p>
                  <p className="text-gray-600">Next Assignment: {cls.nextAssignment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

  {activeSection === "attendance" && (
  <div>
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Attendance</h1>

    {classes.map((cls, i) => (
      <div key={i} className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">{cls.name}</h2>
        <p className="text-gray-600 mb-3">Schedule: {cls.schedule}</p>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Student</th>
              <th className="border-b p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {cls.studentsList.map((student, idx) => (
              <tr key={idx} className="hover:bg-gray-100 transition">
                <td className="border-b p-2">{student.name}</td>
                <td className="border-b p-2">
                  <select
                    className="p-1 border rounded"
                    value={cls.attendance?.[student.name] || "Present"}
                    onChange={(e) => {
                      const updatedClasses = [...classes];
                      if (!updatedClasses[i].attendance) updatedClasses[i].attendance = {};
                      updatedClasses[i].attendance[student.name] = e.target.value;
                      setClasses(updatedClasses);
                    }}
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}
   
  

        {/* Tasks Section */}
        {activeSection === "tasks" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Tasks</h1>
            <input value={taskSearch} onChange={(e) => setTaskSearch(e.target.value)} placeholder="Search tasks..." className="p-2 border rounded mb-4 w-full" />
            <div className="mb-6 flex gap-2 flex-wrap items-center">
              <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Task Title" className="p-2 border rounded" />
              <input value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} placeholder="Due Date" className="p-2 border rounded" />
              <select value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)} className="p-2 border rounded">
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <button onClick={addTask} className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-500">Add Task</button>
            </div>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600">Due: {task.due}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {task.status}
                    </span>
                    <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)} className="border p-1 rounded">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

  {/* Resources Section */}
{activeSection === "resources" && (
  <div>
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Educational Resources</h1>

    {/* Add new resource */}
    <div className="mb-6 flex flex-col gap-3">
      <input
        value={newResourceTitle}
        onChange={(e) => setNewResourceTitle(e.target.value)}
        placeholder="Resource Title"
        className="p-2 border rounded w-full"
      />

      <textarea
        value={newResourceNotes}
        onChange={(e) => setNewResourceNotes(e.target.value)}
        placeholder="Write notes..."
        className="p-2 border rounded w-full"
        rows={4}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setNewResourcePDF(e.target.files[0])}
        className="p-2 border rounded"
      />

      <input
        value={newResourceVideo}
        onChange={(e) => setNewResourceVideo(e.target.value)}
        placeholder="Video URL (YouTube, Vimeo, etc.)"
        className="p-2 border rounded w-full"
      />

      <button
        onClick={addResource}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 w-32"
      >
        Add Resource
      </button>
    </div>

    {/* Display resources */};
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((res, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{res.title}</h2>
          {res.notes && <p className="text-gray-600 mb-2">{res.notes}</p>}
          {res.pdf && (
            <p className="text-blue-600 mb-2">
              <a href={URL.createObjectURL(res.pdf)} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </p>
          )}
          {res.video && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={res.video}
                title="Educational Video"
                className="w-full h-64"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{activeSection === "community" && (
  <div className="flex gap-6 h-[70vh]"> {/* Outer wrapper with fixed height */}
    
    {/* Groups List */}
    <div className="w-64 bg-white shadow rounded p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Groups</h2>
      {communityGroups.map(group => (
        <button
          key={group.id}
          onClick={() => setActiveGroupId(group.id)}
          className={`w-full text-left p-2 mb-2 rounded hover:bg-indigo-100 transition ${activeGroupId === group.id ? "bg-indigo-200" : ""}`}
        >
          {group.name}
        </button>
      ))}
    </div>

    {/* Chat Window */}
    <div className="flex-1 flex flex-col bg-gray-50 rounded">
      {activeGroupId ? (
        <>
          {/* Chat header */}
          <div className="bg-white p-3 rounded-t-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800">
              {communityGroups.find(g => g.id === activeGroupId).name}
            </h2>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-2">
            {communityGroups.find(g => g.id === activeGroupId).messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded max-w-xs mb-2 ${
                  msg.from === "You" ? "bg-indigo-600 text-white self-end" : "bg-white text-gray-800 self-start"
                }`}
              >
                <p className="text-sm opacity-70 mb-1">{msg.from} • {msg.time}</p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="bg-white p-2 rounded-b-lg shadow flex gap-2 items-center">
            <input
              type="text"
              value={groupMessage}
              onChange={(e) => setGroupMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onKeyDown={(e) => e.key === "Enter" && handleSendGroupMessage()}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
              onClick={handleSendGroupMessage}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 p-4">Select a group to start chatting</p>
      )}
    </div>
  </div>
)}




{/* Messages Section */}
{activeSection === "messages" && (
  <div className="flex flex-col h-[70vh]">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Messages</h1>

    {/* Search bar */}
    <input
      value={messageSearch}
      onChange={(e) => setMessageSearch(e.target.value)}
      placeholder="Search messages..."
      className="p-2 border rounded mb-4 w-full"
    />

    {/* Chat box */}
    <div
      className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-xl shadow-inner space-y-4"
      id="chatBox"
    >
      {filteredMessages.map((msg, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 ${
            msg.from.startsWith("You") ? "justify-end" : "justify-start"
          }`}
        >
          {!msg.from.startsWith("You") && (
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold">
              {msg.from.charAt(0)}
            </div>
          )}

          <div
            className={`max-w-xs p-3 rounded-xl shadow ${
              msg.from.startsWith("You")
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
            }`}
          >
            <p className="text-sm opacity-70 mb-1">{msg.from} • {msg.time}</p>
            <p className="break-words">{msg.text}</p>

            {/* Display attached files */}
            {msg.files &&
              msg.files.map((f, idx) => (
                <div key={idx} className="mt-2">
                  {f.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  )}
                  {f.type === "application/pdf" && (
                    <a
                      href={URL.createObjectURL(f)}
                      download={f.name}
                      className="text-indigo-600 underline"
                    >
                      {f.name}
                    </a>
                  )}
                  {f.type.startsWith("video/") && (
                    <video className="w-48 rounded" controls>
                      <source src={URL.createObjectURL(f)} type={f.type} />
                    </video>
                  )}
                  {!f.type.startsWith("image/") &&
                    !f.type.startsWith("video/") &&
                    f.type !== "application/pdf" && (
                      <a
                        href={URL.createObjectURL(f)}
                        download={f.name}
                        className="text-gray-700 underline"
                      >
                        {f.name}
                      </a>
                    )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>

    {/* Selected files preview */}
    {files.length > 0 && (
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {files.map((f, idx) => (
          <div key={idx} className="relative">
            {f.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-700 p-1">
                {f.name}
              </div>
            )}
            <button
              className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => setFiles(files.filter((_, i) => i !== idx))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Input area */}
    <div className="mt-4 flex gap-2 items-center relative">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* Attachment button */}
      <button
        className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
      >
        📎
      </button>

      {/* Attachment options popup */}
      {showAttachmentOptions && (
        <div className="absolute bottom-12 right-12 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-2 z-50">
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => document.getElementById("imageVideoInput").click()}
          >
            Photo/Video
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => document.getElementById("docInput").click()}
          >
            Document
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => document.getElementById("otherInput").click()}
          >
            Other
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        id="imageVideoInput"
        accept="image/*,video/*"
        className="hidden"
        multiple
        onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
      />
      <input
        type="file"
        id="docInput"
        accept=".pdf,.doc,.docx"
        className="hidden"
        multiple
        onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
      />
      <input
        type="file"
        id="otherInput"
        className="hidden"
        multiple
        onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
      >
        Send
      </button>
    </div>
  </div>
)}



      </div>
    </div>

            
                        
      <Footer />
        </>
    );
};     

export default Teacherdash;
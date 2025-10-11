import React, { useState, useEffect } from 'react';
import { 
    Bell, Bus, BookOpen, Users, Home, Calendar, 
    Award, TrendingUp, Clock, Menu, X, LogOut, Settings, 
    DollarSign, AlertTriangle, Crown, FileText, AlertCircle,
    Download, Eye, CheckCircle, XCircle, Activity, MessageSquare,
    Phone, Mail, Video, User, MapPin, Navigation, CreditCard,
    Receipt, Shield, HelpCircle, Bookmark
} from 'lucide-react';
import Footer from './Footer';
import { auth } from '../firebase'; // Add Firebase auth import
import { useNavigate } from 'react-router-dom'; // Add navigation

const THEME_COLORS = {
  DEEP_FOREST: "#04736f",
  BOTANIC_TEAL: "#00918C",
  BRIGHT_TEAL: "#00ABA7",
  LIGHT_TEXT: "#B8DBD9",
  SIDEBAR_HOVER: "#006B68",
};

const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const Header = ({ parentData, activeTabLabel, notifications }) => (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                    <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                        style={{ 
                            background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                        }}
                    >
                        {parentData.avatar}
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{activeTabLabel}</h1>
                    <p className="text-sm text-gray-500">Welcome back, {parentData.name.split(' ')[0]}! 👋</p>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium text-gray-700">{getCurrentDate()}</p>
                </div>
            </div>
        </div>
    </header>
);

const DashboardView = ({ parentData, studentData, setActiveTab }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getTransportAlert = () => {
        const now = new Date();
        const pickupTime = new Date();
        pickupTime.setHours(7, 15, 0);
        const dropoffTime = new Date();
        dropoffTime.setHours(15, 30, 0);

        const minutesToPickup = Math.floor((pickupTime - now) / 60000);
        const minutesToDropoff = Math.floor((dropoffTime - now) / 60000);

        if (minutesToPickup > 0 && minutesToPickup <= 15) {
            return { type: 'pickup', minutes: minutesToPickup, show: true };
        } else if (minutesToDropoff > 0 && minutesToDropoff <= 15) {
            return { type: 'dropoff', minutes: minutesToDropoff, show: true };
        }
        return { show: false };
    };

    const transportAlert = getTransportAlert();

    return (
        <div className="space-y-6">
            <div 
                className="rounded-2xl p-6 text-white shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                }}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Hello, {parentData.name.split(' ')[0]}! 👨‍👩‍👧</h2>
                        <p className="text-blue-100">Stay connected with your child's education journey</p>
                    </div>
                </div>
            </div>

            {transportAlert.show && (
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl p-4 shadow-lg animate-pulse">
                    <div className="flex items-start">
                        <Bus className="mr-3 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold">🚨 Transport Alert</h3>
                            <p className="text-sm opacity-90 mt-1">
                                Bus {transportAlert.type} in {transportAlert.minutes} minutes! 
                                {transportAlert.type === 'pickup' ? ' Please ensure your child is ready.' : ' Your child will be home soon.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {studentData.attendanceRate < 85 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-start">
                        <AlertTriangle className="mr-3 mt-1 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="font-semibold">Attendance Notice</h3>
                            <p className="text-sm opacity-90 mt-1">
                                {studentData.name}'s attendance is at {studentData.attendanceRate}%. Please ensure regular school attendance.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                    onClick={() => setActiveTab('attendance')}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-1">Attendance</p>
                            <p className="text-3xl font-bold text-blue-800">{studentData.attendanceRate}%</p>
                            <p className="text-xs text-gray-500 mt-1">This month</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveTab('performance')}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-1">Avg Grade</p>
                            <p className="text-3xl font-bold text-green-800">{studentData.overallAverage}%</p>
                            <p className="text-xs text-gray-500 mt-1">Current term</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveTab('fees')}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-1">Fee Balance</p>
                            <p className="text-3xl font-bold text-purple-800">KES {parentData.feeBalance.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Due by Nov 15</p>
                        </div>
                    </div>
                </div>

                <div 
                    onClick={() => setActiveTab('transport')}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:scale-105"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-1">Transport</p>
                            <p className="text-xl font-bold text-orange-800">On Route</p>
                            <p className="text-xs text-gray-500 mt-1">ETA: 15:35</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold flex items-center">
                            Academic Performance Trend
                        </h3>
                        <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-700">
                            Improving
                        </span>
                    </div>
                    <div className="space-y-4">
                        {studentData.subjects.slice(0, 4).map((subject, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full ${
                                        subject.trend === 'up' ? 'bg-green-500' : 
                                        subject.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-800">{subject.name}</p>
                                        <p className="text-sm text-gray-600">Last test: {subject.lastTest}%</p>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-800">{subject.currentGrade}%</div>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="w-full mt-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 text-white"
                        style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                        onClick={() => setActiveTab('performance')}
                    >
                        View Detailed Report
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <Activity className="mr-2" size={20} />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            { icon: CheckCircle, text: 'Attended Mathematics class', time: '2 hours ago', color: 'green' },
                            { icon: FileText, text: 'Submitted Physics assignment', time: '5 hours ago', color: 'blue' },
                            { icon: Bus, text: 'Boarded school bus', time: 'Today, 7:20 AM', color: 'orange' },
                            { icon: Award, text: 'Scored 85% in English test', time: 'Yesterday', color: 'purple' }
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                                <div className={`p-2 rounded-lg ${
                                    activity.color === 'green' ? 'bg-green-100' :
                                    activity.color === 'blue' ? 'bg-blue-100' :
                                    activity.color === 'orange' ? 'bg-orange-100' : 'bg-purple-100'
                                }`}>
                                    <activity.icon size={16} className={
                                        activity.color === 'green' ? 'text-green-600' :
                                        activity.color === 'blue' ? 'text-blue-600' :
                                        activity.color === 'orange' ? 'text-orange-600' : 'text-purple-600'
                                    } />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
                        <p className="text-sm text-gray-600">Common tasks at your fingertips</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <button 
                        onClick={() => setActiveTab('fees')}
                        className="p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
                    >
                        <CreditCard className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <p className="text-sm font-medium text-gray-700">Pay Fees</p>
                    </button>
                    <button 
                        onClick={() => setActiveTab('communication')}
                        className="p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
                    >
                        <MessageSquare className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <p className="text-sm font-medium text-gray-700">Message Teacher</p>
                    </button>
                    <button 
                        onClick={() => setActiveTab('performance')}
                        className="p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
                    >
                        <Download className="text-green-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <p className="text-sm font-medium text-gray-700">Download Report</p>
                    </button>
                    <button className="p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group">
                        <Video className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                        <p className="text-sm font-medium text-gray-700">Book Meeting</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

const AttendanceView = ({ studentData }) => (
    <div className="space-y-6">
        <div 
            className="rounded-2xl p-6 text-white shadow-lg"
            style={{
                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
            }}
        >
            <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Calendar className="mr-3" size={28} /> 
                Attendance Monitoring
            </h3>
            <p className="text-blue-100">Real-time attendance tracking and history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">This Month</h4>
                    <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-4xl font-bold text-gray-900">{studentData.attendanceRate}%</p>
                <p className="text-sm text-gray-600 mt-2">18 out of 20 days</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Absences</h4>
                    <XCircle className="text-red-500" size={24} />
                </div>
                <p className="text-4xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600 mt-2">Both excused</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Late Arrivals</h4>
                    <Clock className="text-orange-500" size={24} />
                </div>
                <p className="text-4xl font-bold text-gray-900">1</p>
                <p className="text-sm text-gray-600 mt-2">This month</p>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-6">Attendance History (Last 10 Days)</h3>
            <div className="space-y-3">
                {[
                    { date: 'Mon, Oct 7', status: 'present', time: '07:15 AM' },
                    { date: 'Tue, Oct 6', status: 'present', time: '07:18 AM' },
                    { date: 'Wed, Oct 5', status: 'present', time: '07:12 AM' },
                    { date: 'Thu, Oct 4', status: 'late', time: '07:35 AM' },
                    { date: 'Fri, Oct 3', status: 'present', time: '07:20 AM' },
                    { date: 'Mon, Sep 30', status: 'absent', time: 'Sick leave' },
                    { date: 'Tue, Sep 29', status: 'present', time: '07:16 AM' },
                    { date: 'Wed, Sep 28', status: 'present', time: '07:14 AM' }
                ].map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                record.status === 'present' ? 'bg-green-100' :
                                record.status === 'late' ? 'bg-orange-100' : 'bg-red-100'
                            }`}>
                                {record.status === 'present' ? <CheckCircle className="text-green-600" size={20} /> :
                                 record.status === 'late' ? <Clock className="text-orange-600" size={20} /> :
                                 <XCircle className="text-red-600" size={20} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{record.date}</p>
                                <p className="text-sm text-gray-600">{record.time}</p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            record.status === 'present' ? 'bg-green-100 text-green-700' :
                            record.status === 'late' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PerformanceView = ({ studentData }) => (
    <div className="space-y-6">
        <div 
            className="rounded-2xl p-6 text-white shadow-lg"
            style={{
                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
            }}
        >
            <h3 className="text-2xl font-bold mb-2 flex items-center">
                <Award className="mr-3" size={28} /> 
                Academic Performance
            </h3>
            <p className="text-blue-100">Overall Average: <span className="font-bold text-lg">{studentData.overallAverage}%</span></p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Subject Performance</h3>
                <button 
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
                    style={{ color: THEME_COLORS.BOTANIC_TEAL }}
                >
                    <Download size={16} />
                    <span>Download Report</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-xl">Subject</th>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Current Grade</th>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Last Test</th>
                            <th className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-xl">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentData.subjects.map((subject, idx) => (
                            <tr key={idx} className={subject.currentGrade < 70 ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{subject.currentGrade}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.lastTest}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        subject.trend === 'up' ? 'bg-green-100 text-green-700' :
                                        subject.trend === 'down' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {subject.trend === 'up' ? '↑ Improving' : subject.trend === 'down' ? '↓ Declining' : '→ Stable'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Areas of Strength</h4>
                <div className="space-y-3">
                    {studentData.subjects.filter(s => s.currentGrade >= 80).map((subject, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                            <Award className="text-green-600" size={20} />
                            <div>
                                <p className="font-medium text-gray-800">{subject.name}</p>
                                <p className="text-sm text-gray-600">Excellent performance ({subject.currentGrade}%)</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-800 mb-4">Needs Attention</h4>
                <div className="space-y-3">
                    {studentData.subjects.filter(s => s.currentGrade < 70).map((subject, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
                            <AlertCircle className="text-red-600" size={20} />
                            <div>
                                <p className="font-medium text-gray-800">{subject.name}</p>
                                <p className="text-sm text-gray-600">Needs improvement ({subject.currentGrade}%)</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const FeesView = ({ parentData }) => {
    const [selectedSection, setSelectedSection] = useState(null);
    const totalTermFees = 45000;
    const amountPaid = totalTermFees - parentData.feeBalance;
    const paymentProgress = (amountPaid / totalTermFees) * 100;

    return (
        <div className="space-y-6">
            <div 
                className="rounded-2xl p-6 text-white shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                }}
            >
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <CreditCard className="mr-3" size={28} /> 
                    Fees & Payments
                </h3>
                <p className="text-blue-100">Complete transparency on school fees and payment tracking</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Term 3, 2024</p>
                        <h3 className="text-2xl font-bold text-gray-800">Fee Overview</h3>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-xl">
                        <Bookmark className="text-indigo-600" size={24} />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 font-medium mb-1">Total Fees</p>
                        <p className="text-2xl font-bold text-gray-800">KES {totalTermFees.toLocaleString()}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-xs text-emerald-600 font-medium mb-1">Amount Paid</p>
                        <p className="text-2xl font-bold text-emerald-700">KES {amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                        <p className="text-xs text-orange-600 font-medium mb-1">Balance Due</p>
                        <p className="text-2xl font-bold text-orange-700">KES {parentData.feeBalance.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">Payment Progress</span>
                        <span className="font-bold text-gray-800">{Math.round(paymentProgress)}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${paymentProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">Due by November 15, 2024 • 37 days remaining</p>
                </div>
            </div>

            {!selectedSection ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => setSelectedSection('allocation')}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left group"
                    >
                        <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                            style={{
                                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                            }}
                        >
                            <Receipt className="text-white" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Funds Allocation</h3>
                        <p className="text-sm text-gray-600 mb-4">See exactly where your money goes</p>
                        <div className="flex items-center font-medium text-sm" style={{ color: THEME_COLORS.BOTANIC_TEAL }}>
                            <span>View Breakdown</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedSection('history')}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left group"
                    >
                        <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                            style={{
                                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                            }}
                        >
                            <FileText className="text-white" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment History</h3>
                        <p className="text-sm text-gray-600 mb-4">Your complete payment record</p>
                        <div className="flex items-center font-medium text-sm" style={{ color: THEME_COLORS.BOTANIC_TEAL }}>
                            <span>View History</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedSection('payment')}
                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left group"
                    >
                        <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                            style={{
                                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                            }}
                        >
                            <CreditCard className="text-white" size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Make Payment</h3>
                        <p className="text-sm text-gray-600 mb-4">Quick and secure payment options</p>
                        <div className="flex items-center font-medium text-sm bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex" style={{ color: THEME_COLORS.BOTANIC_TEAL }}>
                            <span>Pay Now</span>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <button
                        onClick={() => setSelectedSection(null)}
                        className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        <X className="mr-2" size={20} />
                        Back to Overview
                    </button>

                    {selectedSection === 'allocation' && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <Receipt className="mr-3" size={28} style={{ color: THEME_COLORS.BOTANIC_TEAL }} />
                                        Funds Allocation Breakdown
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Transparency in every payment</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="group hover:scale-[1.01] transition-transform">
                                    <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <div className="flex items-center space-x-4">
                                            <div 
                                                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                                                style={{
                                                    background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                                                }}
                                            >
                                                <BookOpen className="text-white" size={22} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">Tuition Fees</p>
                                                <p className="text-xs text-gray-600">Academic instruction & learning materials</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-lg" style={{ color: THEME_COLORS.DEEP_FOREST }}>KES 35,000</span>
                                            <p className="text-xs text-gray-500">77.8%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-xl p-5 border-l-4 border-amber-400">
                    <div className="flex items-start space-x-3">
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                            }}
                        >
                            <AlertTriangle className="text-white" size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 mb-1">Payment Reminder</h4>
                            <p className="text-sm text-gray-700 mb-2">Balance of KES {parentData.feeBalance.toLocaleString()} due by November 15, 2024</p>
                            <button className="text-xs font-semibold underline" style={{ color: THEME_COLORS.BOTANIC_TEAL }}>
                                Set up reminder
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-5 border-l-4 border-indigo-400">
                    <div className="flex items-start space-x-3">
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                            }}
                        >
                            <DollarSign className="text-white" size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 mb-1">Installment Plan</h4>
                            <p className="text-sm text-gray-700 mb-2">Pay in flexible installments with no extra charges</p>
                            <button className="text-xs font-semibold underline" style={{ color: THEME_COLORS.BOTANIC_TEAL }}>
                                Learn more
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TransportView = ({ transportData }) => {
    const [liveTracking, setLiveTracking] = useState(true);

    return (
        <div className="space-y-6">
            <div 
                className="rounded-2xl p-6 text-white shadow-lg"
                style={{
                    background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                }}
            >
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                    <Bus className="mr-3" size={28} /> 
                    Live Transport Tracking
                </h3>
                <p className="text-blue-100">Real-time bus location and alerts</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Current Status</h3>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${liveTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} rounded-full`}></div>
                        <span className="text-sm font-medium text-green-600">{liveTracking ? 'Live' : 'Tracking Paused'}</span>
                    </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl mb-6 border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Current Status</p>
                            <p className="text-3xl font-bold text-green-800 mb-2">{transportData.currentStatus}</p>
                            <p className="text-sm text-green-600 flex items-center">
                                <Navigation size={16} className="mr-2" />
                                Next Stop: {transportData.nextStop}
                            </p>
                        </div>
                        <Bus className="text-green-600" size={56} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Bus Information</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Bus size={16} className="mr-3 text-orange-500" />
                                <span>Bus No: <strong>{transportData.busNo}</strong></span>
                            </div>
                            <div className="flex items-center">
                                <User size={16} className="mr-3 text-blue-500" />
                                <span>Driver: <strong>{transportData.driver}</strong></span>
                            </div>
                            <div className="flex items-center">
                                <Clock size={16} className="mr-3 text-purple-500" />
                                <span>Estimated Time: <strong>{transportData.eta}</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Live Location</h4>
                        <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-600 border border-gray-300">
                            <MapPin size={20} className="mr-2" />
                            Map View Disabled (Placeholder)
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Bus is currently near School Gate 3.</p>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Receive Push Notifications for Bus Alerts</p>
                    <button
                        onClick={() => setLiveTracking(!liveTracking)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            liveTracking ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                liveTracking ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

const CommunicationView = () => (
    <div className="space-y-6">
        <div 
            className="rounded-2xl p-6 text-white shadow-lg"
            style={{
                background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
            }}
        >
            <h3 className="text-2xl font-bold mb-2 flex items-center">
                <MessageSquare className="mr-3" size={28} /> 
                School Communication
            </h3>
            <p className="text-blue-100">Connect with teachers and school administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                            background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                        }}
                    >
                        <MessageSquare className="text-white" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Class Teacher</h4>
                    <p className="text-sm text-gray-600 mb-4">Mrs. Sarah Johnson</p>
                    <button 
                        className="w-full py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                    >
                        Send Message
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                            background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                        }}
                    >
                        <Phone className="text-white" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">School Office</h4>
                    <p className="text-sm text-gray-600 mb-4">+254 700 123 456</p>
                    <button 
                        className="w-full py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                    >
                        Call Now
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{
                            background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                        }}
                    >
                        <Mail className="text-white" size={32} />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                    <p className="text-sm text-gray-600 mb-4">info@school.edu</p>
                    <button 
                        className="w-full py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                    >
                        Send Email
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-6">Recent Announcements</h3>
            <div className="space-y-4">
                {[
                    { title: 'Parent-Teacher Meeting', date: 'Oct 15, 2024', type: 'meeting' },
                    { title: 'Sports Day Event', date: 'Oct 20, 2024', type: 'event' },
                    { title: 'Term 3 Exams Schedule', date: 'Oct 25, 2024', type: 'academic' }
                ].map((announcement, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                            <div 
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.DEEP_FOREST})`
                                }}
                            >
                                <MessageSquare className="text-white" size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{announcement.title}</p>
                                <p className="text-sm text-gray-600">{announcement.date}</p>
                            </div>
                        </div>
                        <button 
                            className="px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm"
                            style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Sidebar = ({ activeTab, setActiveTab, setIsSidebarOpen, handleLogout, parentData }) => (
    <div
        className="text-white transition-all duration-300 flex flex-col relative z-40 h-full"
        style={{
            backgroundColor: "var(--color-deep-forest)",
            background: `linear-gradient(180deg, ${THEME_COLORS.DEEP_FOREST} 0%, ${THEME_COLORS.SIDEBAR_HOVER} 100%)`,
        }}
    >
        {/* Logo/Brand */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Crown size={18} className="text-yellow-300" />
                </div>
                <h2 className="text-xl font-bold">Parent Portal</h2>
            </div>
            <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
                <X size={20} />
            </button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
            <div className="flex items-center">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
                    style={{
                        background: `linear-gradient(135deg, ${THEME_COLORS.BOTANIC_TEAL}, ${THEME_COLORS.BRIGHT_TEAL})`,
                    }}
                >
                    {parentData.avatar}
                </div>
                <div className="ml-4">
                    <p className="font-semibold">{parentData.name}</p>
                    <p className="text-sm opacity-80">Parent Account</p>
                </div>
            </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
            <ul className="space-y-2">
                {[
                    { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
                    { id: 'attendance', label: 'Attendance', icon: Calendar },
                    { id: 'performance', label: 'Performance', icon: Award },
                    { id: 'fees', label: 'Fees & Payments', icon: CreditCard },
                    { id: 'transport', label: 'Transport Live', icon: Bus },
                    { id: 'communication', label: 'Communication', icon: MessageSquare },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 ${
                                    isActive ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                                }`}
                            >
                                <Icon
                                    size={20}
                                    className={isActive ? 'text-white' : 'text-white/80'}
                                />
                                <span className="ml-4 font-medium">{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-white/10 space-y-2">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center p-4 rounded-xl hover:bg-red-500/20 transition-colors text-white/80 hover:text-white"
            >
                <LogOut size={20} />
                <span className="ml-4">Log Out</span>
            </button>
        </div>
    </div>
);

const ParentDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Get current user from Firebase auth
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Mock data - in a real app, this would come from your database
    const getUserData = (email) => {
        const users = {
            'joyce@example.com': {
                name: "Joyce Kamau",
                avatar: "JK",
                feeBalance: 15000,
                notifications: 4,
            },
            'john@example.com': {
                name: "John Mwangi",
                avatar: "JM",
                feeBalance: 8000,
                notifications: 2,
            },
            'mary@example.com': {
                name: "Mary Wanjiku",
                avatar: "MW",
                feeBalance: 20000,
                notifications: 1,
            }
        };
        
        return users[email] || {
            name: email.split('@')[0],
            avatar: email.split('@')[0].substring(0, 2).toUpperCase(),
            feeBalance: 12000,
            notifications: 0,
        };
    };

    const MOCK_PARENT_DATA = currentUser ? getUserData(currentUser.email) : {
        name: "Joyce Kamau",
        avatar: "JK",
        feeBalance: 15000,
        notifications: 4,
    };

    const MOCK_STUDENT_DATA = {
        name: "Mark Kamau",
        overallAverage: 82,
        attendanceRate: 90,
        subjects: [
            { name: 'Mathematics', currentGrade: 88, lastTest: 85, trend: 'up' },
            { name: 'English', currentGrade: 72, lastTest: 75, trend: 'down' },
            { name: 'Physics', currentGrade: 65, lastTest: 60, trend: 'up' },
            { name: 'History', currentGrade: 91, lastTest: 90, trend: 'up' },
            { name: 'Chemistry', currentGrade: 78, lastTest: 78, trend: 'stable' },
        ],
    };

    const MOCK_TRANSPORT_DATA = {
        currentStatus: "En Route Home",
        busNo: "BUS T5",
        driver: "Mr. Alex M.",
        nextStop: "Your Home Stop",
        eta: "5 minutes",
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const activeTabLabel = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'performance', label: 'Performance' },
        { id: 'fees', label: 'Fees & Payments' },
        { id: 'transport', label: 'Transport Live' },
        { id: 'communication', label: 'Communication' },
    ].find(item => item.id === activeTab)?.label || 'Dashboard';

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView parentData={MOCK_PARENT_DATA} studentData={MOCK_STUDENT_DATA} setActiveTab={setActiveTab} />;
            case 'attendance':
                return <AttendanceView studentData={MOCK_STUDENT_DATA} />;
            case 'performance':
                return <PerformanceView studentData={MOCK_STUDENT_DATA} />;
            case 'fees':
                return <FeesView parentData={MOCK_PARENT_DATA} />;
            case 'transport':
                return <TransportView transportData={MOCK_TRANSPORT_DATA} />;
            case 'communication':
                return <CommunicationView />;
            default:
                return <DashboardView parentData={MOCK_PARENT_DATA} studentData={MOCK_STUDENT_DATA} setActiveTab={setActiveTab} />;
        }
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
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
                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-80 transition-all duration-300">
                    <Sidebar 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        setIsSidebarOpen={setIsSidebarOpen}
                        handleLogout={handleLogout}
                        parentData={MOCK_PARENT_DATA}
                    />
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Mobile Sidebar */}
                <div 
                    className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden 
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
                    }
                >
                    <div className="w-80 h-full">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            setIsSidebarOpen={setIsSidebarOpen}
                            handleLogout={handleLogout}
                            parentData={MOCK_PARENT_DATA}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="fixed top-4 left-4 p-2 z-30 rounded-xl shadow-md lg:hidden"
                        style={{ backgroundColor: THEME_COLORS.BOTANIC_TEAL }}
                    >
                        <Menu size={24} className="text-white" />
                    </button>

                    <Header 
                        parentData={MOCK_PARENT_DATA} 
                        activeTabLabel={activeTabLabel} 
                        notifications={MOCK_PARENT_DATA.notifications} 
                    />
                    <main className="flex-1 overflow-y-auto p-6">
                        {renderContent()}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ParentDashboard;
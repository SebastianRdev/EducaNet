import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await api.getCourses();
                setCourses(data);
            } catch (err) {
                setError('Failed to load courses.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCreateCourse = () => {
        navigate('/course-editor/new');
    };

    const handleEditCourse = (courseId) => {
        navigate(`/course-editor/${courseId}`);
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.deleteCourse(courseId);
                setCourses(courses.filter(c => c.id !== courseId));
            } catch (err) {
                alert('Failed to delete course');
            }
        }
    };

    return (
        <div className="bg-background-light dark:bg-[#0f0d1e] text-slate-900 dark:text-white font-display antialiased min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-[#262348] bg-white/95 dark:bg-[#0f0d1e]/95 backdrop-blur px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <h2 className="text-lg font-bold">EducaNet</h2>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-slate-600 dark:text-[#9692c9]"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </header>

                {/* Main Content */}
                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col gap-8">
                        {/* Page Heading */}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                            <p className="text-slate-500 dark:text-[#9692c9] text-sm">Welcome back! Here's an overview of your platform.</p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-slate-200 dark:border-[#262348] bg-white dark:bg-[#1a1735] p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined text-[28px]">school</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-[#9692c9]">Total Courses</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 dark:border-[#262348] bg-white dark:bg-[#1a1735] p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                                        <span className="material-symbols-outlined text-[28px]">auto_stories</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-[#9692c9]">Total Lessons</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {courses.reduce((acc, curr) => acc + (curr.lessonsCount || 0), 0)}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

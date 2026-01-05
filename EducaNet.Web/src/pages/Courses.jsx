import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await api.getCourses(1, statusFilter, searchTerm);
                setCourses(data);
            } catch (err) {
                setError('Failed to load courses.');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchCourses();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, statusFilter]);

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

    const handlePublishCourse = async (courseId) => {
        try {
            await api.publishCourse(courseId);
            setCourses(courses.map(c => c.id === courseId ? { ...c, status: 'Published' } : c));
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.Message || 'Failed to publish course.';
            alert(message);
        }
    };

    const handleUnpublishCourse = async (courseId) => {
        try {
            await api.unpublishCourse(courseId);
            setCourses(courses.map(c => c.id === courseId ? { ...c, status: 'Draft' } : c));
        } catch (err) {
            alert('Failed to unpublish course');
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
                        {/* Page Heading & Actions */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Courses</h1>
                                <p className="text-slate-500 dark:text-[#9692c9] text-sm">Manage your curriculum, track status, and organize content.</p>
                            </div>
                            <button
                                onClick={handleCreateCourse}
                                className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-white shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all active:scale-95 font-bold text-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>Create New Course</span>
                            </button>
                        </div>

                        {/* Filters & Toolbar */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white dark:bg-[#1a1735] p-4 rounded-2xl border border-slate-200 dark:border-[#262348] shadow-sm">
                            {/* Search */}
                            <div className="w-full lg:max-w-[400px]">
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9692c9] pointer-events-none">
                                        <span className="material-symbols-outlined">search</span>
                                    </span>
                                    <input
                                        className="w-full h-11 rounded-xl border-slate-200 dark:border-[#262348] bg-slate-50 dark:bg-[#0f0d1e] pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                        placeholder="Search courses..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* Filters */}
                            <div className="flex gap-3 w-full lg:w-auto">
                                <div className="relative flex-1 lg:min-w-[160px]">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full h-11 appearance-none rounded-xl border-slate-200 dark:border-[#262348] bg-slate-50 dark:bg-[#0f0d1e] px-4 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                                    >
                                        <option value="">All Status</option>
                                        <option value="Published">Published</option>
                                        <option value="Draft">Draft</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#9692c9] pointer-events-none">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#262348] bg-white dark:bg-[#1a1735] shadow-sm">
                            {loading ? (
                                <div className="p-12 text-center text-slate-500">
                                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                                    <p>Loading courses...</p>
                                </div>
                            ) : error ? (
                                <div className="p-12 text-center text-red-500">{error}</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-[#262348] bg-slate-50/50 dark:bg-[#121022]/50">
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9692c9]">Course</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9692c9]">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9692c9]">Created</th>
                                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#9692c9] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-[#262348]">
                                            {courses.map(course => (
                                                <tr key={course.id} className="group hover:bg-slate-50 dark:hover:bg-[#1a1735] transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                                {course.title.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-slate-900 dark:text-white truncate">{course.title}</p>
                                                                <p className="text-xs text-slate-500 dark:text-[#9692c9] mt-0.5 truncate">
                                                                    {course.lessonsCount || 0} Lessons
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${course.status === 'Published'
                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                                                            }`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${course.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                            {course.status || 'Draft'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-slate-600 dark:text-[#9692c9]">
                                                            {new Date(course.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {course.status === 'Published' ? (
                                                                <button
                                                                    onClick={() => handleUnpublishCourse(course.id)}
                                                                    className="h-9 px-3 rounded-lg flex items-center justify-center gap-2 text-amber-600 hover:bg-amber-500/10 transition-all text-xs font-bold border border-amber-200 dark:border-amber-500/20"
                                                                    title="Unpublish"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                                                                    <span className="hidden sm:inline">Unpublish</span>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handlePublishCourse(course.id)}
                                                                    className="h-9 px-3 rounded-lg flex items-center justify-center gap-2 text-emerald-600 hover:bg-emerald-500/10 transition-all text-xs font-bold border border-emerald-200 dark:border-emerald-500/20"
                                                                    title="Publish"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">publish</span>
                                                                    <span className="hidden sm:inline">Publish</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleEditCourse(course.id)}
                                                                className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                                title="Edit"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCourse(course.id)}
                                                                className="h-9 w-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                                title="Delete"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {courses.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#9692c9]">
                                                            <span className="material-symbols-outlined text-4xl opacity-20">school</span>
                                                            <p>No courses found. Create your first course!</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Courses;

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Lessons = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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

    return (
        <div className="bg-background-light dark:bg-[#0f0d1e] text-slate-900 dark:text-white font-display antialiased min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Main Content */}
                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col gap-8">
                        {/* Page Heading */}
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Lessons Management</h1>
                            <p className="text-slate-500 dark:text-[#9692c9] text-sm">Select a course to manage its lessons and curriculum.</p>
                        </div>

                        {/* Courses List (Vertical) */}
                        <div className="flex flex-col gap-4">
                            {loading ? (
                                <div className="p-12 text-center text-slate-500">
                                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                                    <p>Loading courses...</p>
                                </div>
                            ) : error ? (
                                <div className="p-12 text-center text-red-500">{error}</div>
                            ) : (
                                courses.map(course => (
                                    <div
                                        key={course.id}
                                        onClick={() => navigate(`/course-lessons/${course.id}`)}
                                        className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-[#262348] bg-white dark:bg-[#1a1735] p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                {course.title.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                                    {course.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-[#9692c9]">
                                                        <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                                                        {course.lessonsCount || 0} Lessons
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${course.status === 'Published'
                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                                                        }`}>
                                                        {course.status || 'Draft'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-[#0f0d1e] text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </div>
                                    </div>
                                ))
                            )}
                            {!loading && courses.length === 0 && (
                                <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-[#262348] rounded-2xl">
                                    <span className="material-symbols-outlined text-4xl opacity-20 mb-2">school</span>
                                    <p>No courses found. Create a course first!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Lessons;

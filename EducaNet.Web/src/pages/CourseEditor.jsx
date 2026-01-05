import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CourseEditor = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isNewCourse = courseId === 'new';

    const [course, setCourse] = useState({
        title: '',
        status: 'Draft'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isNewCourse) {
            const fetchCourse = async () => {
                setLoading(true);
                try {
                    const data = await api.getCourse(courseId);
                    setCourse({
                        title: data.title || '',
                        status: data.status || 'Draft'
                    });
                } catch (err) {
                    setError('Failed to load course details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchCourse();
        }
    }, [courseId, isNewCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setError('');
        try {
            if (isNewCourse) {
                // Backend CreateCourseDto only expects Title
                await api.createCourse({ title: course.title });
            } else {
                // Backend UpdateCourseDto expects Title
                await api.updateCourse(courseId, { title: course.title });

                // Status is handled via publish/unpublish endpoints if needed, 
                // but for now we remove the selection from the editor as requested.
            }
            navigate('/courses');
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.Message || 'Failed to save course.';
            setError(message);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased transition-colors duration-200 min-h-screen flex flex-col">
            {/* Top Navbar */}
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-[#262348] bg-surface-light dark:bg-background-dark px-6 py-4 shadow-sm dark:shadow-none z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight hidden sm:block">Course Platform</h2>
                    </div>
                </div>
                <div className="flex flex-1 justify-end items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-[#262348] overflow-hidden flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    {/* Breadcrumbs */}
                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-[#9692c9]">
                        <button onClick={() => navigate('/courses')} className="hover:text-primary transition-colors">Courses</button>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="font-medium text-slate-900 dark:text-white">{isNewCourse ? 'Create New Course' : 'Edit Course'}</span>
                    </div>

                    {/* Page Heading */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">{isNewCourse ? 'Create New Course' : 'Edit Course'}</h1>
                            <p className="mt-2 text-slate-600 dark:text-[#9692c9]">Fill in the details below to {isNewCourse ? 'create your' : 'update this'} course.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/courses')}
                                className="rounded-lg border border-slate-300 dark:border-[#373267] bg-transparent px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#262348] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/25 hover:bg-blue-700 transition-all active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Save Course
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

                    {/* Main Form Card */}
                    <div className="rounded-2xl border border-slate-200 dark:border-[#262348] bg-surface-light dark:bg-surface-dark p-6 shadow-sm md:p-10">
                        <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                            {/* Top Section: Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-500 dark:text-[#9692c9]">Course Title</label>
                                <input
                                    autoFocus
                                    className="w-full border-0 border-b-2 border-slate-200 dark:border-[#373267] bg-transparent px-0 py-3 text-2xl font-semibold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-700 focus:border-primary focus:ring-0 focus:outline-none transition-all duration-300 hover:border-slate-300 dark:hover:border-[#4a448a] focus:placeholder-transparent"
                                    placeholder="e.g. Advanced React Patterns"
                                    type="text"
                                    name="title"
                                    value={course.title}
                                    onChange={handleChange}
                                    required
                                />
                                <p className="text-xs text-slate-400 dark:text-slate-600">This will be displayed on the course card and landing page.</p>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-slate-200 dark:bg-[#262348]"></div>

                            {/* Instructor Info */}
                            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#121022] p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Primary Instructor</p>
                                        <p className="text-xs text-slate-500 dark:text-[#9692c9]">You are listed as the main author.</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* Bottom Padding */}
                    <div className="h-20"></div>
                </div>
            </main>
        </div>
    );
};

export default CourseEditor;

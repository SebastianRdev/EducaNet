import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import LessonModal from '../components/LessonModal';
import Sidebar from '../components/Sidebar';

const CourseLessons = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseData, lessonsData] = await Promise.all([
                    api.getCourse(courseId),
                    api.getLessons(courseId)
                ]);
                setCourse(courseData);
                setLessons(lessonsData || []);
            } catch (err) {
                console.error('Failed to load course data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const handleSaveLesson = async (lessonData) => {
        try {
            if (editingLesson) {
                await api.updateLesson(courseId, editingLesson.id, lessonData);
                setLessons(lessons.map(l => l.id === editingLesson.id ? { ...l, ...lessonData } : l));
            } else {
                const newLesson = await api.createLesson(courseId, lessonData);
                setLessons([...lessons, newLesson]);
            }
            setIsModalOpen(false);
            setEditingLesson(null);
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.Message || 'Failed to save lesson';
            alert(message);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await api.deleteLesson(courseId, lessonId);
                setLessons(lessons.filter(l => l.id !== lessonId));
            } catch (err) {
                alert('Failed to delete lesson');
            }
        }
    };

    const handleMoveUp = async (index) => {
        if (index === 0) return;
        const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
        const currentLesson = sortedLessons[index];
        const aboveLesson = sortedLessons[index - 1];

        try {
            // Swap orders in backend
            // We need to be careful with unique order constraint. 
            // A simple swap might fail if we don't do it atomically or use a temporary order.
            // However, the backend ReorderAsync checks for existence.
            // To avoid conflicts, we can move the current one to a temp order, 
            // but the backend doesn't seem to support that easily without more calls.
            // Let's try direct swap and see if backend handles it (it might not if it checks before update).

            // Actually, the backend ReorderAsync:
            // if (lesson.Order != newOrder) { ... find existing ... if (any) throw ... }
            // So direct swap WILL fail if the order is occupied.

            // Workaround: Move one to a very high number, then swap, then move back.
            // Or better: Backend should handle reordering logic.
            // Since I can't change backend easily now, I'll try to update them sequentially.

            const tempOrder = 999 + index;
            await api.reorderLesson(currentLesson.id, tempOrder);
            await api.reorderLesson(aboveLesson.id, currentLesson.order);
            await api.reorderLesson(currentLesson.id, aboveLesson.order);

            // Update local state
            const newLessons = lessons.map(l => {
                if (l.id === currentLesson.id) return { ...l, order: aboveLesson.order };
                if (l.id === aboveLesson.id) return { ...l, order: currentLesson.order };
                return l;
            });
            setLessons(newLessons);
        } catch (err) {
            alert('Failed to reorder lessons');
        }
    };

    const handleMoveDown = async (index) => {
        const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
        if (index === sortedLessons.length - 1) return;
        const currentLesson = sortedLessons[index];
        const belowLesson = sortedLessons[index + 1];

        try {
            const tempOrder = 999 + index;
            await api.reorderLesson(currentLesson.id, tempOrder);
            await api.reorderLesson(belowLesson.id, currentLesson.order);
            await api.reorderLesson(currentLesson.id, belowLesson.order);

            // Update local state
            const newLessons = lessons.map(l => {
                if (l.id === currentLesson.id) return { ...l, order: belowLesson.order };
                if (l.id === belowLesson.id) return { ...l, order: currentLesson.order };
                return l;
            });
            setLessons(newLessons);
        } catch (err) {
            alert('Failed to reorder lessons');
        }
    };

    const openModal = (lesson = null) => {
        setEditingLesson(lesson);
        setIsModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found</div>;

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
                <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col gap-8">
                        {/* Breadcrumbs */}
                        <nav className="flex items-center text-sm font-medium">
                            <button onClick={() => navigate('/lessons')} className="text-slate-500 dark:text-[#9692c9] hover:text-primary transition-colors">Lessons</button>
                            <span className="material-symbols-outlined mx-2 text-[16px] text-slate-400">chevron_right</span>
                            <span className="text-slate-900 dark:text-white">{course.title}</span>
                        </nav>

                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {course.title}
                                </h1>
                                <p className="text-slate-500 dark:text-[#9692c9] text-base max-w-2xl">
                                    Manage your curriculum. Drag and drop lessons to reorder or use the action buttons.
                                </p>
                            </div>
                            <button
                                onClick={() => openModal()}
                                className="group flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95"
                            >
                                <span className="material-symbols-outlined">add</span>
                                <span>Add New Lesson</span>
                            </button>
                        </div>

                        {/* Lessons List */}
                        <div className="flex flex-col gap-4 mt-4">
                            {/* List Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                <div className="col-span-1">Order</div>
                                <div className="col-span-7">Lesson Title</div>
                                <div className="col-span-4 text-right">Actions</div>
                            </div>

                            {/* List Items */}
                            <div className="flex flex-col gap-3">
                                {lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
                                    <div key={lesson.id} className="group bg-white dark:bg-[#1a1735] border border-slate-200 dark:border-[#262348] rounded-2xl p-4 md:px-6 md:py-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center shadow-sm hover:border-primary/30 transition-all duration-200">
                                        {/* Order */}
                                        <div className="flex items-center gap-3 w-full md:w-auto md:col-span-1">
                                            <span className="flex items-center justify-center size-10 rounded-xl bg-slate-50 dark:bg-[#0f0d1e] text-slate-500 dark:text-[#9692c9] font-bold text-sm border border-slate-100 dark:border-[#262348]">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        {/* Title */}
                                        <div className="w-full md:col-span-7">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                {lesson.title}
                                            </h3>
                                        </div>
                                        {/* Actions */}
                                        <div className="w-full flex items-center justify-end gap-2 md:col-span-4">
                                            <div className="flex items-center gap-1 mr-4 border-r border-slate-200 dark:border-[#262348] pr-4">
                                                <button
                                                    onClick={() => handleMoveUp(index)}
                                                    disabled={index === 0}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                                                </button>
                                                <button
                                                    onClick={() => handleMoveDown(index)}
                                                    disabled={index === lessons.length - 1}
                                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => openModal(lesson)}
                                                className="flex items-center justify-center h-10 px-4 rounded-xl border border-slate-200 dark:border-[#262348] text-sm font-bold text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#0f0d1e] hover:text-primary transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[18px] mr-2">edit</span>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(lesson.id)}
                                                className="flex items-center justify-center size-10 rounded-xl border border-slate-200 dark:border-[#262348] text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                title="Delete Lesson"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {lessons.length === 0 && (
                                    <div className="p-12 text-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-[#262348] rounded-2xl">
                                        <span className="material-symbols-outlined text-4xl opacity-20 mb-2">auto_stories</span>
                                        <p>No lessons yet. Click "Add New Lesson" to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <LessonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLesson}
                lesson={editingLesson}
            />
        </div>
    );
};

export default CourseLessons;

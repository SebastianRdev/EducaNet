import { useState, useEffect } from 'react';

const LessonModal = ({ isOpen, onClose, onSave, lesson = null }) => {
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(1);

    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setOrder(lesson.order);
        } else {
            setTitle('');
            setOrder(1);
        }
    }, [lesson, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, order: parseInt(order) });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-[560px] transform overflow-hidden rounded-xl bg-white dark:bg-card-dark shadow-2xl transition-all border border-slate-200 dark:border-border-dark flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-border-dark/50">
                    <h3 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">
                        {lesson ? 'Edit Lesson' : 'Add New Lesson'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="group rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                        type="button"
                    >
                        <span className="material-symbols-outlined text-[20px] font-semibold">close</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Title Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200" htmlFor="lesson-title">
                            Lesson Title
                        </label>
                        <div className="relative">
                            <input
                                autoFocus
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-slate-200 bg-slate-50 dark:border-transparent dark:bg-input-dark h-12 px-4 text-base font-normal leading-normal text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9692c9] focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                                id="lesson-title"
                                placeholder="e.g., Introduction to React Hooks"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Order Select */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium leading-normal text-slate-700 dark:text-slate-200" htmlFor="lesson-order">
                            Lesson Order
                        </label>
                        <div className="relative">
                            <select
                                className="appearance-none flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-slate-200 bg-slate-50 dark:border-transparent dark:bg-input-dark h-12 px-4 pr-10 text-base font-normal leading-normal text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-shadow"
                                id="lesson-order"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-[#9692c9]">
                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-5 bg-slate-50 dark:bg-background-dark/30 border-t border-slate-100 dark:border-border-dark/50">
                    <button
                        onClick={onClose}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent hover:bg-slate-200 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <span className="truncate">Cancel</span>
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/25 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-card-dark"
                    >
                        <span className="truncate">Save Changes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;

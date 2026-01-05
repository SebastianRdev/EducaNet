import React from 'react';

const CourseSummaryModal = ({ isOpen, onClose, course }) => {
    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-[#1a1735] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-[#262348] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-[#262348] flex items-center justify-between bg-slate-50/50 dark:bg-[#121022]/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Course Summary
                    </h3>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0f0d1e] transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-6">
                    {/* Basic Info */}
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                            {course.title.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white truncate">{course.title}</h4>
                            <span className={`inline-flex items-center gap-1 mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${course.status === 'Published'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                                }`}>
                                {course.status}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-[#0f0d1e] p-4 rounded-xl border border-slate-100 dark:border-[#262348]">
                            <p className="text-xs text-slate-500 dark:text-[#9692c9] font-medium mb-1 uppercase tracking-wider">Total Lessons</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{course.lessonsCount || 0}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-[#0f0d1e] p-4 rounded-xl border border-slate-100 dark:border-[#262348]">
                            <p className="text-xs text-slate-500 dark:text-[#9692c9] font-medium mb-1 uppercase tracking-wider">Created At</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {new Date(course.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="bg-slate-50 dark:bg-[#0f0d1e] p-4 rounded-xl border border-slate-100 dark:border-[#262348]">
                        <p className="text-xs text-slate-500 dark:text-[#9692c9] font-medium mb-1 uppercase tracking-wider">Last Modification</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {new Date(course.updatedAt).toLocaleString()}
                        </p>
                    </div>

                    {/* Lesson Titles Preview (Optional but nice) */}
                    {course.lessonTitles && course.lessonTitles.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 dark:text-[#9692c9] font-medium mb-2 uppercase tracking-wider">Lessons Preview</p>
                            <div className="max-h-32 overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
                                {course.lessonTitles.map((title, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#9692c9] bg-white dark:bg-[#1a1735] p-2 rounded-lg border border-slate-100 dark:border-[#262348]">
                                        <span className="text-primary font-bold">{index + 1}.</span>
                                        <span className="truncate">{title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-[#121022]/50 border-t border-slate-100 dark:border-[#262348] flex justify-end">
                    <button
                        onClick={onClose}
                        className="h-10 px-6 rounded-xl bg-slate-200 dark:bg-[#0f0d1e] text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-300 dark:hover:bg-[#262348] transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseSummaryModal;

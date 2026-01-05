import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { id: 'courses', label: 'Courses', icon: 'school', path: '/courses' },
        { id: 'lessons', label: 'Lessons', icon: 'auto_stories', path: '/lessons' },
        { id: 'settings', label: 'Settings', icon: 'settings', path: '#', disabled: true },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform lg:translate-x-0 border-r border-slate-200 dark:border-[#262348] bg-white dark:bg-[#0f0d1e]">
            <div className="flex h-full flex-col px-4 py-6">
                {/* Logo */}
                <div className="mb-10 flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-[24px]">school</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EducaNet</h2>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => !item.disabled && navigate(item.path)}
                            disabled={item.disabled}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${location.pathname === item.path && !item.disabled
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1735] hover:text-slate-900 dark:hover:text-white'
                                } ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                            <span>{item.label}</span>
                            {item.disabled && (
                                <span className="ml-auto rounded-full bg-slate-100 dark:bg-[#1a1735] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Soon
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User & Logout */}
                <div className="mt-auto border-t border-slate-200 dark:border-[#262348] pt-6">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-[#262348] flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-slate-400">person</span>
                        </div>
                        <div className="flex-1 overflow-hidden text-left">
                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">Instructor</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-300">{user?.email || 'instructor@educanet.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                        <span className="material-symbols-outlined text-[22px]">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

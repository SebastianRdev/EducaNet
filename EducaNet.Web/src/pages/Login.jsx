import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.login(email, password);
            login(response.token, email);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col antialiased selection:bg-primary selection:text-white overflow-x-hidden">
            {/* Navbar (Minimal for Login Page) */}
            <header className="w-full px-6 py-6 absolute top-0 left-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full drop-shadow-lg" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CoursePlatform</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-20 relative">
                {/* Abstract Background Gradient Decor */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50 mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-40 mix-blend-screen"></div>

                {/* Login Card */}
                <div className="w-full max-w-[480px] bg-white dark:bg-card-dark rounded-2xl shadow-xl dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-[#2f2b55] overflow-hidden relative z-20">
                    <div className="p-8 sm:p-10 flex flex-col gap-6">
                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">Welcome back</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base">Please enter your details to sign in.</p>
                        </div>

                        {/* Error Placeholder */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-xl shrink-0">error</span>
                                <p className="text-red-500 text-sm font-medium pt-0.5">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400">mail</span>
                                    </div>
                                    <input
                                        className="w-full rounded-lg bg-slate-50 dark:bg-input-dark border border-slate-200 dark:border-[#373267] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-12 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        id="email"
                                        placeholder="you@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400">lock</span>
                                    </div>
                                    <input
                                        className="w-full rounded-lg bg-slate-50 dark:bg-input-dark border border-slate-200 dark:border-[#373267] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 h-12 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-200 flex items-center justify-center gap-2 group mt-2" type="submit">
                                <span>Sign In</span>
                                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                            </button>
                        </form>

                        {/* Footer Divider */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-200 dark:border-[#373267]"></div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="p-6 bg-slate-50 dark:bg-[#252244] border-t border-slate-200 dark:border-[#2f2b55] text-center -mx-8 -mb-10 sm:-mx-10 sm:-mb-10 rounded-b-2xl">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Don't have an account?
                                <a className="font-semibold text-primary hover:underline ml-1" href="#">Sign up for free</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Login({ darkMode = false, errors = {} }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post('/login', {
            username,
            password,
            remember: rememberMe,
        }, {
            preserveScroll: true,
            onError: (errors) => {
                // Errors are passed from the backend via Inertia
            },
            onSuccess: () => {
                // Redirect handled by backend
            },
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className={`w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
                    <div className="flex justify-center">
                        <img src="/storage/logo/image/1.1.png" alt="Logo" className="h-16 w-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-center">EZE Live</h2>
                    {errors.login && (
                        <div className="text-red-500 text-sm text-center">{errors.login}</div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`mt-1 block w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-400'} focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errors.username ? 'border-red-500' : ''}`}
                                placeholder="Enter your username"
                                autoComplete="off"
                                required
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`mt-1 block w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-400'} focus:outline-none focus:ring-2 focus:border-transparent transition duration-200 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                                />
                                <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Remember Me
                                </span>
                            </label>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className={`w-full py-2.5 px-4 rounded-lg font-semibold transition duration-200 ${darkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text(Var(--tw-prose-code)) white'} focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-200 ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

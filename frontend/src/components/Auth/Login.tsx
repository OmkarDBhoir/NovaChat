import { useState, type FC } from 'react'
import { api, setAuthToken } from '../../api/axios'

const featurePills = ['Secure chats', 'Smart sync', 'Private rooms']

type AuthMode = 'login' | 'register'

type LoginFormState = {
    email: string
    password: string
    rememberMe: boolean
}

type RegisterFormState = {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    agreeTerms: boolean
}

type LoginProps = {
    onLogin?: () => void
}

const initialLoginState: LoginFormState = {
    email: '',
    password: '',
    rememberMe: true,
}

const initialRegisterState: RegisterFormState = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
}

const Login: FC<LoginProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<AuthMode>('login')
    const [loginData, setLoginData] = useState<LoginFormState>(initialLoginState)
    const [registerData, setRegisterData] = useState<RegisterFormState>(initialRegisterState)
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authError, setAuthError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleLoginChange = (field: keyof LoginFormState, value: string | boolean) => {
        setLoginData((prev) => ({ ...prev, [field]: value }))
    }

    const handleRegisterChange = (field: keyof RegisterFormState, value: string | boolean) => {
        setRegisterData((prev) => ({ ...prev, [field]: value }))
    }

    const handleLoginSubmit = async () => {
        setAuthError('')
        setSuccessMessage('')
        setIsSubmitting(true)

        try {
            console.log("login");
            const response = await api.post('/api/auth/login', {
                email: loginData.email,
                password: loginData.password,
            })

            const token = response.data?.token || response.data?.jwt || response.data?.accessToken
            if (token) {
                setAuthToken(token)
                onLogin?.()
            }

            setSuccessMessage('Login successful!')
            console.log('Login response:', response.data)
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'isAxiosError' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                setAuthError(axiosError.response?.data?.message || 'Login failed. Please try again.')
            } else {
                setAuthError('Something went wrong. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegisterSubmit = async () => {
        setAuthError('')
        setSuccessMessage('')

        if (registerData.password !== registerData.confirmPassword) {
            setAuthError('Passwords do not match.')
            return
        }

        if (!registerData.agreeTerms) {
            setAuthError('Please accept the terms and privacy policy.')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await api.post('/api/auth/register', {
                fullName: registerData.fullName,
                email: registerData.email,
                password: registerData.password,
            })

            setSuccessMessage('Registration successful! Please log in.')
            setMode('login')
            setRegisterData(initialRegisterState)
            console.log('Registration response:', response.data)
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'isAxiosError' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } }
                setAuthError(axiosError.response?.data?.message || 'Registration failed. Please try again.')
            } else {
                setAuthError('Something went wrong. Please try again.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const switchToRegister = () => setMode('register')
    const switchToLogin = () => setMode('login')

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.8)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.4),_transparent_30%),linear-gradient(135deg,#0f172a_0%,#111827_45%,#020617_100%)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />

                        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/30">
                                    N
                                </div>
                                <span className="text-lg font-semibold tracking-wide text-slate-100">NovaChat</span>
                            </div>

                            <div className="max-w-md space-y-5">
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
                                    {mode === 'login' ? 'Welcome back' : 'Join the community'}
                                </p>
                                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                    {mode === 'login'
                                        ? 'Stay close to your team, wherever you are.'
                                        : 'Build better conversations with your team.'}
                                </h1>
                                <p className="max-w-sm text-base text-slate-300">
                                    {mode === 'login'
                                        ? 'Secure messaging, shared workspaces, and instant collaboration built for modern teams.'
                                        : 'Create your workspace and start collaborating in real time with secure channels and smart tools.'}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {featurePills.map((feature) => (
                                    <span
                                        key={feature}
                                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-100"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <div className="relative max-w-sm rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/40">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-indigo-500 text-xs font-semibold text-white">A</span>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-emerald-500 text-xs font-semibold text-white">M</span>
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 bg-cyan-500 text-xs font-semibold text-white">J</span>
                                    </div>
                                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" aria-hidden="true" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-400">Live room activity</p>
                                    <p className="text-lg font-semibold text-white">24 teammates online</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center bg-slate-950/80 p-6 sm:p-8 lg:p-10">
                        {mode === 'login' ? (
                            <div className="w-full max-w-md space-y-6">
                                {(authError || successMessage) && (
                                    <div
                                        className={`rounded-xl border px-3 py-2 text-sm ${authError
                                            ? 'border-red-500/40 bg-red-500/10 text-red-200'
                                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                                            }`}
                                    >
                                        {authError || successMessage}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">Sign in</p>
                                    <h2 className="text-3xl font-semibold text-white">Access your workspace</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white text-[10px] font-bold text-slate-900">G</span>
                                        Google
                                    </button>
                                    <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-900">X</span>
                                        GitHub
                                    </button>
                                </div>

                                <div className="relative flex items-center justify-center">
                                    <div className="h-px w-full bg-white/10" />
                                    <span className="absolute bg-slate-950 px-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                                        or continue with email
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Email address</span>
                                        <input
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) => handleLoginChange('email', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                            placeholder="you@example.com"
                                        />
                                    </label>

                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Password</span>
                                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30">
                                            <input
                                                type={showLoginPassword ? 'text' : 'password'}
                                                value={loginData.password}
                                                onChange={(e) => handleLoginChange('password', e.target.value)}
                                                className="w-full bg-transparent px-1 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginPassword((prev) => !prev)}
                                                className="rounded-lg px-2 py-1 text-xs font-medium text-cyan-200 transition hover:bg-white/5"
                                            >
                                                {showLoginPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <label className="flex items-center gap-2 text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={loginData.rememberMe}
                                            onChange={(e) => handleLoginChange('rememberMe', e.target.checked)}
                                            className="h-4 w-4 rounded border-white/15 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                                        />
                                        <span>Remember me</span>
                                    </label>
                                    <button type="button" className="font-medium text-cyan-300 transition hover:text-cyan-200">
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleLoginSubmit}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 px-4 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                                </button>

                                <p className="text-center text-sm text-slate-300">
                                    Don&apos;t have an account?{' '}
                                    <button type="button" onClick={switchToRegister} className="font-medium text-cyan-300 transition hover:text-cyan-200">
                                        Create one
                                    </button>
                                </p>
                            </div>
                        ) : (
                            <div className="w-full max-w-md space-y-6">
                                {(authError || successMessage) && (
                                    <div
                                        className={`rounded-xl border px-3 py-2 text-sm ${authError
                                            ? 'border-red-500/40 bg-red-500/10 text-red-200'
                                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                                            }`}
                                    >
                                        {authError || successMessage}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">Create account</p>
                                    <h2 className="text-3xl font-semibold text-white">Start your workspace</h2>
                                </div>

                                <div className="space-y-5">
                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Full name</span>
                                        <input
                                            type="text"
                                            value={registerData.fullName}
                                            onChange={(e) => handleRegisterChange('fullName', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                            placeholder="John Doe"
                                        />
                                    </label>

                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Email address</span>
                                        <input
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => handleRegisterChange('email', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-base text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                            placeholder="you@example.com"
                                        />
                                    </label>

                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Password</span>
                                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30">
                                            <input
                                                type={showRegisterPassword ? 'text' : 'password'}
                                                value={registerData.password}
                                                onChange={(e) => handleRegisterChange('password', e.target.value)}
                                                className="w-full bg-transparent px-1 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none"
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowRegisterPassword((prev) => !prev)}
                                                className="rounded-lg px-2 py-1 text-xs font-medium text-cyan-200 transition hover:bg-white/5"
                                            >
                                                {showRegisterPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </label>

                                    <label className="block space-y-2 text-sm font-medium text-slate-200">
                                        <span>Confirm password</span>
                                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={registerData.confirmPassword}
                                                onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                                                className="w-full bg-transparent px-1 py-3 text-base text-white placeholder:text-slate-400 focus:outline-none"
                                                placeholder="Retype your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="rounded-lg px-2 py-1 text-xs font-medium text-cyan-200 transition hover:bg-white/5"
                                            >
                                                {showConfirmPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                    </label>
                                </div>

                                <label className="flex items-center gap-2 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={registerData.agreeTerms}
                                        onChange={(e) => handleRegisterChange('agreeTerms', e.target.checked)}
                                        className="h-4 w-4 rounded border-white/15 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <span>I agree to the terms and privacy policy</span>
                                </label>

                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleRegisterSubmit}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400 px-4 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Creating account...' : 'Create account'}
                                </button>

                                <p className="text-center text-sm text-slate-300">
                                    Already have an account?{' '}
                                    <button type="button" onClick={switchToLogin} className="font-medium text-cyan-300 transition hover:text-cyan-200">
                                        Sign in
                                    </button>
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}

export default Login


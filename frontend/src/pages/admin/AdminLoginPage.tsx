import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ── 帳密管理（存於 localStorage，可由後台修改） ──
const ADMIN_CREDS_KEY = 'tarot_admin_creds'
const DEFAULT_EMAIL = 'admin@gmail.com'
const DEFAULT_PASSWORD = '1234567890'
const ADMIN_SESSION_KEY = 'tarot_admin_session'

export function getAdminCreds(): { email: string; password: string } {
    try {
        const raw = localStorage.getItem(ADMIN_CREDS_KEY)
        if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
}

export function saveAdminCreds(email: string, password: string) {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ email, password }))
}

export function setAdminSession() {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated')
}

export function clearAdminSession() {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated'
}

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        await new Promise(r => setTimeout(r, 600))

        const creds = getAdminCreds()
        if (email === creds.email && password === creds.password) {
            setAdminSession()
            navigate('/admin')
        } else {
            setError('帳號或密碼錯誤，請再試一次')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            {/* 背景 */}
            <div className="fixed inset-0 -z-10"
                style={{
                    background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, hsl(205 35% 28% / 0.8) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, hsl(195 25% 24% / 0.7) 0%, transparent 55%),
            linear-gradient(160deg, hsl(213 30% 14%) 0%, hsl(210 28% 20%) 40%, hsl(213 25% 17%) 100%)
          `
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm mx-4"
            >
                <div
                    className="rounded-3xl p-8"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
                    }}
                >
                    {/* 圖示與標題 */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                            style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}>
                            <Shield className="h-6 w-6 text-slate-300" />
                        </div>
                        <h1 className="text-xl font-cinzel font-bold text-gradient-frost tracking-wide mb-1">
                            ADMIN
                        </h1>
                        <p className="text-xs text-slate-500 font-garamond tracking-widest uppercase">
                            後台管理系統
                        </p>
                    </div>

                    {/* 表單 */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs text-slate-400 tracking-wider uppercase font-garamond">
                                管理員帳號
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@gmail.com"
                                required
                                autoComplete="off"
                                className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-xs text-slate-400 tracking-wider uppercase font-garamond">
                                密碼
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    required
                                    autoComplete="off"
                                    className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-300"
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                            >
                                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl font-serif-tc tracking-widest text-sm transition-all duration-300"
                            style={{
                                background: loading ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'rgba(255,255,255,0.9)',
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                                    驗證中
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    進入後台
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-xs text-slate-600 hover:text-slate-400 transition-colors font-garamond tracking-wider"
                        >
                            ← 返回占卜首頁
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

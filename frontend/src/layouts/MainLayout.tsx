import { ReactNode, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, Sparkles, Home, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGlobalState } from '@/store'
import { useIsMobile } from '@/hooks'

interface MainLayoutProps {
    children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const { settings, setJwt } = useGlobalState()

    useEffect(() => {
        // 強制深色模式
        document.documentElement.classList.add('dark')
    }, [])

    const showAd = !isMobile && settings.ad_client && settings.ad_slot

    useEffect(() => {
        if (showAd && settings.fetched) {
            try {
                // @ts-ignore
                ; (window.adsbygoogle = window.adsbygoogle || []).push({})
                    // @ts-ignore
                    ; (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (e) {
                console.error('AdSense error:', e)
            }
        }
    }, [showAd, settings.fetched])

    const logOut = () => {
        setJwt('')
        window.location.reload()
    }

    return (
        <div className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30 relative">

            {/* ── 多層霧藍灰漸層背景 ── */}
            <div
                className="fixed inset-0 -z-20"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 60% at 20% 10%, hsl(205 35% 28% / 0.8) 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 80% 80%, hsl(195 25% 24% / 0.7) 0%, transparent 55%),
                        radial-gradient(ellipse 50% 40% at 60% 20%, hsl(40 20% 60% / 0.15) 0%, transparent 50%),
                        linear-gradient(160deg, hsl(213 30% 14%) 0%, hsl(210 28% 20%) 40%, hsl(213 25% 17%) 100%)
                    `
                }}
            />

            {/* ── 光暈 blob ── */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div
                    className="absolute animate-float"
                    style={{
                        top: '-5%', left: '10%',
                        width: '520px', height: '520px',
                        background: 'radial-gradient(circle, hsl(205 40% 50% / 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        animationDelay: '0s',
                    }}
                />
                <div
                    className="absolute animate-float"
                    style={{
                        bottom: '5%', right: '8%',
                        width: '420px', height: '420px',
                        background: 'radial-gradient(circle, hsl(195 30% 45% / 0.10) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(50px)',
                        animationDelay: '2s',
                    }}
                />
                <div
                    className="absolute animate-float"
                    style={{
                        top: '40%', left: '55%',
                        width: '300px', height: '300px',
                        background: 'radial-gradient(circle, hsl(42 30% 65% / 0.07) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        animationDelay: '4s',
                    }}
                />
            </div>

            <div className="w-full px-4 md:px-8 py-4 md:py-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

                    {/* Left Ad Column */}
                    {showAd && (
                        <div className="hidden md:block md:col-span-1">
                            <ins
                                className="adsbygoogle sticky top-4"
                                style={{ display: 'block', minHeight: '600px' }}
                                data-ad-client={settings.ad_client}
                                data-ad-slot={settings.ad_slot}
                                data-ad-format="auto"
                                data-full-width-responsive="true"
                            ></ins>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className={`flex flex-col min-h-[calc(100vh-3rem)] ${showAd ? 'md:col-span-4' : 'md:col-span-6 md:px-8 lg:px-20'}`}>

                        {/* ── Header / Navigation ── */}
                        <motion.header
                            initial={{ y: -24, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
                            className="tarot-card rounded-2xl p-4 mb-6 sticky top-2 z-50"
                        >
                            <div className="flex items-center justify-between">
                                {/* Logo */}
                                <Link to="/" className="flex items-center gap-3 group">
                                    <div className="relative p-2 rounded-full border border-white/20 bg-white/5 group-hover:bg-white/10 transition-all duration-300">
                                        <Sparkles className="h-4 w-4 text-slate-300 animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <h1 className="text-lg md:text-xl font-cinzel font-bold text-gradient-frost tracking-wide">
                                                AI TAROT
                                            </h1>
                                            <span className="text-xs text-slate-400 font-serif-tc tracking-widest hidden sm:inline">
                                                AI 占卜
                                            </span>
                                        </div>
                                        <p className="text-[9px] md:text-[10px] text-slate-500 hidden sm:block tracking-[0.2em] uppercase font-garamond">
                                            Explore the unknown · Illuminate the future
                                        </p>
                                    </div>
                                </Link>

                                {/* Actions */}
                                <div className="flex items-center gap-1 md:gap-1.5">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigate('/')}
                                        title="主頁"
                                        className="text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full border border-transparent hover:border-white/15 transition-all"
                                    >
                                        <Home className="h-4 w-4" />
                                    </Button>

                                    {settings.enable_login && (
                                        settings.user_name ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={logOut}
                                                className="gap-2 text-slate-400 hover:text-red-300 hover:bg-red-900/20 rounded-full text-xs border border-transparent hover:border-red-400/20 transition-all"
                                            >
                                                <LogOut className="h-3.5 w-3.5" />
                                                <span className="hidden sm:inline">登出</span>
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => navigate('/login')}
                                                className="gap-2 rounded-full text-xs tarot-btn border-white/30"
                                            >
                                                <LogIn className="h-3.5 w-3.5" />
                                                <span className="hidden sm:inline">登入</span>
                                            </Button>
                                        )
                                    )}

                                    {/* 後台入口（低調隱藏） */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => navigate('/admin/login')}
                                        title="後台管理"
                                        className="text-slate-700 hover:text-slate-400 hover:bg-white/5 rounded-full border border-transparent hover:border-white/10 transition-all"
                                    >
                                        <Shield className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Rate limit notice */}
                            <AnimatePresence>
                                {settings.fetched && !settings.user_name && settings.enable_rate_limit && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <div className="flex items-center justify-between text-xs text-amber-400/80 bg-amber-900/20 border border-amber-400/20 px-3 py-1.5 rounded-full">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                    訪客限流模式 ({settings.rate_limit})
                                                </span>
                                                <Link to="/admin/login" className="hover:underline opacity-70 hover:opacity-100 tracking-wider">
                                                    管理員設定 →
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.header>

                        {/* Page Content */}
                        <main className="flex-1 relative">
                            <AnimatePresence mode="wait">
                                {children}
                            </AnimatePresence>
                        </main>

                        <footer className="mt-8 py-6 text-center border-t border-white/10">
                            <p className="text-xs text-slate-500 tracking-widest font-garamond">
                                © {new Date().getFullYear()} &nbsp;AI TAROT DIVINATION&nbsp; · &nbsp;保持開放的心態
                            </p>
                            <p className="text-[10px] text-slate-600 mt-1 tracking-[0.3em] uppercase font-garamond">
                                For entertainment purposes only
                            </p>
                        </footer>
                    </div>

                    {/* Right Ad Column */}
                    {showAd && (
                        <div className="hidden md:block md:col-span-1">
                            <ins
                                className="adsbygoogle sticky top-4"
                                style={{ display: 'block', minHeight: '600px' }}
                                data-ad-client={settings.ad_client}
                                data-ad-slot={settings.ad_slot}
                                data-ad-format="auto"
                                data-full-width-responsive="true"
                            ></ins>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

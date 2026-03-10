import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Shield, LogOut, Settings as SettingsIcon, Github,
    Save, CheckCircle2, ExternalLink, ChevronRight,
    Eye, EyeOff, Globe, Key, Cpu, UserCog, AlertCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useGlobalState } from '@/store'
import { clearAdminSession, isAdminAuthenticated, getAdminCreds, saveAdminCreds } from './AdminLoginPage'

type AdminTab = 'settings' | 'github' | 'account'

export default function AdminPanel() {
    const navigate = useNavigate()
    const { customOpenAISettings, setCustomOpenAISettings, settings } = useGlobalState()
    const [activeTab, setActiveTab] = useState<AdminTab>('settings')

    // ── 驗證 session ──
    useEffect(() => {
        if (!isAdminAuthenticated()) {
            navigate('/admin/login')
        }
    }, [navigate])

    const handleLogout = () => {
        clearAdminSession()
        navigate('/')
    }

    // ────────────────────────────────────────
    // API 設定 Tab 狀態
    // ────────────────────────────────────────
    const [apiSettings, setApiSettings] = useState({
        enable: false,
        baseUrl: '',
        apiKey: '',
        model: '',
    })
    const [apiSaving, setApiSaving] = useState(false)
    const [apiSaved, setApiSaved] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)

    useEffect(() => {
        setApiSettings({
            enable: customOpenAISettings.enable,
            baseUrl: customOpenAISettings.baseUrl || settings.default_api_base || '',
            apiKey: customOpenAISettings.apiKey || '',
            model: customOpenAISettings.model || settings.default_model || '',
        })
    }, [customOpenAISettings, settings])

    const saveApiSettings = async () => {
        setApiSaving(true)
        setApiSaved(false)
        const creds = getAdminCreds()
        try {
            // ── 1. 儲存至本地 (使用者個人偏好) ──
            setCustomOpenAISettings(apiSettings)

            // ── 2. 儲存至後端 (全站預設設定) ──
            const resp = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': creds.password
                },
                body: JSON.stringify({
                    api_key: apiSettings.apiKey,
                    api_base: apiSettings.baseUrl,
                    model: apiSettings.model
                })
            })

            if (!resp.ok) {
                const errData = await resp.json()
                alert(`後端儲存失敗: ${errData.detail || '未知錯誤'}`)
                return
            }

            setApiSaved(true)
            setTimeout(() => setApiSaved(false), 3000)
        } catch (err: any) {
            console.error(err)
            alert(`連線失敗: ${err.message}`)
        } finally {
            setApiSaving(false)
        }
    }

    // ────────────────────────────────────────
    // 帳號管理 Tab 狀態
    // ────────────────────────────────────────
    const currentCreds = getAdminCreds()
    const [newEmail, setNewEmail] = useState(currentCreds.email)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [accountSaving, setAccountSaving] = useState(false)
    const [accountSaved, setAccountSaved] = useState(false)
    const [accountError, setAccountError] = useState('')

    const saveAccountSettings = async () => {
        setAccountError('')
        if (!newEmail.trim()) {
            setAccountError('帳號不可為空')
            return
        }
        if (newPassword && newPassword !== confirmPassword) {
            setAccountError('兩次輸入的密碼不一致')
            return
        }
        if (newPassword && newPassword.length < 6) {
            setAccountError('密碼至少需要 6 個字元')
            return
        }
        setAccountSaving(true)
        setAccountSaved(false)
        try {
            const finalPassword = newPassword || currentCreds.password

            // ── 1. 儲存至本地 ──
            saveAdminCreds(newEmail.trim(), finalPassword)

            // ── 2. 儲存至後端 ──
            const resp = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': currentCreds.password
                },
                body: JSON.stringify({
                    admin_password: finalPassword
                })
            })

            if (!resp.ok) {
                const errData = await resp.json()
                setAccountError(`後端儲存失敗: ${errData.detail || '未知錯誤'}`)
                return
            }

            setAccountSaved(true)
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => setAccountSaved(false), 3000)
        } catch (err: any) {
            console.error(err)
            setAccountError(`連線失敗: ${err.message}`)
        } finally {
            setAccountSaving(false)
        }
    }

    // ────────────────────────────────────────
    // Tab 設定
    // ────────────────────────────────────────
    const tabs: { key: AdminTab; label: string; icon: React.ElementType; en: string }[] = [
        { key: 'settings', label: 'API 設定', icon: SettingsIcon, en: 'API Settings' },
        { key: 'account', label: '帳號管理', icon: UserCog, en: 'Account' },
        { key: 'github', label: 'GitHub', icon: Github, en: 'Repository' },
    ]

    return (
        <div className="min-h-screen"
            style={{
                background: `
          radial-gradient(ellipse 80% 60% at 20% 10%, hsl(205 35% 28% / 0.8) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, hsl(195 25% 24% / 0.7) 0%, transparent 55%),
          linear-gradient(160deg, hsl(213 30% 14%) 0%, hsl(210 28% 20%) 40%, hsl(213 25% 17%) 100%)
        `
            }}
        >
            {/* ── 後台頂部 Header ── */}
            <header
                className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                        <Shield className="h-4 w-4 text-slate-300" />
                    </div>
                    <div>
                        <span className="font-cinzel text-sm font-bold text-gradient-frost tracking-wide">ADMIN PANEL</span>
                        <span className="ml-2 text-xs text-slate-500 font-garamond">· 後台管理</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-all duration-200 font-garamond tracking-wider flex items-center gap-1 px-3 py-1.5 rounded-full"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <ChevronRight className="h-3 w-3 rotate-180" />
                        返回首頁
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-xs text-red-400 hover:text-red-200 transition-all duration-200 font-garamond tracking-wider flex items-center gap-1 px-3 py-1.5 rounded-full"
                        style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}
                    >
                        <LogOut className="h-3 w-3" />
                        登出
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* 頁面標題 */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15))' }} />
                        <span className="text-[10px] font-garamond tracking-[0.4em] text-slate-500 uppercase">Admin Dashboard</span>
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.15))' }} />
                    </div>
                    <h1 className="text-2xl font-serif-tc font-bold text-gradient-frost" style={{ letterSpacing: '0.06em' }}>
                        後台管理
                    </h1>
                </motion.div>

                {/* ── Tab 導航 ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex gap-2 mb-5 flex-wrap"
                >
                    {tabs.map(tab => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.key
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                                    border: isActive ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.1)',
                                    color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                                }}
                            >
                                <Icon className="h-4 w-4" />
                                <div className="text-left">
                                    <div className="font-serif-tc text-sm leading-none mb-0.5">{tab.label}</div>
                                    <div className="font-garamond text-[9px] tracking-widest opacity-60 uppercase leading-none">{tab.en}</div>
                                </div>
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── 內容面板 ── */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    }}
                >

                    {/* ═══════ API 設定 Tab ═══════ */}
                    {activeTab === 'settings' && (
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Key className="h-4 w-4 text-slate-400" />
                                    <h2 className="font-serif-tc text-base font-medium text-slate-200">OpenAI API 設定</h2>
                                </div>
                                <p className="text-[10px] text-slate-500 font-garamond ml-6 mt-1">※ 設定將儲存於伺服器並應用於所有使用者</p>
                                <button
                                    onClick={saveApiSettings}
                                    disabled={apiSaving}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all duration-200 font-serif-tc"
                                    style={{
                                        background: apiSaved ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.08)',
                                        border: apiSaved ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.18)',
                                        color: apiSaved ? 'rgb(134,239,172)' : 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    {apiSaved ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5" />已儲存</>
                                    ) : apiSaving ? (
                                        <><span className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />儲存中</>
                                    ) : (
                                        <><Save className="h-3.5 w-3.5" />儲存設定</>
                                    )}
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Chrome 自動填充攔截（隱形 dummy 欄位） */}
                                <input type="text" name="username" autoComplete="username" style={{ display: 'none' }} readOnly tabIndex={-1} aria-hidden="true" />
                                <input type="password" name="password" autoComplete="current-password" style={{ display: 'none' }} readOnly tabIndex={-1} aria-hidden="true" />

                                {/* 啟用自定義 API */}
                                <div className="flex items-center justify-between p-4 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div>
                                        <p className="text-sm font-serif-tc text-slate-300 mb-0.5">啟用自定義 API</p>
                                        <p className="text-xs text-slate-600 font-garamond">使用您自己的 OpenAI API 配置</p>
                                    </div>
                                    <Switch
                                        checked={apiSettings.enable}
                                        onCheckedChange={checked => setApiSettings({ ...apiSettings, enable: checked })}
                                    />
                                </div>

                                {/* API 地址 */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                        <Globe className="h-3 w-3" /> API 地址
                                    </Label>
                                    <Input
                                        value={apiSettings.baseUrl}
                                        onChange={e => setApiSettings({ ...apiSettings, baseUrl: e.target.value })}
                                        placeholder="https://api.openai.com"
                                        autoComplete="off"
                                        name="api-base-url"
                                        className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl"
                                    />
                                </div>

                                {/* API Key */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-1.5 text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                            <Key className="h-3 w-3" /> API 金鑰
                                        </Label>
                                        {settings.purchase_url && (
                                            <a href={settings.purchase_url} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors font-garamond">
                                                取得 API KEY <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type={showApiKey ? 'text' : 'password'}
                                            value={apiSettings.apiKey}
                                            onChange={e => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                                            placeholder="sk-..."
                                            autoComplete="off"
                                            name="openai-api-key"
                                            className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl pr-10 font-mono text-sm"
                                        />
                                        <button type="button" onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* 模型 */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1.5 text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                        <Cpu className="h-3 w-3" /> 模型
                                    </Label>
                                    <Input
                                        value={apiSettings.model}
                                        onChange={e => setApiSettings({ ...apiSettings, model: e.target.value })}
                                        placeholder="gpt-4o"
                                        autoComplete="off"
                                        name="openai-model"
                                        className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════ 帳號管理 Tab ═══════ */}
                    {activeTab === 'account' && (
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-slate-400" />
                                    <h2 className="font-serif-tc text-base font-medium text-slate-200">後台帳號管理</h2>
                                </div>
                                <button
                                    onClick={saveAccountSettings}
                                    disabled={accountSaving}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition-all duration-200 font-serif-tc"
                                    style={{
                                        background: accountSaved ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.08)',
                                        border: accountSaved ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.18)',
                                        color: accountSaved ? 'rgb(134,239,172)' : 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    {accountSaved ? (
                                        <><CheckCircle2 className="h-3.5 w-3.5" />已儲存</>
                                    ) : accountSaving ? (
                                        <><span className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin" />儲存中</>
                                    ) : (
                                        <><Save className="h-3.5 w-3.5" />儲存變更</>
                                    )}
                                </button>
                            </div>

                            {/* 目前帳號資訊 */}
                            <div className="mb-5 p-3 rounded-xl flex items-center gap-2"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)' }}>
                                <Shield className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                                <p className="text-xs text-slate-500 font-garamond">
                                    目前管理員帳號：<span className="text-slate-300">{getAdminCreds().email}</span>
                                </p>
                            </div>

                            <div className="space-y-5">
                                {/* 新帳號 */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                        管理員帳號（Email）
                                    </Label>
                                    <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        placeholder="admin@gmail.com"
                                        autoComplete="off"
                                        name="new-admin-email"
                                        className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl"
                                    />
                                </div>

                                {/* 分隔線 */}
                                <div className="flex items-center gap-3 opacity-30">
                                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
                                    <span className="text-[10px] text-slate-400 font-garamond tracking-widest uppercase">修改密碼（選填）</span>
                                    <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.3)' }} />
                                </div>

                                {/* 新密碼 */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                        新密碼（留空表示不修改）
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPw ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="最少 6 個字元"
                                            autoComplete="new-password"
                                            name="new-admin-password"
                                            className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl pr-10"
                                        />
                                        <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                            {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* 確認新密碼 */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-slate-500 font-garamond tracking-wider uppercase">
                                        確認新密碼
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPw ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="再次輸入新密碼"
                                            autoComplete="new-password"
                                            name="confirm-admin-password"
                                            className="h-11 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-600 focus:border-white/30 rounded-xl pr-10"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                            {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* 錯誤提示 */}
                                {accountError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-300"
                                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
                                    >
                                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                        {accountError}
                                    </motion.div>
                                )}

                                {/* 注意事項 */}
                                <div className="p-3 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                    <p className="text-[11px] text-slate-600 font-garamond leading-relaxed">
                                        ⚠️ 帳號資訊儲存於瀏覽器 localStorage。變更後，下次登入請使用新帳號密碼。
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════ GitHub Tab ═══════ */}
                    {activeTab === 'github' && (
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Github className="h-4 w-4 text-slate-400" />
                                <h2 className="font-serif-tc text-base font-medium text-slate-200">GitHub 專案</h2>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        title: 'chatgpt-tarot-divination',
                                        description: '主要專案 Repository — ChatGPT 塔羅牌占卜平台',
                                        url: 'https://github.com/dreamhunter2333/chatgpt-tarot-divination',
                                        badge: 'Main Repo',
                                    },
                                    {
                                        title: 'Issues & Feature Requests',
                                        description: '回報問題、提出功能需求，或查看現有的議題討論',
                                        url: 'https://github.com/dreamhunter2333/chatgpt-tarot-divination/issues',
                                        badge: 'Issues',
                                    },
                                    {
                                        title: 'Pull Requests',
                                        description: '查看和提交程式碼貢獻',
                                        url: 'https://github.com/dreamhunter2333/chatgpt-tarot-divination/pulls',
                                        badge: 'PRs',
                                    },
                                ].map(item => (
                                    <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                                        className="group flex items-start justify-between p-4 rounded-xl transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
                                                ; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.22)'
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                                                ; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-serif-tc text-slate-200 group-hover:text-white transition-colors">{item.title}</span>
                                                <span className="text-[10px] font-garamond tracking-widest text-slate-500 px-2 py-0.5 rounded-full"
                                                    style={{ border: '1px solid rgba(255,255,255,0.12)' }}>{item.badge}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 font-garamond leading-relaxed">{item.description}</p>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 ml-3 transition-colors" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                <p className="text-xs text-slate-600 font-garamond text-center leading-relaxed">
                                    如果覺得這個專案對您有幫助<br />
                                    歡迎在 GitHub 上給 ⭐ Star 支持開源
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

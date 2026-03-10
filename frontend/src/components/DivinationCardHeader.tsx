import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LucideIcon, History } from 'lucide-react'
import { motion } from 'framer-motion'

interface DivinationCardHeaderProps {
  title: string
  description: string
  children: ReactNode
  onBack?: () => void
  icon?: LucideIcon
  divinationType?: string
}

export function DivinationCardHeader({
  title,
  description,
  children,
  onBack,
  icon: Icon,
  divinationType,
}: DivinationCardHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 md:space-y-6"
    >
      {/* ── 拱形塔羅牌卡片 ── */}
      <div
        className="relative min-h-[520px] rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        {/* 頂部弧形裝飾光帶 */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
        />

        {/* 拱形頂部 SVG 裝飾框 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] pointer-events-none">
          <svg viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-30">
            <path d="M 0 50 L 0 20 Q 150 -10 300 20 L 300 50" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" fill="none" />
            <rect x="2" y="52" width="296" height="1" fill="rgba(255,255,255,0.3)" />
            {/* 角落裝飾 */}
            <circle cx="5" cy="53" r="2" fill="rgba(255,255,255,0.4)" />
            <circle cx="295" cy="53" r="2" fill="rgba(255,255,255,0.4)" />
            <text x="150" y="48" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="serif">✳ · ✳</text>
          </svg>
        </div>

        {/* 返回按鈕 */}
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="absolute left-3 top-3 md:left-5 md:top-5 gap-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full text-xs border border-transparent hover:border-white/15 z-10 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline tracking-wider">返回</span>
        </Button>

        {/* 歷史記錄按鈕 */}
        {divinationType && (
          <Button
            onClick={() => navigate(`/history/${divinationType}`)}
            variant="ghost"
            size="sm"
            className="absolute right-3 top-3 md:right-5 md:top-5 gap-1 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-full text-xs border border-transparent hover:border-white/15 z-10 transition-all"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline tracking-wider">歷史</span>
          </Button>
        )}

        {/* 標題區域 */}
        <div className="pt-16 pb-6 px-6 text-center">
          {/* 裝飾點列 */}
          <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
            <span className="text-[10px] tracking-[0.4em] text-slate-300 font-garamond">· · ·</span>
            {Icon && <Icon className="h-3.5 w-3.5 text-slate-300" />}
            <span className="text-[10px] tracking-[0.4em] text-slate-300 font-garamond">· · ·</span>
          </div>

          {/* 主標題 */}
          <h2
            className="text-2xl md:text-3xl font-serif-tc font-bold text-gradient-frost mb-2"
            style={{ letterSpacing: '0.06em' }}
          >
            {title}
          </h2>

          {/* 英文副標 */}
          <p className="text-xs md:text-sm font-garamond tracking-arcane text-slate-500 mb-3">
            {title.replace(/\s/g, ' ')} · DIVINATION
          </p>

          {/* 描述點線框 */}
          <div
            className="mx-auto max-w-sm px-4 py-2 rounded-xl mt-2"
            style={{ border: '1px dashed rgba(255,255,255,0.2)' }}
          >
            <p className="text-xs md:text-sm text-slate-400 font-serif-tc leading-relaxed">
              {description}
            </p>
          </div>

          {/* 底部裝飾點列 */}
          <div className="flex items-center justify-center gap-3 mt-5 opacity-30">
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5))' }} />
            <span className="text-[10px] text-slate-400 font-garamond tracking-widest">✦</span>
            <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.5))' }} />
          </div>
        </div>

        {/* 內容區域 */}
        <div className="px-5 md:px-8 pb-8 md:pb-10 flex items-center justify-center min-h-[260px]">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

import { useNavigate } from 'react-router-dom'
import { DIVINATION_OPTIONS } from '@/config/constants'
import { Sparkles, Info } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const item = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
}

// 前三格擴大顯示（對應塔羅三時態：過去、現在、未來）
const FEATURED_COUNT = 3

export default function MarketPage() {
  const navigate = useNavigate()

  const featuredOptions = DIVINATION_OPTIONS.slice(0, FEATURED_COUNT)
  const restOptions = DIVINATION_OPTIONS.slice(FEATURED_COUNT)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 md:space-y-8"
    >
      {/* ── 頁面標題區 ── */}
      <motion.div variants={item} className="text-center py-4">
        {/* 小圓點裝飾 */}
        <div className="flex items-center justify-center gap-3 mb-3 opacity-50">
          <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4))' }} />
          <span className="text-[10px] font-garamond tracking-[0.5em] text-slate-400 uppercase">Free Reading</span>
          <div className="h-px w-16" style={{ background: 'linear-gradient(270deg, transparent, rgba(255,255,255,0.4))' }} />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif-tc font-bold text-gradient-frost mb-2" style={{ letterSpacing: '0.08em' }}>
          塔羅牌占卜指引
        </h1>
        <p className="text-sm md:text-base font-cinzel text-slate-500 tracking-arcane mb-4">
          Tarot Reading Guidance
        </p>

        {/* 三時態圖示（過去・現在・未來） */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mt-4">
          {['過去', '現在', '未來'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex flex-col items-center gap-1"
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                }}
              >
                <span className="text-[9px] font-garamond tracking-widest text-slate-500 uppercase">
                  {['PAST', 'NOW', 'FUTURE'][i]}
                </span>
                <span className="text-xs font-serif-tc text-slate-300">{label}</span>
              </div>
              {i < 2 && (
                <div className="flex gap-0.5 items-center opacity-30">
                  <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                  <div className="w-6 h-px bg-slate-400" />
                  <div className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── 主要占卜選項：前 3 項 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {featuredOptions.map((option) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.key}
              variants={item}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer group"
              onClick={() => navigate(`/divination/${option.key}`)}
            >
              <div
                className="relative rounded-2xl p-5 md:p-6 h-full overflow-hidden transition-all duration-400"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.28)'
                    ; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.2), 0 0 20px rgba(180,210,230,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.14)'
                    ; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)'
                }}
              >
                {/* 頂部光帶 */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                />

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="p-3 rounded-xl flex-shrink-0 transition-all duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    <Icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-serif-tc font-medium text-slate-200 mb-1 leading-tight">
                      {option.label}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 font-serif-tc leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-xs font-garamond tracking-widest text-slate-500 uppercase">
                    Online Divination
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200 transition-colors">
                    <span className="text-xs font-serif-tc">開始占卜</span>
                    <Sparkles className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── 其餘選項：較小卡片 ── */}
      {restOptions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {restOptions.map((option) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.key}
                variants={item}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer group"
                onClick={() => navigate(`/divination/${option.key}`)}
              >
                <div
                  className="relative rounded-xl p-4 h-full overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.22)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.10)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <h3 className="text-sm font-serif-tc font-medium text-slate-300 truncate">
                      {option.label}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 font-serif-tc leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </motion.div>
            )
          })}

          {/* 關於卡片 */}
          <motion.div
            variants={item}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.96 }}
            className="cursor-pointer group"
            onClick={() => navigate('/about')}
          >
            <div
              className="relative rounded-xl p-4 h-full overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px dashed rgba(255,255,255,0.12)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.border = '1px dashed rgba(255,255,255,0.25)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.border = '1px dashed rgba(255,255,255,0.12)'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-slate-500 flex-shrink-0" />
                <h3 className="text-sm font-serif-tc font-medium text-slate-400 truncate">關於占卜</h3>
              </div>
              <p className="text-[11px] text-slate-600 font-serif-tc leading-relaxed">
                瞭解各種占卜方式的起源與含義
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── 底部說明標語 ── */}
      <motion.div variants={item} className="text-center pt-2 pb-4">
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="h-4 w-px bg-white/15" />
          <p className="text-[10px] font-garamond tracking-[0.3em] text-slate-600 uppercase">
            Classic Reading · Guidance from the Major Arcana
          </p>
          <div className="h-4 w-px bg-white/15" />
        </div>
      </motion.div>
    </motion.div>
  )
}

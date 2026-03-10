import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface InlineResultProps {
    result: string
    loading: boolean
    streaming: boolean
}

export function InlineResult({ result, loading, streaming }: InlineResultProps) {
    const resultRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [result])

    if (!result && !loading) return null

    return (
        <div ref={resultRef} className="mt-8 relative group">
            {/* 🔮 能量光暈邊框 */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-purple-500/20 to-indigo-500/20 rounded-2xl blur opacity-75 transition duration-1000 group-hover:opacity-100"></div>

            <div className="relative bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                {/* 標題欄 */}
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-serif-tc text-primary/80 tracking-widest uppercase">占卜指引結果</span>
                    {streaming && (
                        <div className="ml-auto flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                        </div>
                    )}
                </div>

                {/* 內容區域 */}
                {loading && !result ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                        <p className="text-slate-400 font-serif-tc animate-pulse tracking-widest">正在讀取星象與靈能訊息...</p>
                    </div>
                ) : (
                    <div
                        className="prose prose-invert prose-xl max-w-none text-slate-200 leading-relaxed font-serif-tc selection:bg-primary/30"
                        dangerouslySetInnerHTML={{ __html: result }}
                    />
                )}
            </div>
        </div>
    )
}

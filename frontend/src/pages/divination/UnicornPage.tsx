import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { UNICORN_CARDS, UnicornCardData } from '@/config/unicorn_cards'
import { UnicornCard } from '@/components/divination/UnicornCard'
import { Stars, Loader2, RefreshCcw } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const CONFIG = getDivinationOption('unicorn')!

const SUGGESTIONS = [
    {
        category: '工作',
        items: ['面對現在的工作狀況（或未來的職涯發展），獨角獸能給我什麼指引？']
    },
    {
        category: '感情',
        items: [
            '單身狀態：「為了吸引一段健康美好的感情，我現在最需要做什麼準備或改變？」',
            '有伴侶狀態：「在這段關係中，有什麼建議能幫助我們溝通得更順暢、關係更和諧？」'
        ]
    },
    {
        category: '生活指引',
        items: [
            '「請給我今天（或本週）的整體能量與生活指引。」',
            '「獨角獸現在最想傳達給我的一句話是什麼？」'
        ]
    }
]

export default function UnicornPage() {
    const [prompt, setPrompt] = useLocalStorage('unicorn_prompt', '')
    const [selectedCard, setSelectedCard] = useState<UnicornCardData | null>(null)
    const [isFlipped, setIsFlipped] = useState(false)
    const resultRef = useRef<HTMLDivElement>(null)

    const { result, loading, resultLoading, streaming, onSubmit } = useDivination('unicorn')

    const pickCard = () => {
        const randomCard = UNICORN_CARDS[Math.floor(Math.random() * UNICORN_CARDS.length)]
        setSelectedCard(randomCard)
        return randomCard
    }

    const handleSubmit = async () => {
        if (loading) return

        setIsFlipped(false)

        setTimeout(() => {
            const card = pickCard()
            const finalPrompt = `${prompt || '我此刻需要什麼指引？'}｜${card.name}｜${card.meaning}｜${card.image}`

            onSubmit({ prompt: finalPrompt })

            // 延長到 3 秒後才翻牌
            setTimeout(() => {
                setIsFlipped(true)
            }, 3000)
        }, 300)
    }

    const handleReset = () => {
        setIsFlipped(false)
        setSelectedCard(null)
        setPrompt('')
    }

    // 結果更新時自動滾動到結果區
    useEffect(() => {
        if (result && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [result])

    return (
        <DivinationCardHeader
            title={CONFIG.title}
            description={CONFIG.description}
            icon={CONFIG.icon}
            divinationType="unicorn"
        >
            <div className="w-full max-w-2xl mx-auto pb-16 space-y-6">

                {/* 翻牌區域 */}
                <div className="flex flex-col items-center">
                    <UnicornCard
                        isFlipped={isFlipped}
                        cardImage={selectedCard?.image}
                        cardName={selectedCard?.name}
                        onClick={!isFlipped ? handleSubmit : undefined}
                    />

                    {!isFlipped && !loading && (
                        <p className="text-sm text-purple-300/60 animate-pulse mb-4 font-serif-tc">
                            點擊上方牌卡或下方按鈕開始召喚
                        </p>
                    )}
                </div>

                {/* 輸入區 */}
                <div className="space-y-2 px-4 md:px-0">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="例如：我此刻需要什麼指引？"
                            maxLength={100}
                            rows={3}
                            className="relative resize-none w-full bg-slate-900/50 border-white/10 focus:border-purple-500/50 text-slate-200 placeholder:text-slate-600 rounded-xl"
                        />
                    </div>
                    <p className="text-xs text-slate-500 text-center tracking-widest font-serif-tc">
                        訴說你的困擾，讓獨角獸的光引領你
                    </p>
                </div>

                {/* 提示詞建議 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 md:px-0">
                    {SUGGESTIONS.map((group) => (
                        <div key={group.category} className="space-y-2">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold font-serif-tc opacity-70 mb-1">
                                {group.category}
                            </h4>
                            <div className="flex flex-col gap-1.5">
                                {group.items.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPrompt(item)}
                                        className="text-left text-[12px] leading-snug p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-500/10 hover:border-purple-500/20 text-slate-400 hover:text-purple-200 transition-all duration-300 ring-offset-slate-900"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 按鈕區 */}
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                    <Button
                        onClick={handleReset}
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        title="清除內容"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 md:flex-initial md:min-w-[160px] h-11 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-none text-white rounded-full shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                召喚能量中
                            </>
                        ) : (
                            <>
                                <Stars className="h-4 w-4 mr-2" />
                                抽牌
                            </>
                        )}
                    </Button>
                </div>

                {/* 占卜結果 — 內嵌顯示 */}
                {(result || resultLoading) && (
                    <div ref={resultRef} className="mx-4 md:mx-0 mt-6">
                        <div className="relative rounded-2xl overflow-hidden">
                            {/* 光暈邊框 */}
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/30 via-indigo-500/20 to-pink-500/20 rounded-2xl blur"></div>
                            <div className="relative bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                {/* 標題 */}
                                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                                    <span className="text-purple-400">✦</span>
                                    <span className="text-sm font-serif-tc text-purple-300 tracking-widest">獨角獸的指引</span>
                                    {streaming && (
                                        <span className="ml-auto flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </span>
                                    )}
                                </div>

                                {/* 結果內容 */}
                                {resultLoading && !result ? (
                                    <div className="flex items-center gap-3 text-slate-400 py-4">
                                        <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                                        <span className="font-serif-tc text-sm">召喚獨角獸的智慧中…</span>
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-invert prose-xl max-w-none text-slate-300 leading-relaxed font-serif-tc"
                                        dangerouslySetInnerHTML={{ __html: result }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DivinationCardHeader>
    )
}

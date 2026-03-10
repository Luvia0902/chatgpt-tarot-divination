import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2 } from 'lucide-react'

const CONFIG = getDivinationOption('tarot')!

export default function TarotPage() {
  const [prompt, setPrompt] = useLocalStorage('prompt', '')
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('tarot')

  const handleSubmit = () => {
    onSubmit({
      prompt: prompt || '我的財務狀況如何',
    })
  }

  return (
    <DivinationCardHeader
      title={CONFIG.title}
      description={CONFIG.description}
      icon={CONFIG.icon}
      divinationType="tarot"
    >
      <div className="w-full max-w-2xl mx-auto pb-12">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="我的財務狀況如何"
              maxLength={100}
              rows={3}
              className="relative resize-none w-full bg-slate-900/50 border-white/10 focus:border-primary/50 text-slate-200 placeholder:text-slate-600 rounded-xl"
            />
          </div>
          <p className="text-xs text-slate-500 text-center tracking-widest font-serif-tc">
            請輸入您想要占卜的問題，讓塔羅牌為您指點迷津
          </p>
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 border-none text-white rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                命運感應中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                開始抽牌占卜
              </>
            )}
          </Button>
        </div>

        <InlineResult
          result={result}
          loading={resultLoading}
          streaming={streaming}
        />
      </div>
    </DivinationCardHeader>
  )
}

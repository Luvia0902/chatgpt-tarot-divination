import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2, Moon } from 'lucide-react'

const CONFIG = getDivinationOption('dream')!

export default function DreamPage() {
  const [prompt, setPrompt] = useLocalStorage('dream_prompt', '')
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('dream')

  const handleSubmit = () => {
    onSubmit({
      prompt: prompt,
    })
  }

  return (
    <DivinationCardHeader
      title={CONFIG.title}
      description={CONFIG.description}
      icon={CONFIG.icon}
      divinationType="dream"
    >
      <div className="max-w-2xl mx-auto pb-12 space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="請詳細描述您的夢境..."
              maxLength={200}
              rows={4}
              className="relative resize-none w-full bg-slate-900/50 border-white/10 focus:border-indigo-500/50 text-slate-200 placeholder:text-slate-600 rounded-xl"
            />
          </div>
          <p className="text-xs text-slate-500 text-center tracking-widest font-serif-tc flex items-center justify-center gap-2">
            <Moon className="h-3 w-3" /> 周公解夢：潛意識的私語，靈性的指引
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none text-white rounded-full shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                潛意識破解中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                解析夢境含義
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

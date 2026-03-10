import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2, User } from 'lucide-react'

const CONFIG = getDivinationOption('name')!

export default function NamePage() {
  const [prompt, setPrompt] = useLocalStorage('name_prompt', '')
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('name')

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
      divinationType="name"
    >
      <div className="max-w-2xl mx-auto pb-12 space-y-6">
        <div className="space-y-4">
          <div className="relative group max-w-sm mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-teal-500/50" />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="輸入完整姓名"
                maxLength={20}
                className="pl-10 bg-slate-900/50 border-white/10 text-slate-200 focus:border-teal-500/50 text-center text-lg h-12 rounded-xl"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center tracking-widest font-serif-tc">
            賜子千金，不如教子一藝；教子一藝，不如賜子好名
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 border-none text-white rounded-full shadow-lg shadow-teal-500/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                靈感激盪中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                測算姓名玄機
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

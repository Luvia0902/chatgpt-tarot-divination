import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2, Heart } from 'lucide-react'

const CONFIG = getDivinationOption('fate')!

export default function FatePage() {
  const [fate, setFate] = useLocalStorage('fate_body', {
    name1: '',
    name2: '',
  })
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('fate')

  const handleSubmit = () => {
    onSubmit({
      prompt: `${fate.name1} ${fate.name2}`,
      fate: fate,
    })
  }

  return (
    <DivinationCardHeader
      title={CONFIG.title}
      description={CONFIG.description}
      icon={CONFIG.icon}
      divinationType="fate"
    >
      <div className="max-w-2xl mx-auto pb-12 space-y-8">
        <div className="text-center space-y-2">
          <h4 className="font-serif-tc text-xl text-primary/90 tracking-widest">緣分是天定的，幸福是自己的</h4>
          <p className="text-sm text-slate-500 font-serif-tc">輸入姓名，點擊一鍵預測，預知您與 TA 的緣分契合度</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block opacity-20">
            <Heart className="h-16 w-16 text-primary fill-primary animate-pulse" />
          </div>

          <div className="space-y-3 relative group">
            <Label className="text-primary/70 tracking-widest block pl-1">姓名 1</Label>
            <Input
              value={fate.name1}
              onChange={(e) => setFate({ ...fate, name1: e.target.value })}
              maxLength={20}
              placeholder="輸入您的姓名"
              className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 text-center text-lg h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3 relative group">
            <Label className="text-primary/70 tracking-widest block pl-1">姓名 2</Label>
            <Input
              value={fate.name2}
              onChange={(e) => setFate({ ...fate, name2: e.target.value })}
              maxLength={20}
              placeholder="輸入對方的姓名"
              className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 text-center text-lg h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-rose-500 to-primary hover:from-rose-400 hover:to-primary/90 border-none text-white rounded-full shadow-lg shadow-rose-500/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                情絲交織中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                預測愛情緣分
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

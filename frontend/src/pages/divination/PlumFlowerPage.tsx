import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2, Hash } from 'lucide-react'

const CONFIG = getDivinationOption('plum_flower')!

export default function PlumFlowerPage() {
  const [plumFlower, setPlumFlower] = useLocalStorage('plum_flower', {
    num1: 0,
    num2: 0,
  })
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('plum_flower')

  const handleSubmit = () => {
    onSubmit({
      prompt: `${plumFlower.num1} ${plumFlower.num2}`,
      plum_flower: plumFlower,
    })
  }

  return (
    <DivinationCardHeader
      title={CONFIG.title}
      description={CONFIG.description}
      icon={CONFIG.icon}
      divinationType="plum_flower"
    >
      <div className="max-w-2xl mx-auto pb-12 space-y-8">
        <div className="text-center space-y-2">
          <h4 className="font-serif-tc text-xl text-primary/90 tracking-widest">梅花易數：觀物起卦，斷事如神</h4>
          <p className="text-sm text-slate-500 font-serif-tc">請隨機輸入兩個 0-1000 的數字，由象數推演乾坤</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
          <div className="space-y-3 relative group">
            <Label className="text-primary/70 tracking-widest block pl-1 flex items-center gap-2">
              <Hash className="h-4 w-4" /> 數字一
            </Label>
            <Input
              type="number"
              min={0}
              max={1000}
              value={plumFlower.num1 || ''}
              onChange={(e) =>
                setPlumFlower({ ...plumFlower, num1: parseInt(e.target.value) || 0 })
              }
              className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 text-center text-2xl h-16 rounded-xl font-serif-tc"
              placeholder="0-1000"
            />
          </div>

          <div className="space-y-3 relative group">
            <Label className="text-primary/70 tracking-widest block pl-1 flex items-center gap-2">
              <Hash className="h-4 w-4" /> 數字二
            </Label>
            <Input
              type="number"
              min={0}
              max={1000}
              value={plumFlower.num2 || ''}
              onChange={(e) =>
                setPlumFlower({ ...plumFlower, num2: parseInt(e.target.value) || 0 })
              }
              className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 text-center text-2xl h-16 rounded-xl font-serif-tc"
              placeholder="0-1000"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-amber-600 to-primary hover:from-amber-500 hover:to-primary/90 border-none text-white rounded-full shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                象數起卦中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                推演易數吉凶
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

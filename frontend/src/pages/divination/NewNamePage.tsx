import { useState, useEffect } from 'react'
import { Solar } from 'lunar-javascript'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { InlineResult } from '@/components/divination/InlineResult'
import { useDivination } from '@/hooks/useDivination'
import { useLocalStorage } from '@/hooks'
import { getDivinationOption } from '@/config/constants'
import { Sparkles, Loader2, Baby, Calendar, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

const CONFIG = getDivinationOption('new_name')!

export default function NewNamePage() {
  const [birthday, setBirthday] = useLocalStorage('birthday', '2000-08-17T00:00')
  const [sex, setSex] = useState('')
  const [surname, setSurname] = useState('')
  const [newNamePrompt, setNewNamePrompt] = useState('')
  const [lunarBirthday, setLunarBirthday] = useState('')
  const { result, loading, resultLoading, streaming, onSubmit } =
    useDivination('new_name')

  const computeLunarBirthday = (birthdayStr: string) => {
    try {
      const date = new Date(birthdayStr)
      const solar = Solar.fromYmdHms(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
      setLunarBirthday(solar.getLunar().toFullString())
    } catch (error) {
      console.error(error)
      setLunarBirthday('轉換失敗')
    }
  }

  useEffect(() => {
    computeLunarBirthday(birthday)
  }, [birthday])

  const handleSubmit = () => {
    if (!surname || !sex) {
      toast.error('請填寫姓氏和性別')
      return
    }

    const date = new Date(birthday)
    const formattedBirthday = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0') + ' ' +
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0')

    onSubmit({
      prompt: `${surname} ${sex} ${formattedBirthday}`,
      birthday: formattedBirthday,
      new_name: {
        surname,
        sex,
        birthday: formattedBirthday,
        new_name_prompt: newNamePrompt,
      },
    })
  }

  return (
    <DivinationCardHeader
      title={CONFIG.title}
      description={CONFIG.description}
      icon={CONFIG.icon}
      divinationType="new_name"
    >
      <div className="max-w-2xl mx-auto pb-12 space-y-8">
        <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 backdrop-blur-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-primary/70 tracking-widest flex items-center gap-2">
                <UserCircle className="h-4 w-4" /> 姓氏
              </Label>
              <Input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="請輸入姓氏"
                maxLength={2}
                className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 h-11"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-primary/70 tracking-widest flex items-center gap-2">
                性格性別
              </Label>
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 h-11">
                  <SelectValue placeholder="請選擇性別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-primary/70 tracking-widest flex items-center gap-2">
              <Calendar className="h-4 w-4" /> 出生日期與時間
            </Label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                type="datetime-local"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 h-11"
              />
              <span className="text-xs text-slate-500 font-serif-tc shrink-0">農曆：{lunarBirthday}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-primary/70 tracking-widest flex items-center gap-2">
              <Baby className="h-4 w-4" /> 附加要求（如：五行喜水、寓意高遠）
            </Label>
            <Input
              value={newNamePrompt}
              onChange={(e) => setNewNamePrompt(e.target.value)}
              maxLength={40}
              placeholder="例如：希望名字帶水，或者避開某些字"
              className="bg-slate-900/50 border-white/10 text-slate-200 focus:border-primary/50 h-11"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-none text-white rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                文曲星感應中
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                開啟好名分析
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

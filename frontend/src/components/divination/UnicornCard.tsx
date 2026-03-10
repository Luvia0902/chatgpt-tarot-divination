import { motion } from 'framer-motion'

interface UnicornCardProps {
    isFlipped: boolean
    cardImage?: string
    cardName?: string
    onClick?: () => void
}

export function UnicornCard({ isFlipped, cardImage, cardName, onClick }: UnicornCardProps) {
    return (
        <div
            className="relative w-48 h-72 md:w-56 md:h-80 cursor-pointer perspective-1000 mx-auto my-8"
            onClick={onClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Front (Back of card initially) */}
                <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-800 flex items-center justify-center">
                    <img
                        src="/images/unicorn/back.jpg"
                        alt="Card Back"
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Unicorn+Back'
                        }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                            <div className="w-12 h-12 rounded-full border-2 border-purple-400/50 animate-pulse flex items-center justify-center">
                                <span className="text-purple-300 text-xs font-serif-tc tracking-widest">能量</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back (Front of card when flipped) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 border-purple-400/30 shadow-2xl bg-white"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    {cardImage ? (
                        <img
                            src={`/images/unicorn/${cardImage}`}
                            alt={cardName || "Unicorn Card"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=Card+Image'
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <span className="text-slate-400 text-sm">讀取中...</span>
                        </div>
                    )}
                    {cardName && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm p-2 text-center text-white text-xs font-medium">
                            {cardName}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

'use client'

import Image from 'next/image'

export default function Splash() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05110d]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/20 blur-2xl" />
          <Image
            src="/icon-512.png"
            alt="StackBoard"
            width={120}
            height={120}
            className="relative h-28 w-28 rounded-[1.8rem] object-cover shadow-[0_0_40px_rgba(16,185,129,0.28)]"
            priority
          />
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.34em] text-emerald-300/75">
          StackBoard
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-[0.18em] text-white">
          STACKBOARD
        </h1>

        <p className="mt-3 text-sm text-white/45">
          Loading your stack...
        </p>

        <div className="mt-8 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
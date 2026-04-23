export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05110d] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/20 border-t-emerald-400" />
        <p className="mt-6 text-sm uppercase tracking-[0.28em] text-emerald-300/75">
          Loading
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
          読み込み中...
        </h1>
      </div>
    </div>
  )
}
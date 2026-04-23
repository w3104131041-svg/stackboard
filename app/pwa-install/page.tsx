export default function PwaInstallPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
          APP INSTALL
        </p>
        <h1 className="mt-4 text-4xl font-semibold">ホーム画面に追加</h1>
        <p className="mt-4 text-white/60">
          iPhoneではSafariの共有メニューからホーム画面に追加できます。
        </p>
      </div>

      <div className="soft-card rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-lg font-semibold">iPhone の場合</p>
          <ol className="mt-3 space-y-2 text-white/70">
            <li>1. Safari でこのサイトを開く</li>
            <li>2. 画面下の「共有」ボタンを押す</li>
            <li>3. 「ホーム画面に追加」を押す</li>
            <li>4. 右上の「追加」で完了</li>
          </ol>
        </div>

        <div className="rounded-xl bg-black/20 p-4 text-sm text-white/60">
          追加後は、アプリのようにホーム画面から直接開けます。
        </div>
      </div>
    </div>
  )
}
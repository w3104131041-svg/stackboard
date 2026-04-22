export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">管理画面</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <a
          href="/admin/events/new"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold">開催管理</h2>
          <p className="mt-2 text-sm text-white/60">
            開催の作成・編集・参加者管理
          </p>
        </a>

        <a
          href="/admin/results"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold">結果入力</h2>
          <p className="mt-2 text-sm text-white/60">
            収支・順位の入力
          </p>
        </a>

        <a
          href="/rankings"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
        >
          <h2 className="text-xl font-semibold">ランキング</h2>
          <p className="mt-2 text-sm text-white/60">
            現在のランキング確認
          </p>
        </a>
      </div>
    </div>
  )
}
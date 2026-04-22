import { createClient } from '@/lib/supabase/server'
import ParticipantForm from './participant-form'

async function getMembers() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .eq('is_active', true)

  return data ?? []
}

async function getEventParticipants(eventId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('event_participants')
    .select('user_id')
    .eq('event_id', eventId)

  return (data ?? []).map((row) => row.user_id)
}

export default async function EventParticipantsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [members, selectedIds] = await Promise.all([
    getMembers(),
    getEventParticipants(id),
  ])

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold">参加者登録</h1>

      <ParticipantForm
        eventId={id}
        members={members}
        defaultSelectedIds={selectedIds}
      />
    </div>
  )
}
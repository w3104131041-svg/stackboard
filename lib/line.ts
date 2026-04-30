export async function sendLineMessage(message: string) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const to = process.env.LINE_GROUP_ID

  if (!token || !to) {
    console.warn('LINE env is missing')
    return
  }

  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('LINE push failed:', text)
  }
}
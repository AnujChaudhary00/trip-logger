const DEVICE_ID_KEY = 'dtl_device_id'

export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''

  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) return existing

  const newId = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, newId)
  return newId
}

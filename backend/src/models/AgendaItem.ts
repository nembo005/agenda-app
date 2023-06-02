export interface AgendaItem {
  userId: string
  agendaId: string
  createdAt: string
  topic: string
  description: string
  dueDate: string
  complete: boolean
  attachmentUrl?: string
}

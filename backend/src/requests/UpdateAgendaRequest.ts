/**
 * Fields in a request to update a single Agenda item.
 */
export interface UpdateAgendaRequest {
  topic: string
  description: string
  dueDate: string
  complete: boolean
}
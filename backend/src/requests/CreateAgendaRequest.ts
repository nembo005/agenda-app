/**
 * Fields in a request to create a single Agenda item.
 */
export interface CreateAgendaRequest {
  topic: string
  description: string
  dueDate: string
}

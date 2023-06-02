import { apiEndpoint } from '../config'
import { Agenda } from '../types/Agenda';
import { CreateAgendaRequest } from '../types/CreateAgendaRequest';
import Axios from 'axios'
import { UpdateAgendaRequest } from '../types/UpdateAgendaRequest';

export async function getAgendas(idToken: string): Promise<Agenda[]> {
  console.log('Fetching agendas')

  const response = await Axios.get(`${apiEndpoint}/agendas`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Agendas:', response.data)
  return response.data.items
}

export async function createAgenda(
  idToken: string,
  newAgenda: CreateAgendaRequest
): Promise<Agenda> {
  const response = await Axios.post(`${apiEndpoint}/agendas`,  JSON.stringify(newAgenda), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchAgenda(
  idToken: string,
  agendaId: string,
  updatedAgenda: UpdateAgendaRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/agendas/${agendaId}`, JSON.stringify(updatedAgenda), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteAgenda(
  idToken: string,
  agendaId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/agendas/${agendaId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  agendaId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/agendas/${agendaId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

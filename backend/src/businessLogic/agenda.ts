import { AgendaAccess } from '../helpers/agendasAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { AgendaItem } from '../models/AgendaItem'
import { CreateAgendaRequest } from '../requests/CreateAgendaRequest'
import { UpdateAgendaRequest } from '../requests/UpdateAgendaRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const agenda_access = new AgendaAccess()
const logger  = createLogger("Agendas Logger: ")
const attachmentUtils = new AttachmentUtils()

export async function getAgendasForUser(userId:string):Promise<AgendaItem[]> {
    try {
        return await agenda_access.getAgendasForUser(userId)
    } catch (error) {
        logger.error("Error getting agenda items: ", {error: createError(error.message)});
        
    }
    
}

export async function createAgenda(
    userId:string,
    newAgenda:CreateAgendaRequest
    ): Promise<AgendaItem>{
        const id: uuid = uuid.v4()
        const currentDate = Date.now()
        const url = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${userId}-${id}`
        const item: AgendaItem = {
            userId: userId,
            agendaId: id,
            createdAt: currentDate.toString(),
            topic: newAgenda.topic,
            description: newAgenda.description,
            dueDate: newAgenda.dueDate,
            complete: false,
            attachmentUrl: url
        }

        try {
            return await agenda_access.createAgenda(item)
        } catch (error){
            logger.error("Error creating agenda item: ", {error: createError(error.message)});
        } 
}

export async function updateAgenda(userId:string, agendaId:string, updatedAgenda:UpdateAgendaRequest): Promise<UpdateAgendaRequest> {
    try{
        return agenda_access.updateAgenda(userId, agendaId, updatedAgenda)
    } catch(error){
        logger.error("Error updating agenda Item", {error: createError(error.message)})
    }
}

export async function deleteAgenda(userId:string, agendaId:string) {
    try{
        return agenda_access.deleteAgenda(userId, agendaId)
    } catch(error){
        logger.error("Unable to delete agenda Item", {error: createError(error.message)})
    }
}

export async function createAttachmentPresignedUrl(userId:string, agendaId:string): Promise<string> {
    try{
        return attachmentUtils.generateUploadUrl(userId, agendaId)
    } catch(error){
        logger.error("Error generating presigned URL", {error: createError(error.message)})
    }
}
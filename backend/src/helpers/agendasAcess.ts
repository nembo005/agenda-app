import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { AgendaItem } from '../models/AgendaItem'
import { AgendaUpdate } from '../models/AgendaUpdate';
import { UpdateAgendaRequest } from '../requests/UpdateAgendaRequest'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AgendasAccess')

// TODO: Implement the dataLayer logic
export class AgendaAccess {
    constructor(
        private readonly client: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly table: string = process.env.TABLE
    ){}
   
   // Get agendas for logged user and return list of agendas 
   getAgendasForUser = async (userId:string): Promise<AgendaItem[]> => {
        logger.info("Get Agendas for logged user ...")
        const res = await this.client.query({
            TableName: this.table,
            IndexName: process.env.CREATED_AT_INDEX,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {':userId': userId}
        }).promise()

        const items = res.Items
        return items as AgendaItem[]
   }

   // Create Agenda Items
   createAgenda = async (newAgenda:AgendaItem):Promise<AgendaItem> => {
        logger.info("Creating new Agenda Item ...")
        await this.client.put({
            TableName: this.table,
            Item: newAgenda
        }).promise()

        return newAgenda
   }

    // Update agenda items
    updateAgenda = async ( 
            userId:string, 
            agendaId:string, 
            updatedAgenda:UpdateAgendaRequest
        ): Promise<AgendaUpdate> => {
            logger.info("Updating agenda item ...")
            const updatedItem = await this.client.update({
                TableName: this.table,
                Key: {"userId": userId, "agendaId": agendaId},
                ExpressionAttributeNames: {
                    "#agendaName": "topic",
                    "#description": "description",
                    "#dueDate": "dueDate",
                    "#complete": "complete"
                },
                UpdateExpression: "SET #agendaName = :topic, \
                                        #description= :description, \
                                        #dueDate = :dueDate, \
                                        #complete = :complete",
                ExpressionAttributeValues: {
                    ":topic": updatedAgenda.topic,
                    ":description": updatedAgenda.description,
                    ":dueDate": updatedAgenda.dueDate,
                    ":complete": updatedAgenda.complete
                },
                ReturnValues: "UPDATED_NEW"
            }).promise()

            return updatedItem.Attributes as AgendaUpdate
        }

    deleteAgenda = async (userId:string, agendaId:string) => {
        await this.client.delete({
            TableName: this.table,
            Key: {"userId": userId, "agendaId": agendaId}
        }).promise()
    }
}


import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteAgenda } from '../../businessLogic/agenda'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const agendaId = event.pathParameters.agendaId
    // TODO: Remove a Agenda item by id
    await deleteAgenda(getUserId(event), agendaId)
    return {
      statusCode: 204,
      body: JSON.stringify({
        agendaId: agendaId,
        message: `Agenda id: ${agendaId}, deleted.`
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
      headers: true,
      origin: '*'
    })
  )

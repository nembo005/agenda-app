import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateAgenda } from '../../businessLogic/agenda'
import { UpdateAgendaRequest } from '../../requests/UpdateAgendaRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const agendaId = event.pathParameters.agendaId
    const updatedAgenda: UpdateAgendaRequest = JSON.parse(event.body)
    // TODO: Update a Agenda item with the provided id using values in the "updatedAgenda" object
    const id = getUserId(event)
    const updatedItem = await updateAgenda(id, agendaId, updatedAgenda)

    return {
      statusCode: 201,
      body: JSON.stringify({
        updatedItem
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

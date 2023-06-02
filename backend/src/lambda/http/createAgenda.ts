import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateAgendaRequest } from '../../requests/CreateAgendaRequest'
import { getUserId } from '../utils';
import { createAgenda } from '../../businessLogic/agenda'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newAgenda: CreateAgendaRequest = JSON.parse(event.body)
    // TODO: Implement creating a new Agenda item
    const item = await createAgenda(getUserId(event), newAgenda)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: item
      })
    }
  }
)

handler.use(
  cors({
    credentials: true,
    headers: true,
    origin: '*'
  })
)

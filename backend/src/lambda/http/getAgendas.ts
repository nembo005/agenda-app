import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAgendasForUser as getAgendasForUser } from '../../businessLogic/agenda'
import { getUserId } from '../utils';

// TODO: Get all Agenda items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const agendas = await getAgendasForUser(getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: agendas
      })
    }
})

handler.use(
  cors({
    credentials: true,
    headers: true,
    origin: '*'
  })
)

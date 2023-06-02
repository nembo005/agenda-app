import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/agenda'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const agendaId = event.pathParameters.agendaId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const id = getUserId(event)
    const presignedUrl = await createAttachmentPresignedUrl(id, agendaId)

    return { 
      statusCode: 200, 
      body: JSON.stringify({
        'uploadUrl': presignedUrl
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

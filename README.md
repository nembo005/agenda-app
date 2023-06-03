# Serverless AGENDA

To implement this project, you need to implement a simple AGENDA application using AWS Lambda and Serverless framework. This AGENDA app will allow us to set a topic and a description of a meeting event and a due date to which the event should be held. We can also set if the event is complete or not using a check box..

# Functionality of the application

This application will allow creating/removing/updating/fetching AGENDA items. Each AGENDA item can optionally have an attachment image. Each user only has access to AGENDA items that he/she has created.

# AGENDA items

In the AGENDA application, the Agenda items contain the following fields:

* `agendaId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `topic` (string) - topic of a AGENDA item (e.g. "Board Meeting")
* `description ` (string) - description of the AGENDA item
* `dueDate` (string) - date and time by which an item should be completed
* `complete` (boolean) - true if an agenda was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a AGENDA item

You might also store an id of a user who created a AGENDA item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@latest
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions involved in the application

In this project, the following functions are implemented and are configure in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that is to all other functions.

* `GetAgendas` - returns all AGENDAs for a current user. A user id is extracted from a JWT token that is sent by the frontend

It returns data that looks like this:

```json
{
  "items": [
    {
      "agendaId": "001",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "topic": "Board Meeting",
      "description":"Meeting on Zoom link http://zoom.com/xyz Register before due date.",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "complete": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "agendaId": "002",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "topic": "Cloud Computing Class",
      "description":"Cloud computing lesson on deploying sererless applications.",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "complete": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateAgenda` - creates a new AGENDA for a current user. A shape of data send by a client application to this function can is found in the `CreateAgendaRequest.ts` file

It receives a new AGENDA item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "topic": "Board Meeting",
  "description":"Meeting on Zoom link http://zoom.com/xyz Register before due date.",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "complete": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new AGENDA item that looks like this:

```json
{
  "item": {
    "agendaId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "topic": "Board Meeting",
    "description":"Meeting on Zoom link http://zoom.com/xyz Register before due date.",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "complete": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateAgenda` - updates an AGENDA item created by a current user. A shape of data send by a client application to this function is found in the `UpdateAgendaRequest.ts` file

It receives an object that contains three fields that can be updated in a AGENDA item:

```json
{
  "topic": "General Meeting",
  "description":"Meeting on Zoom link http://zoom.com/abc Register before due date.",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "complete": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It returns an empty body.

* `DeleteAgenda` - deletes an AGENDA item created by a current user. Expects an id of a AGENDA item to remove.

It returns an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a AGENDA item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-topic.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend works with the serverless application once it is developed. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was complete in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in this application, I created an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. I used asymmetrically encrypted JWT tokens.

# Best practices

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# Suggestions

To store AGENDA items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml

AgendasTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.AGENDAS_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless AGENDA application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was complete in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")

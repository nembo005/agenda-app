import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const s3 = new XAWS.S3({signatureVersion: 'v4'})

export class AttachmentUtils {
    constructor(
        private readonly s3bucket: string = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expirationTime: string = process.env.SIGNED_URL_EXPIRATION
    ){}

    generateUploadUrl = async (userId:string, agendaId:string): Promise<string> => {
        const presignedUrl:string = await s3.getSignedUrl('putObject', {
            Bucket: this.s3bucket,
            Key: `${userId}-${agendaId}`,
            Expires: parseInt(this.expirationTime)
        })

        return presignedUrl
    }
}
import { APIGatewayEvent } from 'aws-lambda'
import qs from 'qs'

type Body = { [key: string]: any }

function extractContentType(event: APIGatewayEvent) {
  const contentType = event.headers ? event.headers['Content-Type'] : undefined
  return contentType
}

function extractPostBody(event: APIGatewayEvent): Body | undefined {
  const contentType = extractContentType(event)
  if (event.body && contentType === 'application/json') {
    const body = JSON.parse(event.body)
    return body
  }
  return undefined
}

function extractPostForm(event: APIGatewayEvent): Body | undefined {
  const contentType = extractContentType(event)
  if (event.body && contentType === 'application/x-www-form-urlencoded') {
    const body = qs.parse(event.body)
    return body
  }
  return undefined
}

function extractQueryString(event: APIGatewayEvent): Body | undefined {
  if (event.queryStringParameters) {
    return { ...event.queryStringParameters }
  }
  return undefined
}

function extractPathParameters(event: APIGatewayEvent): Body | undefined {
  if (event.pathParameters) {
    return { ...event.pathParameters }
  }
  return undefined
}

export function mergeBody(event: APIGatewayEvent) {
  const bodyList = [
    extractPostBody(event),
    extractPostForm(event),
    extractQueryString(event),
    extractPathParameters(event)
  ]

  let obj: Body = {}
  for (const body of bodyList) {
    if (body) {
      obj = Object.assign(obj, body)
    }
  }
  return obj
}

interface RequestOptions<T> {
  body: T
  userAgent?: string | null
  ip?: string
}

export class BaseRequest<T extends object> {
  public readonly body: T
  public readonly userAgent: string
  public readonly ip: string

  constructor(opts: RequestOptions<T>) {
    this.body = opts.body
    this.userAgent = opts.userAgent || ''
    this.ip = opts.ip || '127.0.0.1'
  }

  public static fromEvent<T extends object>(opts: { event: APIGatewayEvent; body: T }) {
    const { event, body } = opts
    return new BaseRequest<T>({
      body,
      ip: event.requestContext.identity.sourceIp,
      userAgent: event.requestContext.identity.userAgent
    })
  }
}

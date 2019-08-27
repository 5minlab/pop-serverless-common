import { APIGatewayEvent } from 'aws-lambda'

export function mergeBody(event: APIGatewayEvent) {
  let obj: { [key: string]: any } = {}

  // POST
  if (event.body) {
    const body = JSON.parse(event.body)
    obj = { ...obj, ...body }
  }

  // GET
  if (event.queryStringParameters) {
    for (const key of Object.keys(event.queryStringParameters)) {
      const val = event.queryStringParameters[key]
      obj[key] = val
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

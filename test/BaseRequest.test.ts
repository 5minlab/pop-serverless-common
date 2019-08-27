import { APIGatewayEvent } from 'aws-lambda'
import { mergeBody, BaseRequest } from '../src/BaseRequest'

describe('mergeBody', () => {
  it('GET', () => {
    const data = { name: 'foo' }
    const event: Partial<APIGatewayEvent> = {
      httpMethod: 'GET',
      queryStringParameters: data
    }
    const body = mergeBody(event as APIGatewayEvent)
    expect(body).toEqual(data)
  })

  it('POST', () => {
    const data = { name: 'foo' }
    const event: Partial<APIGatewayEvent> = {
      httpMethod: 'POST',
      body: JSON.stringify(data)
    }
    const body = mergeBody(event as APIGatewayEvent)
    expect(body).toEqual(data)
  })
})

describe('BaseRequest#', () => {
  const skeleton: Partial<APIGatewayEvent> = {
    body: JSON.stringify({ name: 'foo' }),
    requestContext: {
      httpMethod: 'POST',
      identity: {
        sourceIp: '127.0.0.1',
        userAgent: 'sample-user-agent',
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        user: null,
        userArn: null
      },
      accountId: '',
      apiId: '',
      path: '',
      stage: '',
      requestId: '',
      requestTimeEpoch: 0,
      resourceId: '',
      resourcePath: ''
    }
  }

  it('fromEvent', () => {
    const event = {
      ...skeleton
    }
    const body = mergeBody(event as APIGatewayEvent)
    const req = BaseRequest.fromEvent({
      event: event as APIGatewayEvent,
      body
    })

    expect(req.body).toEqual(body)
    expect(req.userAgent).toEqual('sample-user-agent')
    expect(req.ip).toEqual('127.0.0.1')
  })

  it('constructor', () => {
    const req = new BaseRequest({
      body: { name: 'foo' }
    })
  })
})

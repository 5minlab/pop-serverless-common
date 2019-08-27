import { APIGatewayProxyResult } from 'aws-lambda'

const errorStatusTable = new Map<string, number>([
  ['ValidationError', 400],
  ['JsonWebTokenError', 400]
])

function extractStatusCode(e: any) {
  if (typeof e.status === 'number') {
    return e.status
  } else if (typeof e.statusCode === 'number') {
    return e.statusCode
  }

  const found = errorStatusTable.get(e.name)
  if (found) {
    return found
  }

  return 500
}

export function makeOkResp<T>(resp: T) {
  return makeJsonResp(200, resp)
}

export function makeErrorResp(e: Error): APIGatewayProxyResult {
  const statusCode = extractStatusCode(e)
  return {
    statusCode,
    body: JSON.stringify({
      name: e.name,
      message: e.message,
      stack: e.stack
    })
  }
}

export function makeJsonResp<T>(status: number, resp: T): APIGatewayProxyResult {
  return {
    statusCode: status,
    body: JSON.stringify(resp)
  }
}

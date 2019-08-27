import { makeErrorResp, makeOkResp } from '../src/pop-serverless-common'

it('makeOkResp', () => {
  const body = { ok: true }
  const actual = makeOkResp(body)
  expect(actual.statusCode).toBe(200)
  expect(actual.body).toBe(JSON.stringify(body))
})

describe('makeErrorResp', () => {
  it('by status', () => {
    const e: any = new Error('')
    e.status = 402
    const actual = makeErrorResp(e)
    expect(actual.statusCode).toBe(402)
  })

  it('by statusCode', () => {
    const e: any = new Error('')
    e.statusCode = 401
    const actual = makeErrorResp(e)
    expect(actual.statusCode).toBe(401)
  })

  it('based error name', () => {
    const e = new Error('sample')
    e.name = 'ValidationError'
    const actual = makeErrorResp(e)
    expect(actual.statusCode).toBe(400)
  })

  it('unknown error', () => {
    const e = new Error('sample')
    const actual = makeErrorResp(e)
    expect(actual.statusCode).toBe(500)
  })
})

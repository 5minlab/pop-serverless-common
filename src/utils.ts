// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise?rq=1
export type ThenArg<T> = T extends Promise<infer U> ? U : T

export type RespTypeArg<T extends (...args: any[]) => any> = ThenArg<ReturnType<T>>

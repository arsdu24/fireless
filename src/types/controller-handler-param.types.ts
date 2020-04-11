export type ParamResolver<A, R> = (event: A) => Promise<R>;

export interface TransformPipe<A, R> {
  transform(data: A): Promise<R>;
}

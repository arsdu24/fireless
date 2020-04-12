export type AsyncResolver<D extends {}, R> = (data: D) => Promise<R>;

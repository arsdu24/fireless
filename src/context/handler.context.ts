import { AsyncResolver } from '../type';

export class HandlerContext<O extends {}, E extends {}> {
  constructor(
    public options: O | Partial<O> = {},
    public paramResolverList: AsyncResolver<E, any>[] = [],
  ) {}
}

import { HandlerContext } from './handler.context';
import { Class } from 'utility-types';

export class ControllerContext<
  T extends {},
  O extends {},
  E extends {},
  HO extends {}
> {
  constructor(
    public Constructor: Class<T>,
    public options: O | Partial<O> = {},
    public handlerContextMap: Map<keyof T, HandlerContext<HO, E>> = new Map(),
  ) {}
}

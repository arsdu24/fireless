import { Class, DeepPartial } from 'utility-types';
import { merge } from 'lodash/fp';
import { ControllerHandlerProxy } from '../proxies';
import { ParamResolver, TransformPipe } from '../types';
import { DIContainer } from '../singletons/di-container';

export class ControllerHandlerProxyBuilder<
  T extends {},
  O extends {},
  E extends {},
  R = void
> {
  private method: ((...args: any[]) => R) | undefined;
  private options: O | undefined;
  private paramsResolvers: ParamResolver<E, R>[] = [];

  constructor(private methodName: string) {}

  withOptions(options: O | Partial<O> | DeepPartial<O>): this {
    this.options = merge<O, O>((this.options || {}) as O, options as O);

    return this;
  }

  setParamResolver(
    index: number,
    resolver: ParamResolver<E, any>,
    ...pipes: Class<TransformPipe<any, any>>[]
  ): this {
    this.paramsResolvers[index] = (event: E): Promise<R> =>
      pipes
        .map(PipeClass => DIContainer.getInstance().resolve(PipeClass))
        .reduce(
          (
            transformChain: Promise<any>,
            transformPipe: TransformPipe<any, any>,
          ) => transformChain.then(data => transformPipe.transform(data)),
          resolver(event),
        );

    return this;
  }

  build(target: T): ControllerHandlerProxy<O, E, R> {
    if (!this.options) {
      throw new Error(
        'Cannot build the Controller Handler Proxy without options',
      );
    }

    if (
      !(this.methodName in target) ||
      'function' !== typeof target[this.methodName]
    ) {
      throw new Error(
        'Controller Handler Decorator should be applied to an method!',
      );
    }

    this.method = (target[this.methodName] as (...args: any) => R).bind(target);

    return new ControllerHandlerProxy<O, E, R>(
      this.options,
      this.method,
      this.paramsResolvers,
    );
  }
}

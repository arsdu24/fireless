import { EventStream } from '../classes';
import { Class, DeepPartial } from 'utility-types';
import { merge } from 'lodash/fp';
import { ControllerHandlerProxyBuilder } from './controller-handler-proxy.builder';
import { DIContainer } from '../singletons/di-container';
import { ControllerHandlerProxy, ControllerProxy } from '../proxies';
import { ControllerOptions } from '../types';

export class ControllerProxyBuilder<
  T extends {},
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
> {
  private options: CO | undefined;
  private handlersMap: Map<
    string,
    ControllerHandlerProxyBuilder<T, HO, E, any>
  > = new Map();

  constructor(private klass: Class<T>) {}

  withOptions(options: CO | Partial<CO> | DeepPartial<CO>): this {
    this.options = merge<CO, CO>((this.options || {}) as CO, options as CO);

    return this;
  }

  getHandlerBuilder<R>(
    handlerName: string,
  ): ControllerHandlerProxyBuilder<T, HO, E, R> {
    if (!this.handlersMap.has(handlerName)) {
      this.handlersMap.set(
        handlerName,
        new ControllerHandlerProxyBuilder<T, HO, E, any>(handlerName),
      );
    }

    return this.handlersMap.get(handlerName);
  }

  getEventStreamName<EventStreamName>():
    | ControllerOptions['eventStream']
    | EventStreamName {
    return this.options.eventStream;
  }

  build(eventStream: EventStream<E, CO, HO>): ControllerProxy<T, CO, HO, E> {
    if (!this.options) {
      throw new Error(
        'Cannot build the Controller Handler Proxy without options',
      );
    }

    const target: T = DIContainer.getInstance().resolve(this.klass);

    const handlers: ControllerHandlerProxy<HO, E, any>[] = [
      ...this.handlersMap.values(),
    ].map(handlerBuilder => handlerBuilder.build(target));

    return new ControllerProxy<T, CO, HO, E>(
      eventStream,
      this.options,
      handlers,
    );
  }
}

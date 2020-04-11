import { EventStream } from '../classes';
import { Class } from 'utility-types';
import { ControllerProxyBuilder } from '../builders';
import { getControllerProxyBuilder } from './controller-proxy-builder.helper';
import { ApplicationOptions } from '../types';

export async function createApplication(options: ApplicationOptions) {
  const streamsByNameMap: Map<string, EventStream<any, any, any>> = new Map();

  (
    await Promise.all(
      options.eventModules.map(eventModule => eventModule.init()),
    )
  ).forEach(({ name, stream }) => streamsByNameMap.set(name, stream));

  options.controllers.forEach((Controller: Class<any>) => {
    const builder: ControllerProxyBuilder<
      any,
      any,
      any,
      any
    > = getControllerProxyBuilder(Controller);

    if (streamsByNameMap.has(builder.getEventStreamName())) {
      builder
        .build(streamsByNameMap.get(builder.getEventStreamName()))
        .register();
    }
  });

  await Promise.all(
    options.eventModules.map(eventModule =>
      eventModule.after(streamsByNameMap),
    ),
  );
}

import { EventStream } from '../classes';
import { ControllerHandlerProxy } from './controller-handler.proxy';

export class ControllerProxy<
  T extends {},
  CO extends {},
  HO extends {},
  E extends {}
> {
  constructor(
    private eventStream: EventStream<E, CO, HO>,
    private options: CO,
    private handlers: ControllerHandlerProxy<HO, E, any>[],
  ) {}

  register() {
    const controllerEventStream: EventStream<E, CO, HO> = this.eventStream.fork(
      this.options,
    );

    this.handlers.forEach(controllerHandler => {
      const controllerHandlerOptions: HO = controllerHandler.getOptions();

      controllerEventStream.subscribe(controllerHandlerOptions, (event: E) =>
        controllerHandler.handle(event),
      );
    });
  }
}

import { EventStream } from './event-stream';

export interface EventStreamRegistration<
  T extends {},
  CO extends {},
  HO extends {}
> {
  name: string;
  stream: EventStream<T, CO, HO>;
}

export abstract class EventModule<
  O extends {},
  T extends {},
  CO extends {},
  HO extends {}
> {
  protected constructor(_options: O) {
    void _options;
  }

  abstract init(): Promise<EventStreamRegistration<T, CO, HO>>;

  async after(
    streamsMap: Map<string, EventStream<any, any, any>>,
  ): Promise<void> {
    return void streamsMap;
  }
}

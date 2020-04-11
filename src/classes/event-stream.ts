import { Observable } from 'rxjs';

export abstract class EventStream<T extends {}, CO extends {}, HO extends {}> {
  protected constructor(stream: Observable<T>) {
    void stream;
  }

  abstract fork(options: CO): EventStream<T, CO, HO>;
  abstract subscribe<R>(
    options: HO,
    handler: (event: T) => R | Promise<R>,
  ): void;
}

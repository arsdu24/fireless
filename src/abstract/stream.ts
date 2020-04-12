import { Observable } from 'rxjs';
import { AsyncResolver } from '../type';

export abstract class AbstractStream<
  E extends {},
  FO extends {},
  SO extends {}
> {
  protected constructor(protected observable: Observable<E>) {}

  abstract pipe(options: FO): Promise<AbstractStream<E, FO, SO>>;
  abstract subscribe<R = void>(
    options: SO,
    handler: AsyncResolver<E, R>,
  ): Promise<void>;
}

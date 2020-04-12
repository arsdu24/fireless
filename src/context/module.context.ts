import { ControllerContext } from './controller.context';
import { Class } from 'utility-types';
import { AbstractModule } from '../abstract';

export class ModuleContext<
  O extends {},
  E extends {},
  CO extends {},
  HO extends {}
> {
  constructor(
    public Constructor: Class<AbstractModule<O, E, CO, HO>>,
    public options: O | Partial<O> = {},
    public controllerContextList: ControllerContext<any, CO, E, HO>[] = [],
  ) {}
}

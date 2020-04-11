import { ControllerEventStreamNamesEnum } from './event-stream-names.enum';
import { EventModule } from '../classes';
import { Class } from 'utility-types';

export interface ControllerOptions {
  eventStream: ControllerEventStreamNamesEnum;
}

export interface ApplicationOptions {
  eventModules: EventModule<any, any, any, any>[];
  controllers: Class<any>[];
}

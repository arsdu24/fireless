import { Class, DeepPartial, Diff } from 'utility-types';
import { merge } from 'lodash/fp';
import { getControllerProxyBuilder } from '../helpers';
import { ControllerOptions } from '../types';

export type ControllerDecorator = <T>(klass: Class<T>) => Class<T>;

export function decorateController<
  T extends {},
  CO extends ControllerOptions,
  HO extends {},
  E extends {},
  R = any
>(klass: Class<T>, options: CO | DeepPartial<CO>) {
  getControllerProxyBuilder<T, CO, HO, E>(klass).withOptions(options);

  return klass;
}

export function createControllerDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {},
  PO extends DeepPartial<CO> = DeepPartial<CO>
>(predefinedOptions: PO): (options: Diff<CO, PO>) => ControllerDecorator {
  return (options: Diff<CO, PO>) => <T>(klass: Class<T>) => {
    return decorateController(klass, merge(options, predefinedOptions));
  };
}

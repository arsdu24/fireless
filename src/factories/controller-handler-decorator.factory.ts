import { Class, DeepPartial, Diff } from 'utility-types';
import { merge } from 'lodash/fp';
import { getControllerProxyBuilder } from '../helpers';
import { ControllerOptions } from '../types';

export type ControllerHandlerDecorator = <T extends {}>(
  target: T,
  methodName: string,
  descriptor: PropertyDescriptor,
) => void;

export function decorateControllerHandler<
  T extends {},
  CO extends ControllerOptions,
  HO extends {},
  E extends {},
  R = any
>(target: T, methodName: string, options: HO) {
  const klass: Class<T> = target.constructor as Class<T>;

  getControllerProxyBuilder<T, CO, HO, E>(klass)
    .getHandlerBuilder(methodName)
    .withOptions(options);
}

export function createControllerHandlerDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {},
  PO extends DeepPartial<HO> = DeepPartial<HO>
>(
  predefinedOptions: PO,
): (options: Diff<HO, PO>) => ControllerHandlerDecorator {
  return (options: Diff<HO, PO>) => <T extends {}>(
    target: T,
    methodName: string,
  ) => {
    decorateControllerHandler(
      target,
      methodName,
      merge(options, predefinedOptions),
    );
  };
}

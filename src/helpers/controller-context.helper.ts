import { Class } from 'utility-types';
import { ControllerContext } from '../context';
import { ContextRegistry } from '../singleton/context-registry';

export function getControllerContext<
  T extends {},
  O extends {},
  E extends {},
  HO extends {}
>(Target: Class<T>): ControllerContext<T, O, E, HO> {
  return ContextRegistry.getInstance().getControllerContext<T, O, E, HO>(
    Target,
  );
}

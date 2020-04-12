import { Class } from 'utility-types';
import { AbstractModule } from '../abstract';
import { ModuleContext } from '../context';
import { ContextRegistry } from '../singleton/context-registry';

export function getModulesContext<
  O extends {},
  E extends {},
  CO extends {},
  HO extends {}
>(
  Target: Class<any>,
  Module: Class<AbstractModule<O, E, CO, HO>>,
): ModuleContext<O, E, CO, HO> {
  return ContextRegistry.getInstance().getModuleContext<O, E, CO, HO>(
    Target,
    Module,
  );
}

import { Class } from 'utility-types';
import { ControllerContext, ModuleContext } from '../context';
import { AbstractModule } from '../abstract';

export class ContextRegistry {
  private static instance: ContextRegistry;

  private moduleContextMap: Map<
    Class<any>,
    ModuleContext<any, any, any, any>
  > = new Map();
  private controllerContextMap: Map<
    Class<any>,
    ControllerContext<any, any, any, any>
  > = new Map();

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  private constructor() {}

  getModuleContextByTargetOrUndefined<
    O extends {},
    E extends {},
    CO extends {},
    HO extends {}
  >(Target: Class<any>): ModuleContext<O, E, CO, HO> | undefined {
    return this.moduleContextMap.get(Target);
  }

  getModuleContext<O extends {}, E extends {}, CO extends {}, HO extends {}>(
    Target: Class<any>,
    Module: Class<AbstractModule<O, E, CO, HO>>,
  ): ModuleContext<O, E, CO, HO> {
    let context:
      | ModuleContext<O, E, CO, HO>
      | undefined = this.moduleContextMap.get(Target);
    if (!context) {
      context = new ModuleContext<O, E, CO, HO>(Module);
      this.moduleContextMap.set(Target, context);
    }

    return context;
  }

  getControllerContext<T extends {}, O extends {}, E extends {}, HO extends {}>(
    Target: Class<T>,
  ): ControllerContext<T, O, E, HO> {
    let context:
      | ControllerContext<T, O, E, HO>
      | undefined = this.controllerContextMap.get(Target);

    if (!context) {
      context = new ControllerContext<T, O, E, HO>(Target);

      this.controllerContextMap.set(Target, context);
    }

    return context;
  }

  static getInstance(): ContextRegistry {
    if (!this.instance) {
      this.instance = new ContextRegistry();
    }

    return this.instance;
  }
}

import { Class } from 'utility-types';
import { ModuleContext } from './context';
import { ContextRegistry } from './singleton/context-registry';
import { DependencyContainer } from './singleton/dependency-container';

type ModuleAndContextRecord<T = never> = {
  module: Class<any>;
  context: ModuleContext<any, any, any, any> | T;
};

export async function createApplication(modules: Class<any>[]) {
  const moduleContextList: ModuleContext<any, any, any, any>[] = modules
    .map(
      (module: Class<any>): ModuleAndContextRecord<undefined> => {
        return {
          module,
          context: ContextRegistry.getInstance().getModuleContextByTargetOrUndefined(
            module,
          ),
        };
      },
    )
    .filter(
      (
        record: ModuleAndContextRecord<undefined>,
      ): record is ModuleAndContextRecord => {
        if (!record.context) {
          //TODO Should log somewhere that this module is not initialized because it wasn't decorated as module
        }

        return !!record.context;
      },
    )
    .map(({ context }) => context);

  await Promise.all(
    moduleContextList.map((context) => {
      DependencyContainer.getInstance()
        .resolve(context.Constructor)
        .init(context);
    }),
  );
}

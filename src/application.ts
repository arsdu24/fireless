import {Class} from 'utility-types';
import {ModuleContext} from './context';
import {ContextRegistry} from './singleton/context-registry';
import {resolveDependency} from "./helpers";
import {AbstractModule, AbstractStream} from "./abstract";

type ModuleAndContextRecord<T = never> = {
  module: Class<any>;
  context: ModuleContext<any, any, any, any> | T;
};

type ModuleContextAndStream = { module: AbstractModule<any, any, any, any>, stream: AbstractStream<any, any, any>, context: ModuleContext<any, any, any, any> }

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

  const initModules: ModuleContextAndStream[] = await Promise.all(
    moduleContextList.map(async (context): Promise<ModuleContextAndStream> => {
      const module = resolveDependency(context.Constructor);
      const stream = await module.init(context);

      return {
          module, context, stream
      }
    }),
  );

  await Promise.all(
      initModules.map(async ({ module, stream, context }: ModuleContextAndStream) => {
          await module.registerControllers(stream, context)
      })
  )
}

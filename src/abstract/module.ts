import {AbstractStream} from './stream';
import {ControllerContext, HandlerContext, ModuleContext} from '../context';
import {AsyncResolver} from '../type';
import {resolveDependency} from "../helpers";

export abstract class AbstractModule<O extends {},
    E extends {},
    CO extends {},
    HO extends {}> {
    protected abstract createStream(
        options: O,
        context: ModuleContext<O, E, CO, HO>,
    ): Promise<AbstractStream<E, CO, HO>>;

    async init(context: ModuleContext<O, E, CO, HO>): Promise<AbstractStream<E, CO, HO>> {
        return await this.createStream(
            context.options as O,
            context,
        )
    }

    async registerControllers(
        stream: AbstractStream<E, CO, HO>,
        context: ModuleContext<O, E, CO, HO>,
    ): Promise<void> {
        await Promise.all(
            context.controllerContextList.map(
                async (controllerContext: ControllerContext<any, CO, E, HO>) => {
                    await this.registerController(stream, controllerContext);
                },
            ),
        );
    }

    protected async registerController<T = any>(
        stream: AbstractStream<E, CO, HO>,
        controllerContext: ControllerContext<T, CO, E, HO>,
    ): Promise<void> {
        const controllerStream: AbstractStream<E, CO, HO> = await stream.pipe(
            controllerContext.options as CO,
        );

        await this.registerControllerHandlers(controllerStream, controllerContext);
    }

    protected async registerControllerHandlers(
        stream: AbstractStream<E, CO, HO>,
        context: ControllerContext<any, CO, E, HO>,
    ): Promise<void> {
        await Promise.all(
            [...context.handlerContextMap.entries()].map(
                async ([methodName, handlerContext]) => {
                    type Controller = typeof context.Constructor;

                    const target: Controller = resolveDependency(
                        context.Constructor,
                    );

                    if (
                        methodName in target &&
                        'function' === typeof target[methodName as keyof Controller]
                    ) {
                        await this.registerControllerHandler(
                            stream,
                            (target[methodName as keyof Controller] as AsyncResolver<E, any>).bind(target),
                            handlerContext,
                        );
                    }
                },
            ),
        );
    }

    protected async registerControllerHandler<T = any>(
        stream: AbstractStream<E, CO, HO>,
        handler: AsyncResolver<E, any>,
        handlerContext: HandlerContext<HO, E>,
    ): Promise<void> {
        await stream.subscribe(handlerContext.options as HO, handler);
    }
}

import { Class } from 'utility-types';
import { NonUndefined } from 'utility-types/dist/mapped-types';
import { ControllerOptions, ParamResolver, TransformPipe } from '../types';
import { getControllerProxyBuilder } from '../helpers';

type AllowedKeys<T extends object, Type> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends Type ? K : never;
}[keyof T];

export type ControllerHandlerParamDecorator = <T extends {}>(
  target: T,
  methodName: string,
  index: number,
) => void;

export function decorateControllerHandlerParam<
  T extends {},
  CO extends ControllerOptions,
  HO extends {},
  E extends {},
  R = any
>(
  target: T,
  methodName: string,
  index: number,
  resolver: ParamResolver<E, R>,
  pipes: Class<TransformPipe<any, any>>[],
) {
  const klass: Class<T> = target.constructor as Class<T>;

  getControllerProxyBuilder<T, CO, HO, E>(klass)
    .getHandlerBuilder(methodName)
    .setParamResolver(index, resolver, ...pipes);
}

export function createControllerHandlerParamDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(resolver: ParamResolver<E, any>): () => ControllerHandlerParamDecorator;
export function createControllerHandlerParamDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: ParamResolver<E, any>,
): <R, R1>(
  pipe: Class<TransformPipe<R, R1>>,
) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: ParamResolver<E, any>,
): <R, R1, R2>(
  pipe1: Class<TransformPipe<R, R1>>,
  pipe2: Class<TransformPipe<R1, R2>>,
) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: ParamResolver<E, any>,
): <R, R1, R2, R3>(
  pipe1: Class<TransformPipe<R, R1>>,
  pipe2: Class<TransformPipe<R1, R2>>,
  pipe3: Class<TransformPipe<R2, R3>>,
) => ControllerHandlerParamDecorator {
  return (...pipes) => <T extends {}>(
    target: T,
    methodName: string,
    index: number,
  ) => {
    decorateControllerHandlerParam(target, methodName, index, resolver, pipes);
  };
}

export function createControllerHandlerParamByKeyDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: (key: AllowedKeys<E, any>) => ParamResolver<E, any>,
): <R>(key: AllowedKeys<E, R>) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamByKeyDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: (key: AllowedKeys<E, any>) => ParamResolver<E, any>,
): <R, R1>(
  key: AllowedKeys<E, R>,
  pipe: Class<TransformPipe<R, R1>>,
) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamByKeyDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: (key: AllowedKeys<E, any>) => ParamResolver<E, any>,
): <R, R1>(
  key: AllowedKeys<E, R>,
  pipe: Class<TransformPipe<R, R1>>,
) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamByKeyDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: (key: AllowedKeys<E, any>) => ParamResolver<E, any>,
): <R, R1, R2>(
  key: AllowedKeys<E, R>,
  pipe1: Class<TransformPipe<R, R1>>,
  pipe2: Class<TransformPipe<R1, R2>>,
) => ControllerHandlerParamDecorator;
export function createControllerHandlerParamByKeyDecorator<
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(
  resolver: (key: AllowedKeys<E, any>) => ParamResolver<E, any>,
): <R, R1, R2, R3>(
  key: AllowedKeys<E, R>,
  pipe1: Class<TransformPipe<R, R1>>,
  pipe2: Class<TransformPipe<R1, R2>>,
  pipe3: Class<TransformPipe<R2, R3>>,
) => ControllerHandlerParamDecorator {
  return <R>(key: AllowedKeys<E, R>, ...pipes) => <T extends {}>(
    target: T,
    methodName: string,
    index: number,
  ) => {
    decorateControllerHandlerParam(
      target,
      methodName,
      index,
      resolver(key as any),
      pipes,
    );
  };
}

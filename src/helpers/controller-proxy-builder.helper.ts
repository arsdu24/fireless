import { Class } from "utility-types";
import { ControllerProxyBuilder } from "../builders";
import { ControllerOptions } from "../types";

const controllerProxyBuildersMap: Map<
  Class<any>,
  ControllerProxyBuilder<any, any, any, any>
> = new Map();

export function getControllerProxyBuilder<
  T extends {},
  CO extends ControllerOptions,
  HO extends {},
  E extends {}
>(klass: Class<T>): ControllerProxyBuilder<T, CO, HO, E> {
  if (!controllerProxyBuildersMap.has(klass)) {
    controllerProxyBuildersMap.set(klass, new ControllerProxyBuilder(klass));
  }

  return controllerProxyBuildersMap.get(klass) as ControllerProxyBuilder<
    T,
    CO,
    HO,
    E
  >;
}

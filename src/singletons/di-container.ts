import "reflect-metadata";
import { Class } from "utility-types";

export class DIContainer {
  private static instance: DIContainer;

  private providers: Map<Class<any>, any> = new Map();
  private unsupportedDependencies: Function[] = [String, Number, Boolean];

  private constructor() {
    DIContainer.instance = this;
  }

  getDependencies<T>(Target: Class<T>): Class<any>[] {
    return Reflect.getMetadata('design:paramtypes', Target) || [];
  }

  resolve<T>(Target: Class<T>): T {
    if (this.providers.has(Target)) {
      return this.providers.get(Target);
    }

    const dependencies: Function[] = this.getDependencies(Target);

    if (0 === dependencies.length) {
      const provider: T = new Target();

      this.providers.set(Target, provider);

      return provider;
    }

    const hasUnsupportedDependencies: boolean = dependencies.some(
      (Dependency: Function) => {
        return this.unsupportedDependencies.includes(Dependency as Class<any>);
      },
    );

    if (hasUnsupportedDependencies) {
      throw new Error('Detect Native Dependency in the Dependencies Chain');
    }

    const provider: T = new Target(
      ...dependencies.map((Dependency: Function) => {
        if (!this.providers.has(Dependency as Class<any>)) {
          this.resolve(Dependency as Class<any>);
        }

        return this.providers.get(Dependency as Class<any>);
      }),
    );

    this.providers.set(Target, provider);

    return provider;
  }

  rewriteProvider(from: Class<any>, to: any) {
    this.providers.set(from, to);
  }

  static getInstance(): DIContainer {
    if (!this.instance) {
      this.instance = new DIContainer();
    }

    return this.instance;
  }
}

import { Class } from 'utility-types';
import { DependencyContainer } from '../singleton/dependency-container';

export function resolveDependency<T>(Target: Class<T>): T {
  return DependencyContainer.getInstance().resolve(Target);
}

export function rewriteProvider<T extends {}>(from: Class<T>, to: T) {
  DependencyContainer.getInstance().rewriteProvider(from, to);
}

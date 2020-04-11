export class ControllerHandlerProxy<O extends {}, E extends {}, R = void> {
  constructor(
    private options: O,
    private method: (...args: any[]) => any,
    private paramsResolver: ((event: E) => any)[],
  ) {}

  getOptions(): O {
    return this.options;
  }

  async handle(event: E): Promise<R> {
    const params: any[] = await Promise.all(
      this.paramsResolver.map(resolver => resolver(event)),
    );

    return this.method(...params);
  }
}

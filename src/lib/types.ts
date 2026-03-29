export type PropsFor<T> = T extends (...args: any) => any
  ? Parameters<T>[0]
  : never

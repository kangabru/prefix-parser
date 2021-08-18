export type NameArg = [name: string]
export type NameArgAnd<T> = Concat<[NameArg, T]>

/**
 * Concat two array types.
 * @see https://stackoverflow.com/a/64631060/3801481
 * @example
 * type T1 = ['a', 'b', 'c']
 * type T2 = ['d', 'e', 'f']
 * type TN = [1, 2, 3]
 *
 * type C = Concat<[T1, T2, TN]>; // ["a", "b", "c", "d", "e", "f", 1, 2, 3]
 */
export type Concat<T> = T extends [infer A, ...infer Rest]
    ? A extends any[] ? [...A, ...Concat<Rest>] : A
    : T;

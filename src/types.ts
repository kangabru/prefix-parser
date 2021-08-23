import BaseArg from "./matchers/base";

export type Arr = readonly any[]

export type NameArg = [name: string]
export type NameArgAnd<Args extends Arr> = [...NameArg, ...Args]

/**
 * Maps a typed tuple like '[string, number, boolean]' to '[BaseArg<string>, BaseArg<number>, BaseArg<boolean>]'
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#mapped-types-on-tuples-and-arrays
 */
export type MapToBaseArg<T extends Arr> = { [K in keyof T]: BaseArg<T[K]> }

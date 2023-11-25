import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper utility to prettify types
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Helper utility to combine two types
type Combine<T1, T2> = Prettify<
  {
    [K in keyof (T1 | T2)]: T1[K] | T2[K];
  } & Partial<T1 & T2>
>;

// Helper utility to make all properties mutable
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Helper utility to unwrap a promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

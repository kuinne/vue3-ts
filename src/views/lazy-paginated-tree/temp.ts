type Filter<T extends unknown[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? [F, ...Filter<R, P>]
    : Filter<R, P>
  : [];

type Array1 = ["hello", "name", "age"];

type Array2 = Filter<Array1, "hello">;

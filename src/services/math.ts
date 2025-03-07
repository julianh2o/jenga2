const gcd = (a: number, b: number): number => a ? gcd(b % a, a) : b;
const lcm = (a: number, b: number): number => a * b / gcd(a, b);
const leastCommonMultiple = (arr: number[]): number => arr.length ? arr.reduce(lcm) : 1;

export { gcd, lcm, leastCommonMultiple };

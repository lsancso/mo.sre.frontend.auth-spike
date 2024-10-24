export const pipe = (...fns) => {
  return (x) => fns.reduce((y, f) => f(y), x)
}

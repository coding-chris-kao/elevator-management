export function sleep(delay: number) {
  const start = Date.now()
  while (Date.now() - start < delay) {
    continue
  }
}

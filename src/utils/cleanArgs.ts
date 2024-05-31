
export function cleanArgs(args: object) {
  return JSON.parse(JSON.stringify(args));
}

export function getRegFromString(str: string): RegExp {
  const a = str.split("/");
  const modifiers = a.pop() ?? "";
  a.shift();
  const pattern = a.join("/");
  return new RegExp(pattern, modifiers);
}

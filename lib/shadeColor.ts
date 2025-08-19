export function shadeColor(color: string, amount: number): string {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (c) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)
        ).slice(-2)
      )
  );
}

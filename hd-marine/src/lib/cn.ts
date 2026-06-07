/** Koşullu className birleştirici (clsx'in hafif yerli karşılığı) */
export function cn(
  ...inputs: (string | false | null | undefined)[]
): string {
  return inputs.filter(Boolean).join(" ");
}

export default function getPowOfArray(base: number, length: number): number[] {
  return Array.from({length}, (_, i) => base ** i);
}

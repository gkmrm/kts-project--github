export function debounce<T extends any[]>(f: (...args: T) => any, timeMs: number): (...args: T) => void {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      f(...args);
    }, timeMs);
  };
}

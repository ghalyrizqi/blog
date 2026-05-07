export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Node.js 22+ exposes a global localStorage object, but without --localstorage-file
    // it's broken: getItem/setItem are undefined. Next.js dev overlay checks
    // `typeof localStorage !== 'undefined'` (which now passes), then crashes calling
    // localStorage.getItem(). Replace it with a safe in-memory no-op.
    if (
      typeof globalThis.localStorage !== 'undefined' &&
      typeof (globalThis.localStorage as Storage).getItem !== 'function'
    ) {
      const store: Record<string, string> = {};
      (globalThis as unknown as Record<string, unknown>).localStorage = {
        getItem: (key: string): string | null => store[key] ?? null,
        setItem: (key: string, value: string): void => { store[key] = value; },
        removeItem: (key: string): void => { delete store[key]; },
        clear: (): void => { Object.keys(store).forEach(k => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (index: number): string | null => Object.keys(store)[index] ?? null,
      } satisfies Storage;
    }
  }
}

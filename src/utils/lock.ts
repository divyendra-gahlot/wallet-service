// this map stores - walletId → Promise that represents current lock
// if promise is present, wallet is locked else not locked
const walletLocks = new Map<string, Promise<void>>();

export async function acquireLock(walletId: string): Promise<() => void> {
  //1. create a new lock (promise)
  let release!: () => void;

  const newLock = new Promise<void>((resolve) => {
    release = resolve;
  });

  //2. checking if the lock already exists. If exists then wait else run immediately.
  const existingLock = walletLocks.get(walletId);

  // if a lock exists: After the previous lock resolves, start this new lock.
  walletLocks.set(
    walletId,
    existingLock ? existingLock.then(() => newLock) : newLock
  );

  // wait if old lock exists
  if (existingLock) {
    await existingLock;
  }

  // we should return the function that resolves the lock
  return release;
}

export function releaseLock(walletId: string) {
  walletLocks.delete(walletId);
}

// we can see the working example in the transaction.concurrent.test.ts.

"use strict";
"use client";

import { SessionProvider } from "next-auth/react";
import { SyncManager } from "./SyncManager";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncManager />
      {children}
    </SessionProvider>
  );
}

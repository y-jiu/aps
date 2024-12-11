// src/types/react-i18next.d.ts

import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    // Instead of referring to the full translation JSON, use a simpler type
    resources: Record<string, Record<string, string>>;
  }
}

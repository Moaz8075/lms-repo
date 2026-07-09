import { Platform } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function requireEnv(value: string | undefined, key: string): string {
  if (!value?.trim()) {
    throw new Error(
      `[env] Missing ${key}. Copy apps/mobile/.env.example to apps/mobile/.env, set the value, then restart Expo (press r or stop and run yarn mobile:start again).`,
    );
  }
  return value.trim().replace(/\/$/, '');
}

/**
 * Android emulators cannot reach the host machine via localhost.
 * Map localhost/127.0.0.1 to the emulator's host alias (10.0.2.2).
 * iOS Simulator can use localhost directly.
 * Physical devices must use your computer's LAN IP in EXPO_PUBLIC_API_URL.
 */
function resolveApiUrl(url: string): string {
  if (Platform.OS !== 'android') {
    return url;
  }

  return url.replace(/\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/, '//10.0.2.2');
}

/** Lazy access so Metro can load before env is validated at first API use. */
let cachedEnv: { apiUrl: string } | null = null;

export function getEnv(): { apiUrl: string } {
  if (!cachedEnv) {
    const configured = requireEnv(API_URL, 'EXPO_PUBLIC_API_URL');
    cachedEnv = {
      apiUrl: resolveApiUrl(configured),
    };
  }
  return cachedEnv;
}

/** @deprecated Prefer getEnv() — kept for existing imports. */
export const env = {
  get apiUrl() {
    return getEnv().apiUrl;
  },
} as const;

import * as SecureStore from 'expo-secure-store';

import { STORAGE_KEYS } from '@/constants/storage';
import { withTimeout } from '@/lib/with-timeout';

const SECURE_STORE_TIMEOUT_MS = 5_000;

async function setItem(key: string, value: string): Promise<void> {
  await withTimeout(
    SecureStore.setItemAsync(key, value),
    SECURE_STORE_TIMEOUT_MS,
    'Secure storage write timed out',
  );
}

async function getItem(key: string): Promise<string | null> {
  return withTimeout(
    SecureStore.getItemAsync(key),
    SECURE_STORE_TIMEOUT_MS,
    'Secure storage read timed out',
  );
}

async function removeItem(key: string): Promise<void> {
  await withTimeout(
    SecureStore.deleteItemAsync(key),
    SECURE_STORE_TIMEOUT_MS,
    'Secure storage delete timed out',
  );
}

export async function saveAccessToken(token: string): Promise<void> {
  await setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export async function getAccessToken(): Promise<string | null> {
  return getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function removeAccessToken(): Promise<void> {
  await removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function saveRefreshToken(token: string): Promise<void> {
  await setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function removeRefreshToken(): Promise<void> {
  await removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function clearAllTokens(): Promise<void> {
  await Promise.allSettled([removeAccessToken(), removeRefreshToken()]);
}

export async function saveRememberEmail(email: string): Promise<void> {
  await setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
}

export async function getRememberEmail(): Promise<string | null> {
  return getItem(STORAGE_KEYS.REMEMBER_EMAIL);
}

export async function removeRememberEmail(): Promise<void> {
  await removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
}

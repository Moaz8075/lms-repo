/** Shared hooks barrel — feature hooks live under src/features. */

export { useTheme } from '@/providers/ThemeProvider';
export { useAuthContext } from '@/providers/AuthProvider';
export { useLogin, useRegister, useForgotPassword, useLogout } from '@/features/auth/hooks';

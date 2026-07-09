import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { DEFAULT_AUTHENTICATED_ROUTE } from '@/constants/routes';
import {
  AuthButton,
  AuthErrorBanner,
  AuthHeader,
  AuthLink,
  AuthScreenLayout,
  CheckboxField,
  FormField,
  useLogin,
} from '@/features/auth';
import { authService } from '@/features/auth/services';
import { loginSchema, type LoginFormValues } from '@/features/auth/validation';
import { useTheme } from '@/providers';

export default function LoginScreen() {
  const { typography, spacing, colors } = useTheme();
  const loginMutation = useLogin();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    void authService.getRememberedEmail().then((email) => {
      if (email) {
        setValue('email', email);
        setValue('rememberMe', true);
      }
    });
  }, [setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await loginMutation.mutateAsync(values);
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  });

  return (
    <AuthScreenLayout
      footer={
        <Text style={[typography.bodySmall, styles.footer, { color: colors.text.secondary }]}>
          New firm?{' '}
          <Link href="/(auth)/register" style={{ color: colors.primary.main, fontWeight: '600' }}>
            Register your organization
          </Link>
        </Text>
      }
    >
      <AuthHeader title="LegalEase" subtitle="Sign in to manage your cases" />

      {formError ? <AuthErrorBanner message={formError} /> : null}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="rememberMe"
        render={({ field: { value, onChange } }) => (
          <CheckboxField label="Remember me" value={value} onValueChange={onChange} />
        )}
      />

      <View style={[styles.row, { marginBottom: spacing.xl }]}>
        <AuthLink label="Forgot password?" onPress={() => router.push('/(auth)/forgot-password')} />
      </View>

      <AuthButton label="Sign in" loading={loginMutation.isPending} onPress={onSubmit} />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footer: {
    textAlign: 'center',
  },
});

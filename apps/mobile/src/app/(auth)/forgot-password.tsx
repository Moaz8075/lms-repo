import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  AuthButton,
  AuthErrorBanner,
  AuthHeader,
  AuthLink,
  AuthScreenLayout,
  AuthSuccessBanner,
  FormField,
  useForgotPassword,
} from '@/features/auth';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/features/auth/validation';

export default function ForgotPasswordScreen() {
  const forgotPasswordMutation = useForgotPassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      await forgotPasswordMutation.mutateAsync(values);
      setSuccessMessage(
        'If an account exists for this email, password reset instructions have been sent.',
      );
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to process your request.');
    }
  });

  return (
    <AuthScreenLayout>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we will send reset instructions"
      />

      {formError ? <AuthErrorBanner message={formError} /> : null}
      {successMessage ? <AuthSuccessBanner message={successMessage} /> : null}

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
            keyboardType="email-address"
            textContentType="emailAddress"
            error={errors.email?.message}
          />
        )}
      />

      <AuthButton
        label="Send Reset Link"
        loading={forgotPasswordMutation.isPending}
        onPress={onSubmit}
      />

      <AuthLink label="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
    </AuthScreenLayout>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { DEFAULT_AUTHENTICATED_ROUTE } from '@/constants/routes';
import {
  AuthButton,
  AuthErrorBanner,
  AuthHeader,
  AuthScreenLayout,
  FormField,
  useRegister,
} from '@/features/auth';
import {
  registerSchema,
  slugifyOrganizationName,
  type RegisterFormValues,
} from '@/features/auth/validation';
import { useTheme } from '@/providers';

export default function RegisterScreen() {
  const { typography, colors } = useTheme();
  const registerMutation = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: '',
      organizationSlug: '',
      ownerName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await registerMutation.mutateAsync(values);
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to register.');
    }
  });

  return (
    <AuthScreenLayout
      footer={
        <Text style={[typography.bodySmall, styles.footer, { color: colors.text.secondary }]}>
          Already registered?{' '}
          <Link href="/(auth)/login" style={{ color: colors.primary.main, fontWeight: '600' }}>
            Sign in
          </Link>
        </Text>
      }
    >
      <AuthHeader
        title="Register Organization"
        subtitle="Create your firm account as the organization owner"
      />

      {formError ? <AuthErrorBanner message={formError} /> : null}

      <Controller
        control={control}
        name="organizationName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Organization Name"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              if (!slugEdited) {
                setValue('organizationSlug', slugifyOrganizationName(text), {
                  shouldValidate: true,
                });
              }
            }}
            onBlur={onBlur}
            autoCapitalize="words"
            error={errors.organizationName?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="organizationSlug"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Organization Slug"
            value={value}
            onChangeText={(text) => {
              setSlugEdited(true);
              onChange(text.toLowerCase());
            }}
            onBlur={onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.organizationSlug?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="ownerName"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Owner Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="words"
            error={errors.ownerName?.message}
          />
        )}
      />

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

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Phone Number"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            error={errors.phone?.message}
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
            textContentType="newPassword"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            textContentType="newPassword"
            error={errors.confirmPassword?.message}
          />
        )}
      />

      <AuthButton
        label="Create Organization"
        loading={registerMutation.isPending}
        onPress={onSubmit}
      />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    textAlign: 'center',
  },
});

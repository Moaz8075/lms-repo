'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import BalanceIcon from '@mui/icons-material/Balance';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, DEFAULT_ROUTE } from '@/utils/constants';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      const response = await authService.login(data);
      setAuth({
        user: response.user,
        organization: response.organization,
        permissions: response.permissions,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      });
      const redirect = searchParams.get('redirect') || DEFAULT_ROUTE;
      router.push(redirect);
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 420 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BalanceIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              LegalEase
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          Don&apos;t have an account?{' '}
          <Link href={ROUTES.register} style={{ color: '#1A73E8', textDecoration: 'none' }}>
            Register
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ROUTES } from '@/utils/constants';

const registerSchema = z
  .object({
    organizationName: z.string().min(2, 'Organization name is required'),
    adminName: z.string().min(2, 'Admin name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must include uppercase, lowercase, and a number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ confirmPassword: _, ...data }: RegisterForm) => {
    setError(null);
    try {
      const response = await authService.register(data);
      setAuth({
        user: response.user,
        organization: response.organization,
        permissions: response.permissions,
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken,
      });
      router.push(ROUTES.dashboard);
    } catch {
      setError('Registration failed. Please check your details and try again.');
    }
  };

  return (
    <Card sx={{ width: '100%', maxWidth: 480 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <BalanceIcon color="primary" fontSize="large" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Create your firm account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start managing cases with LegalEase
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
            {...register('organizationName')}
            label="Law Firm Name"
            fullWidth
            margin="normal"
            error={!!errors.organizationName}
            helperText={errors.organizationName?.message}
          />
          <TextField
            {...register('adminName')}
            label="Admin Full Name"
            fullWidth
            margin="normal"
            error={!!errors.adminName}
            helperText={errors.adminName?.message}
          />
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            {...register('confirmPassword')}
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          Already have an account?{' '}
          <Link href={ROUTES.login} style={{ color: '#1A73E8', textDecoration: 'none' }}>
            Sign in
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

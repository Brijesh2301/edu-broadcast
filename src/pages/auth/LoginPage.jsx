import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Info, Loader2, RadioTower } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const DEMO_CREDENTIALS = [
  {
    role: 'Principal',
    email: 'principal@school.com',
    password: 'password123',
  },
  {
    role: 'Teacher 1',
    email: 'teacher1@school.com',
    password: 'password123',
  },
  {
    role: 'Teacher 2',
    email: 'teacher2@school.com',
    password: 'password123',
  },
];

const validateField = (name, value) => {
  const result = loginSchema.shape[name].safeParse(value);
  return result.success ? null : result.error.errors[0].message;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, isLoading, error, clearError } =
    useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const target =
        user.role === 'principal'
        
          ? '/principal/dashboard'
          : '/teacher/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Surface auth errors as toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    // Final zod validation as a safety net
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    try {
      const { user: signedIn } = await login(parsed.data);
      toast.success(`Welcome back, ${signedIn.name.split(' ')[0]}!`);
      const target =
        signedIn.role === 'principal'
          ? '/principal/dashboard'
          : '/teacher/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Login failed. Please try again.');
    }
  };

  const fillDemo = (cred) => {
    setValue('email', cred.email, { shouldValidate: false });
    setValue('password', cred.password, { shouldValidate: false });
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <RadioTower
            className="w-10 h-10 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-50">
            Welcome Back
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sign in to EduBroadcast
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="principal@school.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                validate: (v) => validateField('email', v) || true,
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  className="pointer-events-auto text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register('password', {
                required: 'Password is required',
                validate: (v) => validateField('password', v) || true,
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Card>

      {/* Demo credentials box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Demo Credentials
          </h3>
        </div>
        <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mb-2">
          Click a row to autofill the form.
        </p>
        <div className="overflow-hidden rounded-md border border-blue-200 dark:border-blue-800">
          <table className="w-full text-xs">
            <thead className="bg-blue-100/60 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Role</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Password</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-200 dark:divide-blue-800">
              {DEMO_CREDENTIALS.map((cred) => (
                <tr
                  key={cred.email}
                  onClick={() => fillDemo(cred)}
                  className="cursor-pointer transition-colors hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                >
                  <td className="px-3 py-2 font-medium text-blue-900 dark:text-blue-100">
                    {cred.role}
                  </td>
                  <td className="px-3 py-2 text-blue-800 dark:text-blue-200">
                    {cred.email}
                  </td>
                  <td className="px-3 py-2 text-blue-800 dark:text-blue-200 font-mono">
                    {cred.password}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

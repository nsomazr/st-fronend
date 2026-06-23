import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { loginSchema } from '../../utils/validators';
import { BRAND_NAME } from '../../utils/constants';

export default function AdminLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.username, data.password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <div className="px-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-brand-navy/70 hover:text-brand-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to website
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt={BRAND_NAME} className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-brand-navy">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">{BRAND_NAME}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Username</label>
            <input
              {...register('username')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all duration-300"
              placeholder="admin"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all duration-300"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
          </Button>
        </form>
      </Card>
      </div>
    </div>
  );
}

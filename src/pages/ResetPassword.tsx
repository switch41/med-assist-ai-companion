
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkResetToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      console.log('Reset password page loaded with tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
      
      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Error setting session for password reset:', error);
            toast.error('Invalid or expired reset link. Please request a new password reset.');
            navigate('/auth');
          } else if (data.session) {
            console.log('Password reset session established successfully');
            setIsValidToken(true);
            toast.success('You can now set your new password.');
          }
        } catch (error) {
          console.error('Exception during password reset token validation:', error);
          toast.error('Invalid reset link. Please request a new password reset.');
          navigate('/auth');
        }
      } else {
        console.log('No valid reset tokens found in URL');
        toast.error('Invalid reset link. Please request a new password reset.');
        navigate('/auth');
      }
      
      setIsCheckingToken(false);
    };

    checkResetToken();
  }, [navigate, searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting password reset');
    setIsLoading(true);

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      console.log('Password update response:', { data, error });

      if (error) {
        console.error('Password reset error:', error);
        toast.error(`Failed to reset password: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        console.log('Password reset successful');
        toast.success("Password reset successfully! You are now logged in.");
        
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/');
      }
    } catch (error: any) {
      console.error('Password reset failed:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
            </div>
            <CardTitle className="text-xl font-semibold text-center text-gray-700">Verifying reset link...</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Please wait while we verify your password reset request.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Lock size={32} className="text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold text-center text-gray-800">Reset link expired</CardTitle>
            <CardDescription className="text-center text-gray-600">
              This password reset link is invalid or has expired. Password reset links are only valid for a limited time for security reasons.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-medical-primary hover:bg-medical-primary/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Button>
            <p className="text-sm text-gray-500 text-center">
              You can request a new password reset from the sign in page.
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <ShieldCheck size={32} className="text-green-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-semibold text-center text-gray-800">Create new password</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Your new password must be different from your previous password and contain at least 6 characters.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter your new password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <p className="text-xs text-gray-500">Must be at least 6 characters long</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-medical-primary hover:bg-medical-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? "Updating password..." : "Update password"}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/auth')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const handleSignIn = async () => {
    setLoading(true);
    setShowAlert(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAlertType('error');
        setAlertMessage(error.message);
        setShowAlert(true);
        toast.error(error.message);
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(error.message);
      setShowAlert(true);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setShowAlert(false);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        setAlertType('error');
        setAlertMessage(error.message);
        setShowAlert(true);
        toast.error(error.message);
      } else {
        setAlertType('success');
        setAlertMessage('Account created! Check your email to verify.');
        setShowAlert(true);
        toast.success('Account created! Check your email to verify.');
      }
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(error.message);
      setShowAlert(true);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setShowAlert(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setAlertType('error');
        setAlertMessage(error.message);
        setShowAlert(true);
        toast.error(error.message);
      } else {
        setResetEmailSent(true);
        setAlertType('success');
        setAlertMessage('Password reset email sent!');
        setShowAlert(true);
        toast.success('Password reset email sent!');
      }
    } catch (error: any) {
      setAlertType('error');
      setAlertMessage(error.message);
      setShowAlert(true);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-medical-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-medical-primary">
            SwitchHealthCare
          </CardTitle>
          <CardDescription>
            Your AI-powered healthcare companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isLogin ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Login
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              {showAlert && (
                <Alert variant={alertType}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button onClick={handleSignIn} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="register">
              {showAlert && (
                <Alert variant={alertType}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button onClick={handleSignUp} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Sign Up
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

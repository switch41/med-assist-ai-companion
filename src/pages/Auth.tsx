
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserRound, KeyRound, Mail, User, Phone, Calendar } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Load remembered email if available
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
      console.log('Loaded remembered email:', rememberedEmail);
    }

    // Handle email verification from URL parameters
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type) {
        console.log('Handling email verification:', { token, type });
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as any
          });
          
          if (error) {
            console.error('Email verification error:', error);
            toast.error('Email verification failed. Please try signing in.');
          } else {
            console.log('Email verification successful:', data);
            toast.success('Email verified successfully! You are now signed in.');
            navigate('/');
          }
        } catch (error) {
          console.error('Email verification exception:', error);
          toast.error('Email verification failed. Please try signing in.');
        }
      }
    };

    const checkSession = async () => {
      console.log('Checking existing session...');
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('Session check result:', { data, error });
        
        if (data.session) {
          console.log('User already authenticated, redirecting to home');
          navigate('/');
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    // Handle email verification first, then check session
    handleEmailVerification();
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, session });
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        console.log('User authenticated, navigating to home');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting sign in with:', { email: email.trim(), rememberMe });
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "Login failed. Please try again.";
        
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
            break;
          case 'Email not confirmed':
            errorMessage = "Please check your email and click the confirmation link before signing in.";
            break;
          case 'Too many requests':
            errorMessage = "Too many login attempts. Please wait a moment and try again.";
            break;
          default:
            errorMessage = `Login failed: ${error.message}`;
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Handle remember me option
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim().toLowerCase());
          console.log('Email saved to localStorage for remember me');
        } else {
          localStorage.removeItem('rememberedEmail');
          console.log('Email removed from localStorage');
        }

        console.log('Sign in successful!');
        toast.success("Welcome back! Signed in successfully.");
        // Navigation will be handled by the auth state change listener
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting sign up with:', { email: email.trim(), firstName, lastName });
    setIsLoading(true);

    if (!firstName || !lastName) {
      toast.error("Please provide your first and last name");
      setIsLoading(false);
      return;
    }

    if (!email || !password) {
      toast.error("Email and password are required");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            date_of_birth: dateOfBirth,
            gender: gender
          }
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        console.error('Sign up error:', error);
        let errorMessage = "Sign up failed. Please try again.";
        
        switch (error.message) {
          case 'User already registered':
            errorMessage = "An account with this email already exists. Please sign in instead.";
            break;
          case 'Password should be at least 6 characters':
            errorMessage = "Password must be at least 6 characters long.";
            break;
          default:
            errorMessage = `Sign up failed: ${error.message}`;
        }
        
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      if (data.user && !data.session) {
        // Email confirmation required
        console.log('Sign up successful, email confirmation required');
        toast.success("Account created successfully! Please check your email for verification link.");
      } else if (data.session) {
        // Auto sign-in (email confirmation disabled)
        console.log('Sign up successful with auto sign-in');
        toast.success("Account created successfully! Welcome to MediAssist!");
        // Navigation will be handled by the auth state change listener
      }
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-medical-primary/20 p-3 rounded-full">
              <UserRound size={32} className="text-medical-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">MediAssist</CardTitle>
          <CardDescription className="text-center">
            Your personal healthcare assistant
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm font-normal">
                    Remember my email
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-medical-primary hover:bg-medical-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="first-name"
                        placeholder="First Name"
                        className="pl-10"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone number"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="date-of-birth">Date of Birth (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="date-of-birth"
                        type="date"
                        className="pl-10"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        autoComplete="bday"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="gender">Gender (Optional)</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-medical-primary hover:bg-medical-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;

"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Eye, EyeOff, ArrowLeft, Shield, Lock, CheckCircle, Users, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import { useAuth } from '@/context/LoginContext';
import TermsAndConditionsModal from '../components/Terms'
import { set } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [terms, setTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useRouter()


  const [testState, setTestState] = useState(0);

  // useEffect(() => {
  //   console.log('Test State value:', testState);
  // }, [testState]);

  const { loginUser }: any = useAuth()
  const disabled = !terms


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }
    if (!terms) {
      toast.warning("Please agree to the Terms and Conditions before signing in.");
      setIsSubmitting(false);
      return;
    }

    try {
      setError(null);
      const response = await loginUser(email, password); // Use the new loginUser function

      const { status, message } = response;
      // console.log('refreshToken is ', rtoken);
      // console.log('response in login component', response)
      if (status === 'success') {
        toast.success("Login successful!");
        navigate.replace('/personaldashboard');
      } else if (status === 'first_time') {
        toast.info("Welcome! Please set your password.");
        navigate.replace(`/set-password?token=${response.token}`);
      } else if (message === 'Invalid credentials') {
        const errMsg = 'Invalid email or password. Please try again.';
        setError(errMsg);
        // toast.error(errMsg);
      } else if (status === 'error') {
        const errMsg = message || 'Login failed.';
        setError(errMsg);
        // toast.error(errMsg);
      }
      else if (status === 'un_verify') {
        const errMsg = message || 'Your account is under verification';
        setError(errMsg);
        // toast.error(errMsg);
      }
      else if (status === 'incorrect password') {
        const errMsg = message || 'Please enter valid given password';
        setError(errMsg);
        // toast.error(errMsg);
      }
      else {
        setError('Unexpected response from server.');
        toast.error('Unexpected response from server.');
      }

    } catch (err) {
      console.error('Login error:', err);
      const errMsg = 'Login failed. Please check your credentials and try again.';
      setError(errMsg);
      // toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
      setPassword('');
    }
  };


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden items-center justify-center">

        <div className="relative z-10 w-full max-w-lg px-12">
          {/* Logo Section */}
          <div className="mb-12 text-center lg:text-left">
            <div className='flex justify-center'>
              <img src="/logo3.avif" alt="JP Law Suvidha Logo" className="h-auto w-[200px] rounded-2xl" />
            </div>
            <h1 className="text-5xl mb-4 text-white font-poppins leading-tight text-center mt-4">
              JP Law Suvidha
            </h1>
            <p className="text-xl text-white font-medium  text-center font-Poppins">
              A sovereign bridge between <span className="text-blue-400">Legal Expertise</span> and <span className="text-blue-400">Modern Technology</span>.
            </p>
          </div>

          {/* Value Proposition Cards */}
          {/* <div className="grid gap-4 mt-12">
            {[
              {
                icon: Shield,
                title: "Bank-Level Security",
                desc: "End-to-end encryption & AES-256 compliance standards.",
                color: "text-blue-400",
                bgColor: "bg-blue-400/10"
              },
              {
                icon: Users,
                title: "Advocate Network",
                desc: "Access a verified ecosystem of legal professionals and tools.",
                color: "text-indigo-400",
                bgColor: "bg-indigo-400/10"
              },
              {
                icon: CheckCircle,
                title: "Trusted Platform",
                desc: "The premier choice for modern, digitally-driven law firms.",
                color: "text-emerald-400",
                bgColor: "bg-emerald-400/10"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-lg mb-1">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Footer Text for Left Panel */}

        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 lg:p-8">

          <Link href='/' className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors group">
            <>
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </></Link>
          <div className="lg:hidden">
            <img src='/jpicon4.png' className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <div className="lg:hidden w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <img src='/jpicon4.png' className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to access your account</p>
                <span className="block mt-1 text-xs text-gray-700">* Only advocates are permitted to sign in</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertDescription className="flex items-center gap-2 font-medium">
                    < Shield className="w-4 h-4 shrink-0" />
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              {/* Email Field */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full h-14 px-4 pt-6 pb-2 border-2 border-gray-400 rounded-lg hover:border-blue-700 "
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <Label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${emailFocused || email
                    ? 'top-2 text-xs text-blue-700 font-medium'
                    : 'top-4 text-base text-gray-400'
                    }`}
                >
                  Email Address
                </Label>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full h-14 px-4 pt-6 pb-2 pr-12 rounded-lg bg-white border-2 border border-gray-400 hover:border-blue-700"
                  placeholder=" "
                  autoComplete="off"
                  required
                />
                <Label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${passwordFocused || password
                    ? 'top-2 text-xs text-blue-700 font-medium'
                    : 'top-4 text-base text-gray-400'
                    }`}
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-end text-blue-500 curor-pointer">
                <Link href='/forgot-password'>Forgot Password</Link>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl transition-all hover:bg-blue-50 hover:border-blue-200">
                <Checkbox
                  id="terms"
                  checked={terms}
                  onCheckedChange={(checked) => setTerms(checked as boolean)}
                  className="mt-1 rounded border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 cursor-pointer"
                />
                <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium underline-offset-4 hover:underline transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTerms(true);
                    }}
                  >
                    Terms and Conditions
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-medium underline-offset-4 hover:underline transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Privacy Policy would be shown here');
                    }}
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>

              <button
                disabled={disabled}
                type="submit"
                onClick={() => (window as any).datalayer?.push({
                  event: 'advocate_login',
                  button_name: 'Sign In'
                })}
                className={`w-full h-12 bg-black text-white font-medium transition-colors focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 rounded-lg ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer  hover:bg-blue-700'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing you in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2" >
                    <Lock className="w-5 h-5" />
                    Sign In
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href='/signup' className='text-blue-500'> Subscribe</Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                🔒 This platform uses enterprise-grade security and is compliant with legal industry standards including GDPR and CCPA.
              </p>
            </div>
          </div>
        </div>
      </div >

      {/* Terms and Conditions Modal */}
      {
        showTerms && (
          <TermsAndConditionsModal
            onClose={() => setShowTerms(false)}
            onAccept={() => {
              setTerms(true);
              setShowTerms(false);
            }}
          />
        )
      }
    </div >
  );
}

export default LoginForm
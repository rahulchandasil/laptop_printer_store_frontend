import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, KeyRound, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../services/api";

function OtpLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  // Array of 6 strings for OTP
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const normalizeEmail = (value) => value.trim().toLowerCase();
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const maskEmail = (email) => {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 1) return `*@${domain}`;
    return `${name[0]}***@${domain}`;
  };

  const sendOtp = async (e) => {
    if (e) e.preventDefault();
    const trimmedEmail = normalizeEmail(email);

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/send-otp", {
        email: trimmedEmail,
      });

      if (response.data.success) {
        setOtpSent(true);
        setCooldown(60);
        // Focus first OTP input after short delay
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't send the verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    await sendOtp();
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const trimmedEmail = normalizeEmail(email);
    const trimmedOtp = otpArray.join("");

    if (trimmedOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/verify-otp", {
        email: trimmedEmail,
        otp: trimmedOtp,
      });

      if (response.data.success) {
        setSuccess(true);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Small delay to show success state before redirecting
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "That code isn't correct. Please try again.");
      setLoading(false);
    }
  };

  // OTP Input Logic
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Take just the last character if multiple are entered
    const digit = value.slice(-1);
    
    const newOtpArray = [...otpArray];
    newOtpArray[index] = digit;
    setOtpArray(newOtpArray);
    
    if (error) setError("");

    // Move to next input if filled
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move back on backspace if empty
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtpArray = [...otpArray];
    for (let i = 0; i < pastedData.length; i++) {
      newOtpArray[i] = pastedData[i];
    }
    setOtpArray(newOtpArray);
    
    // Focus appropriate input
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
    if (error) setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans selection:bg-slate-200 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Brand / Logo Area */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-colors duration-300 ${success ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}>
            {success ? <CheckCircle2 className="h-6 w-6" /> : (otpSent ? <KeyRound className="h-6 w-6" /> : <Mail className="h-6 w-6" />)}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {success ? "Login Successful" : (otpSent ? "Verify your email" : "Sign in with Email")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {success 
              ? "Redirecting you to the store..."
              : (otpSent 
                  ? "Enter the 6-digit code sent to your email." 
                  : "We'll send a one-time passcode to your inbox.")}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="p-8">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden rounded-xl bg-red-50 ring-1 ring-inset ring-red-200"
                >
                  <div className="flex items-start gap-3 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!otpSent ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if(error) setError(""); }}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="block w-full rounded-xl border-0 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-950 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-4 text-center">
                  <span className="text-sm text-slate-500">We sent a 6-digit verification code to:</span>
                  <span className="mt-1 font-semibold text-slate-900">{maskEmail(email)}</span>
                </div>

                <div>
                  <label className="sr-only">Enter 6-Digit OTP</label>
                  <div 
                    className="flex justify-between gap-2 sm:gap-3"
                    onPaste={handleOtpPaste}
                  >
                    {otpArray.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        disabled={success}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="h-12 w-10 shrink-0 rounded-xl border-0 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none ring-1 ring-inset ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-inset focus:ring-slate-900 disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${success ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600' : 'bg-slate-950 hover:bg-slate-800 disabled:bg-slate-500 focus:ring-slate-900'}`}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Verifying...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    disabled={success}
                    onClick={() => {
                      setOtpSent(false);
                      setOtpArray(new Array(6).fill(""));
                      setError("");
                    }}
                    className="font-medium text-slate-500 transition hover:text-slate-900 disabled:opacity-50"
                  >
                    Change Email
                  </button>

                  <button
                    type="button"
                    disabled={cooldown > 0 || loading || success}
                    onClick={handleResendOtp}
                    className="font-medium text-blue-600 transition hover:text-blue-700 disabled:text-slate-400"
                  >
                    {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
          
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-5 text-center sm:px-8">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Password Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OtpLogin;

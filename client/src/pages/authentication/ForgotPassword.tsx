/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendOtp, UpdateOtp, ValidateOtp } from '../../services/auth/authApi';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import loginImage from "../../assets/login-image1.jpg";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState({
    sendOtp: false,
    verifyOtp: false,
    resetPassword: false,
    resendOtp: false
  });
  const navigate = useNavigate();
  const maskedMobile = mobile ? mobile.slice(0, -3).replace(/./g, "X") + mobile.slice(-3) : "";

  // Countdown timer effect
  useEffect(() => {
    let interval: number;

    if (isTimerRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      toast.error('OTP has expired. Please request a new one.');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = async () => {
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid mobile number.");
      return;
    }

    setLoading(prev => ({ ...prev, sendOtp: true }));

    try {
      const body = { mobile }
      const response = await sendOtp(body);
      if (response?.status === 200) {
        setStep(2);
        setTimeLeft(600);
        setIsTimerRunning(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, sendOtp: false }));
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please fill otp.');
      return;
    }

    // Check if OTP has expired
    if (timeLeft === 0) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    setLoading(prev => ({ ...prev, verifyOtp: true }));

    try {
      const body = {
        mobile,
        otp
      }
      const response = await ValidateOtp(body);
      if (response?.status === 200) {
        setIsTimerRunning(false);
        setStep(3);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(prev => ({ ...prev, verifyOtp: false }));
    }
  };

  const handleResetPassword = async () => {
    if (!password || !cPassword || !mobile) {
      toast.error('Please fill all required fields.')
      return;
    }
    if (password !== cPassword) {
      toast.error('Password & confirm password should be match.');
      return;
    }

    setLoading(prev => ({ ...prev, resetPassword: true }));

    try {
      const body = {
        mobile,
        password
      }

      const response = await UpdateOtp(body);
      if (response?.status === 200) {
        setCPassword('');
        setMobile('');
        setOtp('');
        setPassword('');
        setTimeLeft(600);
        setIsTimerRunning(false);
        setStep(1)
        navigate('/auth/login')
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, resetPassword: false }));
    }
  };

  // Resend OTP functionality
  const handleResendOtp = async () => {
    if (timeLeft > 0 && isTimerRunning) {
      toast.error(`Please wait ${formatTime(timeLeft)} before requesting a new OTP`);
      return;
    }

    setLoading(prev => ({ ...prev, resendOtp: true }));

    try {
      const body = {
        mobile
      }
      const response = await sendOtp(body);
      if (response?.status === 200) {
        setTimeLeft(600); // Reset to 10 minutes
        setIsTimerRunning(true); // Start the countdown
        setOtp('');
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, resendOtp: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
          {/* Image Section */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative">
            <img
              src={loginImage}
              alt="Forgot Password visual"
              className="w-full h-full object-cover opacity-90 mix-blend-overlay"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
              <p className="text-xl mb-8">
                {step === 1 && "Enter your mobile number to receive a verification code"}
                {step === 2 && "Enter the OTP sent to your mobile number"}
                {step === 3 && "Create a strong new password for your account"}
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 1 ? 'bg-blue-300 text-blue-900' : 'bg-white/20 text-white'}`}>
                    1
                  </div>
                  <span className={step >= 1 ? 'text-blue-100' : 'text-white/70'}>Enter Mobile Number</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 2 ? 'bg-blue-300 text-blue-900' : 'bg-white/20 text-white'}`}>
                    2
                  </div>
                  <span className={step >= 2 ? 'text-blue-100' : 'text-white/70'}>Verify OTP</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step >= 3 ? 'bg-blue-300 text-blue-900' : 'bg-white/20 text-white'}`}>
                    3
                  </div>
                  <span className={step >= 3 ? 'text-blue-100' : 'text-white/70'}>Reset Password</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 p-8 sm:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Reset Your Password
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Remember your password?{" "}
                <Link
                  className="font-medium hover:underline text-[#0019f8] hover:text-[#0600c0] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  to="/auth/login"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>

            <div className="mt-8">
              {/* Step Progress Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  {[1, 2, 3].map((stepNumber) => (
                    <React.Fragment key={stepNumber}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNumber
                        ? 'bg-[#0019f8] text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div className={`w-12 h-1 mx-2 ${step > stepNumber ? 'bg-[#0019f8]' : 'bg-slate-300 dark:bg-slate-600'
                          }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <form className="space-y-6">
                {/* Step 1: Mobile Input */}
                {step === 1 && (
                  <div>
                    <label htmlFor="mobile" className="text-black dark:text-white mb-1 block">
                      Mobile Number
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <input
                          type="tel"
                          id="mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          maxLength={10}
                          minLength={10}
                          required
                          className="bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter your mobile number"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading.sendOtp}
                        className="px-4 py-3 bg-[#0019f8] text-white rounded-lg font-medium hover:bg-[#0600c0] transition-colors duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]"
                      >
                        {loading.sendOtp ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {loading.sendOtp ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <div>
                    <label htmlFor="otp" className="text-black dark:text-white mb-1 block">
                      OTP Verification
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <input
                          type="number"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter OTP"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading.verifyOtp}
                        className="px-4 py-3 bg-[#0019f8] text-white rounded-lg font-medium hover:bg-[#0600c0] transition-colors duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      >
                        {loading.verifyOtp ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {loading.verifyOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>

                    {/* Timer and Resend OTP */}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        OTP sent to {maskedMobile}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isTimerRunning ? (
                          <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-[#0019f8]'}`}>
                            {formatTime(timeLeft)}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading.resendOtp || (isTimerRunning && timeLeft > 0)}
                            className="text-sm text-[#0019f8] hover:text-[#0600c0] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {loading.resendOtp ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-[#0019f8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                              </>
                            ) : (
                              'Resend OTP'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                  <>
                    <div>
                      <label htmlFor="password" className="text-black dark:text-white mb-1 block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPass ? <IoEyeOff size={20} color="#0800ff" /> : <IoEye size={20} color="#0800ff" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cPassword" className="text-black dark:text-white mb-1 block">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="cPassword"
                          value={cPassword}
                          onChange={(e) => setCPassword(e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading.resetPassword}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading.resetPassword ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting...
                        </>
                      ) : 'Reset Password'}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from "react";
import { LoginApi } from "../../services/auth/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../feature/auth/authSlice";
import { IoEyeOff, IoEye } from "react-icons/io5";
import * as yup from 'yup';
import { useFormik } from "formik";
import loginImage from "../../assets/login-image1.jpg";

const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup.string()
      .required('Email is required')
      .email('Email format is invalid'),
    password: yup.string()
      .required('Password is required')
      .min(6, 'Password must have at least 6 characters')
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await LoginApi({
          email: values.email,
          password: values.password
        });
        if (response) {
          dispatch(login({ data: response }));
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
          {/* Image Section */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative">
            <img
              src={loginImage}
              alt="Login visual"
              className="w-full h-full object-cover opacity-90 mix-blend-overlay"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-12 text-white">
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-xl mb-8">Sign in to access your personalized dashboard and continue your journey with us.</p>
              <div className="flex items-center hidden">
                <div className="w-12 h-1 bg-blue-300 mr-4"></div>
                <span className="text-blue-200">Join thousands of happy users</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 bg-white dark:bg-slate-800 p-8 sm:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Don't have an account yet?{" "}
                <Link
                  className="font-medium hover:underline text-[#0019f8] hover:text-[#0600c0] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  to="/sign-up"
                >
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm "
                disabled
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 46 47"
                  fill="none"
                >
                  <path
                    d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                    fill="#34A853"
                  />
                  <path
                    d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                    fill="#EB4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                <span className="mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
              </div>

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className=" text-black dark:text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border
                          ${formik.touched.email && formik.errors.email ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-700'}
                         focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500
                         dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    placeholder="Email..."
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="text-black dark:text-white">
                      Password
                    </label>
                     <Link
                      to='/forgot-password'
                      type="button"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`bg-slate-100 dark:bg-slate-800 p-3 sm:p-4 h-12 block w-full rounded-lg sm:text-sm disabled:opacity-50 disabled:pointer-events-none dark:text-slate-400 border
                          ${formik.touched.password && formik.errors.password ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-700'}
                         focus:outline-none focus:ring-0 focus:ring-blue-500 focus:border-blue-500
                         dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={handleShowPass}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPass ? <IoEyeOff size={20} color="#0800ff" /> : <IoEye size={20} color="#0800ff" />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                  )}
                </div>

                                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
"use client"
import Image from 'next/image'
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';


const Modal = ({ onClose }) => {

  const [logIn, setLogIn] = useState(false);
  const [logging, setLogging] = useState(false);
  const [forgetPWD, setForgetPWD] = useState(false);
  const [userName, setUserName] = useState('')
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !email.includes('@') || !password)
      return alert('Invalid details');

    try {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Must be present to allow cookie to be saved
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        setLogging(false);

        window.location.href = '/dashboard';

      }
      if (!res.ok) {
        let errorShow = document.querySelector("#errorShow")
        errorShow.style.display = 'block'
      }

    } catch (error) {
      console.error(error)
    }
  };

  const register = async (e) => {

    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !email.includes('@') || !password || !userName)
      return alert('Invalid details');

    setLogging(true);

    try {
      let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''
      const res = await fetch(`${domain}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ Must be present to allow cookie to be saved
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          // country: country
        }),
      });

      setLogging(false);

      const data = await res.json();

      if (res.ok && data.access_token) {
        // 👇 Handle redirect client-side only
        window.location.href = '/dashboard';
      }
      if (!res.ok) {
        alert(data.message)
      }

    } catch (error) {
      console.error(error)
    }

    //  window.location.reload();

  }

  const forgotPassword = async (e) => {

    e.preventDefault();

    const email = e.target.email.value.trim();

    if (!email || !email.includes('@'))
      return alert('Invalid email address');

    const form = document.querySelector('[name="forget-pwd-form"]');

    const formData = new FormData(form);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.status != 201)
      return alert(data.message)

    //console.log(data.message)

    if (res.status == 201) {
      alert(data.message)
      router.reload()
    }
    else {
      alert('An error occured. Please try again!')
    }
  }


  const togglePasswordLogin = async (e) => {
    let password = document.querySelector('#login-form [name="password"]');
    console.log(password)
    password.type = password.type == 'password' ? 'text' : 'password';
  }

  const togglePasswordRegister = async (e) => {
    let password = document.querySelector('#register-form [name="password"]');
    password.type = password.type == 'password' ? 'text' : 'password';
  }

  const handleUserName = (e) => {
    if (e.target.value.match("^[a-zA-Z ]*$") != null) {
      setUserName(e.target.value);
    }
  }


  useEffect(() => {
  }, [userName])

  const signByGoogle = async () => {

    let domain = (process.env.NEXT_PUBLIC_Phase == 'development') ? process.env.NEXT_PUBLIC_Backend_Domain : ''

    window.location.href = `${domain}/auth/google`;
  }
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true); // Make sure this only renders on client
  }, []);

  if (!mounted) return null;
  
  const color = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'

  return (
    <>

      <div
        id="authModal"
        className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-6"
        role="dialog"
        aria-labelledby="authModalLabel"
      >

        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div
          className="relative z-50 rounded-2xl shadow-2xl w-full max-w-[94vw] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] max-h-[88vh] overflow-y-auto"
          style={{ backgroundColor: color, border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-500 rounded-t-2xl" />
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 z-10 text-lg font-bold"
          >
            ✕
          </button>

          {/* Header */}
          <div className="px-5 pt-6 pb-3">
            <div className="text-center space-y-2">
              <img src="/images/icon1.png" alt="Logo" className="mx-auto h-10" />
              <h2 id="authModalLabel" className="text-xl font-bold text-gray-900 dark:text-white">
                NCLEX Portal
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your nursing excellence journey
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-5 mb-4">
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg" style={{ border: '1px solid var(--border)' }}>
              {!forgetPWD ? (
                <>
                  <button
                    className={`flex-1 py-2 px-3 rounded-md font-semibold text-xs transition-all duration-200 ${!logIn ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-cyan-200/60 dark:ring-cyan-900/60' : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setLogIn(false)}
                  > Sign In
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 rounded-md font-semibold text-xs transition-all duration-200 ${logIn ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-cyan-200/60 dark:ring-cyan-900/60' : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    onClick={() => setLogIn(true)}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
                  onClick={() => { setLogIn(false); setForgetPWD(false); }}
                >
                  ← Back to Sign In
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 pb-6">
            {/* Sign In */}
            {!forgetPWD && !logIn && (
              <form id="login-form" onSubmit={login} method="post" className="space-y-4" >
                <p style={{ display: "none", color: "red" }} id='errorShow' className="text-sm text-red-600 dark:text-red-400 mb-2">Invalid credentials</p>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@address.com"
                    maxLength={50}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="min. 8 characters"
                    minLength={8}
                    maxLength={12}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                  />
                  <span onClick={togglePasswordLogin} className="absolute right-3 top-9 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  </span>
                  <span className="invalid-feedback">Please enter a valid password.</span>
                </div>
                <div className="flex justify-end">
                  <span
                    onClick={() => setForgetPWD(true)}
                    className="text-xs cursor-pointer hover:underline font-medium text-cyan-600 dark:text-cyan-400"
                  >
                    Forgot password?
                  </span>
                </div>
                <button type="submit" disabled={logging} className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Sign In
                </button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                  </div>
                </div>
                <button type="button" onClick={signByGoogle}
                  className="w-full flex items-center justify-center py-2.5 gap-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-all">
                  <Image src="/images/svg/google-logo.svg" alt="" width={18} height={18} />Continue with Google
                </button>

              </form>



            )}

            {/* Sign Up */}
            {!forgetPWD && logIn && (
              <form id="register-form" onSubmit={register} method="post" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    value={userName}
                    onChange={handleUserName}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@address.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="8+ characters"
                    minLength={8}
                    maxLength={15}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                  />
                  <span onClick={togglePasswordRegister} className="absolute right-3 top-9 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                    </svg>
                  </span>
                  <span className="invalid-feedback">Please enter a valid password.</span>

                </div>
                <button type="submit" disabled={logging} className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Create Account
                </button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                  </div>
                </div>
                <button type="button" onClick={signByGoogle}
                  className="w-full flex items-center justify-center py-2.5 gap-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-all">
                  <Image src="/images/svg/google-logo.svg" alt="" width={18} height={18} />Continue with Google
                </button>
              </form>
            )}

            {/* Forgot Password */}
            {forgetPWD && (
              <form onSubmit={forgotPassword} className="space-y-4" >
                <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter your email, and we'll send you a reset link.
                </p>
                <input
                  type="email"
                  name="email"
                  placeholder="email@address.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-900 outline-none transition-all"
                />
                <button type="submit" disabled={logging} className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal
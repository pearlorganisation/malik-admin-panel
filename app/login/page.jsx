"use client";

import { useState } from "react";
import { useLoginMutation } from "@/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LayoutGrid } from "lucide-react";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [errorMsg, setErrorMsg] = useState("");

const [login, { isLoading }] = useLoginMutation();
const dispatch = useDispatch();
const router = useRouter();

const handleLogin = async (e) => {
e.preventDefault();
setErrorMsg("");


try {
  const res = await login({ email, password }).unwrap();
  dispatch(setUser(res.user));
  router.push("/");
} catch (error) {
  setErrorMsg(error?.data?.message || "Login failed");
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


  <div className="w-full max-w-md">

    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-blue-50 p-3 rounded-xl">
          <LayoutGrid className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Please enter your details to sign in.
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="relative mt-1">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

           
          </div>

          <div className="relative mt-1">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-slate-900 to-slate-800 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
        >
          {isLoading ? "Signing in..." : "Sign In →"}
        </button>

      </form>
    </div>

    <p className="text-center text-xs text-gray-500 mt-6">
      © 2026 Admin Dashboard. All rights reserved.
    </p>

  </div>
</div>
);
}

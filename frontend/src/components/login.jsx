import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { 
  Loader, 
  Mail, 
  Lock, 
  Sparkles, 
  Shield, 
  ArrowRight, 
  Home,
  CheckCircle,
  User,
  Key
} from "lucide-react";
import { Backendurl } from "../App";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';

// Enhanced Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const floatingAnimation = {
  y: [-3, 3, -3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const sparkleAnimation = {
  scale: [1, 1.2, 1],
  rotate: [0, 180, 360],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${Backendurl}/api/users/login`,
        formData
      );
      if (response.data.success) {
        await login(response.data.token, response.data.user);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-transparent to-purple-100/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-indigo-100/20 to-transparent"></div>
      </div>

      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"
        animate={floatingAnimation}
      />
      <motion.div 
        className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"
        animate={{
          ...floatingAnimation,
          transition: { ...floatingAnimation.transition, delay: 1 }
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-xl"
        animate={{
          ...floatingAnimation,
          transition: { ...floatingAnimation.transition, delay: 2 }
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          <motion.div
            variants={cardVariants}
            className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-xl"></div>
            
            <div className="relative p-8 pt-12">
              {/* Logo & Title Section */}
              <motion.div 
                className="text-center mb-10"
                variants={inputVariants}
              >
                <Link to="/" className="inline-block group">
                  <motion.div 
                    className="flex items-center justify-center gap-3 mb-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg"
                      animate={pulseAnimation}
                    >
                      <Home className="w-6 h-6 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Propertia
                    </h1>
                    <motion.div
                      animate={sparkleAnimation}
                      className="text-yellow-400"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </motion.div>
                </Link>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Sign in to your secure account
                  </p>
                </motion.div>
              </motion.div>

              {/* Enhanced Form */}
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={inputVariants}
              >
                {/* Email Field */}
                <motion.div 
                  className="space-y-2"
                  variants={inputVariants}
                >
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4 text-blue-500" />
                    Email address
                  </label>
                  <div className="relative">
                    <motion.input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      className="w-full px-4 py-4 pl-12 rounded-xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="name@company.com"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.div 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      animate={emailFocused ? { scale: 1.1, color: "#3B82F6" } : { scale: 1 }}
                    >
                      <User className="w-5 h-5" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  className="space-y-2"
                  variants={inputVariants}
                >
                  <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Lock className="w-4 h-4 text-blue-500" />
                    Password
                  </label>
                  <div className="relative">
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full px-4 py-4 pl-12 pr-12 rounded-xl bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-gray-800 placeholder-gray-400"
                      placeholder="••••••••"
                      whileFocus={{ scale: 1.02 }}
                    />
                    <motion.div 
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      animate={passwordFocused ? { scale: 1.1, color: "#3B82F6" } : { scale: 1 }}
                    >
                      <Key className="w-5 h-5" />
                    </motion.div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </motion.div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <Link 
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 font-semibold shadow-xl shadow-blue-500/25 relative overflow-hidden group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Sign in</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </motion.button>

                {/* Enhanced Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-gray-500 font-medium">
                      Don&apos;t have an account?
                    </span>
                  </div>
                </div>

                {/* Enhanced Sign Up Link */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/signup"
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:border-blue-200 transition-all duration-300 font-medium group"
                  >
                    <User className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors duration-300" />
                    Create an account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
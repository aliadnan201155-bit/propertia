import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  ArrowLeft, 
  Sparkles, 
  Search, 
  Star, 
  Zap, 
  Moon,
  Sun,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Enhanced Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const floatingAnimation = {
  y: [-10, 10, -10],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const sparkleAnimation = {
  scale: [1, 1.3, 1],
  rotate: [0, 180, 360],
  opacity: [0.7, 1, 0.7],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const glowAnimation = {
  boxShadow: [
    "0 0 40px rgba(59, 130, 246, 0.3)",
    "0 0 80px rgba(59, 130, 246, 0.5)",
    "0 0 40px rgba(59, 130, 246, 0.3)"
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const suggestions = [
    { icon: Home, text: "Browse Properties", path: "/properties" },
    { icon: Search, text: "Search Listings", path: "/search" },
    { icon: MapPin, text: "Explore Areas", path: "/locations" },
    { icon: Shield, text: "Learn About Us", path: "/about" }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              darkMode ? 'bg-blue-400/30' : 'bg-blue-500/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed pointer-events-none z-10 w-32 h-32 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${darkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} 0%, transparent 70%)`,
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-20 p-3 rounded-full transition-all duration-300 ${
          darkMode 
            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
            : 'bg-gray-800/20 text-gray-700 hover:bg-gray-800/30'
        }`}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Animated 404 */}
          <motion.div className="relative mb-12">
            <motion.div
              variants={itemVariants}
              animate={glowAnimation}
              className={`text-8xl md:text-9xl font-black mb-4 relative ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}
            >
              404
            </motion.div>
            
            {/* Floating Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={sparkleAnimation}
              >
                <Sparkles className={`w-6 h-6 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-500'
                }`} />
              </motion.div>
            ))}
          </motion.div>

          {/* Error Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Oops! Page Not Found
            </h1>
            
            <motion.p 
              className={`text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              animate={floatingAnimation}
            >
              The page you&apos;re looking for seems to have taken a vacation! 
              Don&apos;t worry, we&apos;ll help you find your way back home.
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <motion.button
              onClick={() => navigate(-1)}
              className={`group relative overflow-hidden px-8 py-4 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60 border border-gray-700' 
                  : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-lg'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Go Back
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <Link to="/">
              <motion.div
                className={`group relative overflow-hidden px-8 py-4 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                } shadow-xl`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center">
                  <Home className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Return Home
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Quick Suggestions */}
          <motion.div variants={itemVariants} className="mb-8">
            <h3 className={`text-xl font-semibold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Or explore these popular sections:
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestions.map((item, index) => (
                <Link key={index} to={item.path}>
                  <motion.div
                    className={`group p-4 rounded-xl transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-800/30 hover:bg-gray-700/50 border border-gray-700/50' 
                        : 'bg-white/60 hover:bg-white/80 border border-gray-200/50 shadow-md'
                    }`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <item.icon className={`w-8 h-8 mx-auto mb-2 transition-all duration-300 ${
                      darkMode 
                        ? 'text-blue-400 group-hover:text-blue-300' 
                        : 'text-blue-600 group-hover:text-blue-700'
                    } group-hover:scale-110`} />
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.text}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div 
            variants={itemVariants}
            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-center gap-6 flex-wrap`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Time wasted: 0.5 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Error level: Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Recovery speed: Lightning fast</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
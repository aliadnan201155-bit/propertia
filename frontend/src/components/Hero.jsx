import { useState } from "react";
import { Search, MapPin, ArrowRight, Star, Users, Home, Shield, Sparkles, TrendingUp, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroimage from "../assets/images/heroimage.png";
import { RadialGradient } from "react-text-gradients";

const popularLocations = [
  "Karachi",
  "Islamabad", 
  "Lahore",
  "Faisalabad",
];

const quickFilters = [
  { label: "Apartments", icon: Home, count: "2.5k+" },
  { label: "Houses", icon: Home, count: "1.8k+" },
  { label: "Villas", icon: Home, count: "750+" },
  { label: "Studios", icon: Home, count: "1.2k+" }
];

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers", color: "from-blue-500 to-cyan-500" },
  { icon: Home, value: "25K+", label: "Properties Listed", color: "from-green-500 to-emerald-500" },
  { icon: Star, value: "4.9", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
  { icon: Shield, value: "100%", label: "Verified Properties", color: "from-purple-500 to-pink-500" }
];

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6
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
  scale: [1, 1.2, 1],
  rotate: [0, 180, 360],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [propertyType, setPropertyType] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSubmit = (location = searchQuery) => {
    if (location.trim()) {
      navigate(`/properties?location=${encodeURIComponent(location)}&type=${propertyType}`);
    }
  };

  const handleLocationClick = (location) => {
    setSearchQuery(location);
    setShowSuggestions(false);
    handleSubmit(location);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50"></div>
        
        {/* Hero image with overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10" />
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [10, -10, 10],
              transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"
          />
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={sparkleAnimation}
              transition={{ delay: i * 0.5 }}
              className={`absolute w-6 h-6 text-yellow-400/60 ${
                i % 2 === 0 ? 'top-1/4' : 'top-3/4'
              } ${
                i % 3 === 0 ? 'left-1/4' : i % 3 === 1 ? 'left-1/2' : 'left-3/4'
              }`}
            >
              <Sparkles className="w-full h-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top spacing */}
        <div className="pt-24 lg:pt-32"></div>
        
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              {/* Trust Badge */}
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-blue-700 rounded-full text-sm font-semibold mb-8 shadow-lg border border-blue-100"
              >
                <Shield className="w-4 h-4" />
                <span>Trusted by 50,000+ families</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants} className="mb-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.9]">
                  <RadialGradient
                    gradient={["circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%"]}
                  >
                    Find Your Perfect
                  </RadialGradient>
                  <br />
                  <span className="text-gray-900 bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
                    Dream Home
                  </span>
                </h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-gray-700 text-xl sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                >
                  Discover exceptional properties in prime locations with our 
                  <span className="text-blue-600 font-semibold"> AI-powered search</span> and 
                  <span className="text-purple-600 font-semibold"> expert guidance</span>
                </motion.p>
              </motion.div>

              {/* Enhanced Search Section */}
              <motion.div
                variants={itemVariants}
                className="relative max-w-4xl mx-auto mb-16 z-50"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50">
                  {/* Property Type Filters */}
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {quickFilters.map((filter) => (
                      <motion.button
                        key={filter.label}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        // onClick={() => setPropertyType(filter.label)}
                        className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                          propertyType === filter.label
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <filter.icon className="w-4 h-4" />
                        <span>{filter.label}</span>
                        <span className="text-xs opacity-75">({filter.count})</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          setShowSuggestions(true);
                          setIsSearchFocused(true);
                        }}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Enter city, locality, or landmark..."
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-gray-200 bg-white/90 
                          focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 
                          text-lg placeholder-gray-500 font-medium"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 
                          transition-all flex items-center gap-2 font-medium"
                      >
                        <Filter className="w-5 h-5" />
                        <span className="hidden sm:inline">Filters</span>
                      </motion.button> */}
                      
                      <motion.button
                        onClick={() => handleSubmit()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 
                          text-white rounded-2xl hover:shadow-2xl transition-all flex items-center gap-3 
                          font-bold text-lg shadow-xl"
                      >
                        <Search className="w-5 h-5" />
                        <span>Search Properties</span>
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Enhanced Location Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && searchQuery.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute left-6 right-6 top-full mt-4 bg-white backdrop-blur-md 
                          rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-orange-500" />
                              Popular Locations
                            </h3>
                            <span className="text-sm text-gray-500">Choose from trending areas</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {popularLocations.map((location, index) => (
                              <motion.button
                                key={location}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleLocationClick(location)}
                                className="flex items-center justify-between p-4 hover:bg-blue-50 rounded-xl 
                                  transition-all duration-300 text-left group border border-transparent 
                                  hover:border-blue-200 hover:shadow-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 
                                    rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 
                                      transition-colors">{location}</span>
                                    <div className="text-xs text-gray-500">
                                      {Math.floor(Math.random() * 500) + 100}+ properties
                                    </div>
                                  </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 
                                  group-hover:translate-x-1 transition-all duration-300" />
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                variants={containerVariants}
                className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl 
                      border border-white/50 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${stat.color} 
                      rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="pb-16"></div>
      </div>
    </div>
  );
};

export default Hero;
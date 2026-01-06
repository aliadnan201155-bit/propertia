import { useState, useEffect } from "react";
import { 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Plus, 
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building,
  Grid3X3,
  List,
  Eye,
  Calendar,
  TrendingUp,
  Star,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../config/constants";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendurl}/api/products/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        const parsedProperties = response.data.property.map(property => ({
          ...property,
          amenities: parseAmenities(property.amenities)
        }));
        setProperties(parsedProperties);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
    toast.success("Properties refreshed!");
  };

  const parseAmenities = (amenities) => {
    // If amenities is already a non-empty array, return it
    if (Array.isArray(amenities) && amenities.length > 0) {
      return amenities;
    }
    
    // If it's a string, try to parse it
    if (typeof amenities === 'string') {
      try {
        return JSON.parse(amenities.replace(/'/g, '"'));
      } catch (error) {
        console.error("Error parsing amenities:", error);
        return [];
      }
    }
    
    // Default to empty array
    return [];
  };

  useEffect(() => {
    fetchProperties();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveProperty = async (propertyId, propertyTitle) => {
    if (window.confirm(`Are you sure you want to remove "${propertyTitle}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendurl}/api/products/remove`, {
          id: propertyId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          toast.success("Property removed successfully");
          await fetchProperties();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error removing property:", error);
        toast.error("Failed to remove property");
      }
    }
  };

  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = !searchTerm || 
        [property.title, property.location, property.type]
          .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === "all" || property.type.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-700 mb-2"
          >
            Loading Properties
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500"
          >
            Fetching the latest property listings...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent pb-4">
                Property Management
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 ">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{filteredProperties.length} Properties Listed</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Portfolio Overview</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
              
              <Link to="/add">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Property</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">For Rent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.availability === 'rent').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">For Sale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.availability === 'sale').length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rs {properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length / 100000) : 0}L
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, location, or property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {/* <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} /> */}
                </button>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="house">Houses</option>
                  <option value="apartment">Apartments</option>
                  <option value="villa">Villas</option>
                  <option value="office">Offices</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Property Grid */}
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
          className="space-y-6"
        >
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Home className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType !== "all" 
                    ? "Try adjusting your search criteria or filters" 
                    : "Get started by adding your first property"
                  }
                </p>
                {(!searchTerm && filterType === "all") && (
                  <Link to="/add">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Property
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              <AnimatePresence>
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover="hover"
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                    }`}
                  >
                    {/* Property Image */}
                    <div className={`relative ${
                      viewMode === 'list' 
                        ? 'sm:w-80 h-48 sm:h-auto flex-shrink-0' 
                        : 'h-56'
                    }`}>
                      <img
                        src={property.image[0] || "/placeholder.jpg"}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Property Type Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-sm">
                          {property.type}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-sm ${
                          property.availability === 'rent' 
                            ? 'bg-green-500/90 text-white' 
                            : 'bg-blue-500/90 text-white'
                        }`}>
                          For {property.availability}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Link 
                          to={`/update/${property._id}`}
                          className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveProperty(property._id, property.title)}
                          className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className={`p-6 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-3xl font-bold text-gray-900">
                              Rs {property.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">2.4k views</span>
                            </div>
                          </div>
                        </div>

                        {/* Property Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <BedDouble className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900">{property.beds}</div>
                            <div className="text-xs text-gray-500">Bedrooms</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900">{property.baths}</div>
                            <div className="text-xs text-gray-500">Bathrooms</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-xl">
                            <Maximize className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900">{property.sqft}</div>
                            <div className="text-xs text-gray-500">Sq Ft</div>
                          </div>
                        </div>

                        {/* Amenities */}
                        {property.amenities.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Top Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {property.amenities.slice(0, 4).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                >
                                  <Building className="w-3 h-3 mr-1" />
                                  {amenity}
                                </span>
                              ))}
                              {property.amenities.length > 4 && (
                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                  +{property.amenities.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex items-center justify-between pt-4 mt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Listed {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Link 
                              to={`/update/${property._id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleRemoveProperty(property._id, property.title)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyListings;
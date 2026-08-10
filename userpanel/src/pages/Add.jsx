import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { backendurl } from '../config/constants';
import { Upload, X, Home, Building2, Briefcase, Crown, MapPin, Phone, DollarSign, Bed, Bath, SquareStack, CloudUpload } from 'lucide-react';

const PROPERTY_TYPES = [
  { label: 'House', icon: Home },
  { label: 'Apartment', icon: Building2 },
  { label: 'Office', icon: Briefcase },
  { label: 'Villa', icon: Crown },
];
const AVAILABILITY_TYPES = ['rent', 'buy'];
const AMENITIES = ['Lake View', 'Fireplace', 'Central heating and air conditioning', 'Dock', 'Pool', 'Garage', 'Garden', 'Gym', 'Security system', 'Master bathroom', 'Guest bathroom', 'Home theater', 'Exercise room/gym', 'Covered parking', 'High-speed internet ready', 'Parking Spaces', 'Double Glazed Windows', 'Electricity Backup', 'Waste Disposal', 'Furnished', 'Servant Quarters', 'Drawing Room', 'Dining Room', 'Store Rooms', 'Broadband Internet Access', 'Satellite or Cable TV Ready', 'Intercom', 'Community Facilities', 'Community Lawn or Garden', 'Community Swimming Pool', 'Community Gym', 'First Aid or Medical Centre', 'Day Care Centre', 'Kids Play Area', 'Barbeque Area', 'Mosque', 'Jacuzzi', 'Distance From Airport (kms)', 'Services & Staff', 'Maintenance Staff', 'Security Staff', 'Facilities for Disabled'];

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">{children}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const InputWithIcon = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <input
      {...props}
      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
    />
  </div>
);

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    availability: '',
    amenities: [],
    images: []
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.phone || formData.phone.length !== 11) {
      toast.error('Phone number must be exactly 11 digits');
      setLoading(false);
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append('title', formData.title);
      formdata.append('type', formData.type);
      formdata.append('price', formData.price);
      formdata.append('location', formData.location);
      formdata.append('description', formData.description);
      formdata.append('beds', formData.beds);
      formdata.append('baths', formData.baths);
      formdata.append('sqft', formData.sqft);
      formdata.append('phone', formData.phone);
      formdata.append('availability', formData.availability);
      formdata.append('amenities', JSON.stringify(formData.amenities));
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(`${backendurl}/api/products/add`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          title: '',
          type: '',
          price: '',
          location: '',
          description: '',
          beds: '',
          baths: '',
          sqft: '',
          phone: '',
          availability: '',
          amenities: [],
          images: []
        });
        setPreviewUrls([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building2 size={22} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add new property</h2>
              <p className="text-sm text-gray-400 mt-0.5">Fill in the details to list your property</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-8">

            {/* Basic Info */}
            <div>
              <SectionLabel>Basic info</SectionLabel>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Property title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Modern 3-bed apartment in Gulshan"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the property, its features, surroundings..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Location</label>
                    <InputWithIcon
                      icon={MapPin}
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. DHA Phase 6, Karachi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Contact phone</label>
                    <InputWithIcon
                      icon={Phone}
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      placeholder="03XXXXXXXXX"
                      maxLength={11}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          setFormData(prev => ({ ...prev, phone: value }));
                        }
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Property Type */}
            <div>
              <SectionLabel>Property type</SectionLabel>
              <div className="grid grid-cols-4 gap-3">
                {PROPERTY_TYPES.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: label }))}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition cursor-pointer
                      ${formData.type === label
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Price */}
            <div>
              <SectionLabel>Availability & price</SectionLabel>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Listing type</label>
                  <div className="flex gap-3">
                    {AVAILABILITY_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, availability: type }))}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition cursor-pointer
                          ${formData.availability === type
                            ? 'bg-blue-50 border-blue-400 text-blue-600'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                      >
                        {type === 'rent' ? 'For rent' : 'For sale'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Price (PKR)</label>
                  <InputWithIcon
                    icon={DollarSign}
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.length <= 12) {
                        handleInputChange(e);
                    }
                  }}
                    placeholder="0"
                  />
                </div> 

              </div>
            </div>

            {/* Size & Rooms */}
            <div>
              <SectionLabel>Size & rooms</SectionLabel>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Bedrooms</label>
                  <InputWithIcon
                    icon={Bed}
                    type="number"
                    name="beds"
                    required
                    min="0"
                    value={formData.beds}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.length <= 2) {
                        handleInputChange(e);
                    }
                  }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Bathrooms</label>
                  <InputWithIcon
                    icon={Bath}
                    type="number"
                    name="baths"
                    required
                    min="0"
                    value={formData.baths}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.length <= 2) {
                        handleInputChange(e);
                    }
                  }}  
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Square feet</label>
                  <InputWithIcon
                    icon={SquareStack}
                    type="number"
                    name="sqft"
                    required
                    min="0"
                    value={formData.sqft}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (value.length <= 6) {
                        handleInputChange(e);
                    }
                  }}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <SectionLabel>Amenities</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer
                      ${formData.amenities.includes(amenity)
                        ? 'bg-blue-50 border-blue-400 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <SectionLabel>
                Property images
                <span className="normal-case text-gray-400 font-normal tracking-normal text-xs">(max 4)</span>
              </SectionLabel>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {previewUrls.length < 4 && (
                <label htmlFor="images" className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                  <CloudUpload size={28} className="text-gray-400" />
                  <span className="text-sm font-medium text-blue-500">Click to upload images</span>
                  <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit property'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
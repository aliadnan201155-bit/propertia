import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatMessage = ({ message, isUser, properties, detailedProperty, onViewDetails }) => {
  const navigate = useNavigate();
  
  // 1. Agar User ki chat hai
  if (isUser) {
    return (
      <div className="flex justify-end w-full">
        <div className="bg-primary-600 text-white rounded-l-xl rounded-tr-xl px-4 py-2 max-w-[85%] text-sm shadow-sm whitespace-pre-wrap">
          {message}
        </div>
      </div>
    );
  }

  const detailImage = Array.isArray(detailedProperty?.image)
    ? detailedProperty.image[0]
    : detailedProperty?.image;

  // 2. Agar Chatbot ki chat hai
  return (
    <div className="flex flex-col gap-2 w-full items-start">
      
      {/* Bot Ka Text Message with Safety Check */}
      {message && (
        <div className="bg-white border border-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl px-4 py-3 max-w-[90%] text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
          {/* Agar message ghalti se object aagaya to crash hone ke bajaye usko string bana kar dikha dega */}
          {typeof message === 'object' ? JSON.stringify(message) : message}
        </div>
      )}

      {/* Multiple Properties ka Slider / List (Jab Search ho) */}
      {properties && properties.length > 0 && (
        <div className="flex flex-col gap-3 w-[90%] mt-1">
          {properties.map((prop, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-primary-700 text-sm">{prop.title}</h4>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Option {prop.option}</span>
              </div>
              
              <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                <p>💰 PKR {(prop.price / 1000000).toFixed(2)}M</p>
                <p>🛏️ {prop.beds} Beds</p>
                <p>🏠 {prop.type}</p>
              </div>
              
              {/* Magic Button: Is par click hone se poori detail aayegi */}
              <button 
                onClick={() => onViewDetails(prop._id)}
                className="mt-2 w-full bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white transition-colors py-1.5 rounded-md text-xs font-medium border border-primary-200"
              >
                🔍 View Full Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Property Card (Jab user 'View Details' par click kare) */}
      {detailedProperty && (
        <div className="bg-white p-4 w-[95%] rounded-lg border border-primary-200 shadow-md">
          {detailImage && (
            <img 
              src={detailImage} 
              alt={detailedProperty.title} 
              className="w-full h-32 object-cover rounded-md mb-3"
            />
          )}
          <h3 className="font-bold text-lg text-gray-800">{detailedProperty.title}</h3>
          <p className="text-sm text-gray-500 mb-3">📍 {detailedProperty.location}</p>
          
          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-2 rounded-md mb-3">
            <div><span className="font-medium text-gray-700">Price:</span> PKR {(detailedProperty.price / 1000000).toFixed(2)}M</div>
            <div><span className="font-medium text-gray-700">Beds:</span> {detailedProperty.beds}</div>
            <div><span className="font-medium text-gray-700">Baths:</span> {detailedProperty.baths || 'N/A'}</div>
            <div><span className="font-medium text-gray-700">Area:</span> {detailedProperty.sqft ? `${detailedProperty.sqft} sqft` : 'N/A'}</div>
            <div><span className="font-medium text-gray-700">Type:</span> {detailedProperty.type}</div>
            <div><span className="font-medium text-gray-700">Status:</span> {detailedProperty.availability || 'Available'}</div>
          </div>

          <div className="text-sm text-gray-700 mb-3">
            <span className="font-semibold block mb-1">Description:</span>
            <p className="line-clamp-3 text-xs leading-relaxed">{detailedProperty.description}</p>
          </div>

          <div className="border-t pt-3 mt-3">
            <p className="font-semibold text-sm mb-1">📞 Owner/Agent Contact:</p>
            <p className="text-sm text-primary-700 font-medium">Phone: {detailedProperty.phone || "Not provided"}</p>
            {detailedProperty.userId?.name && (
               <p className="text-sm text-gray-600">Name: {detailedProperty.userId.name}</p>
            )}
          </div>

          <button
            onClick={() => navigate(`/properties/single/${detailedProperty._id || detailedProperty.id}`)}
            className="mt-4 w-full bg-primary-600 text-white hover:bg-primary-700 transition-colors py-2 rounded-md text-sm font-medium"
          >
            📅 Set Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
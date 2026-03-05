import Stats from '../models/statsModel.js';

export const trackAPIStats = async (req, res, next) => {
  const start = Date.now();
  let statsRecorded = false;
  
  res.on('finish', async () => {
    // Prevent duplicate recording - only record once per request
    if (statsRecorded) return;
    statsRecorded = true;
    
    try {
      if (!['OPTIONS', 'HEAD'].includes(req.method) && res.statusCode !== 404) {
        const duration = Date.now() - start;

        let propertyId = null;
        const propertyIdMatch = req.originalUrl.match(
          /\/(?:products|properties)\/(?:single\/)?([a-f0-9]{24})/i
        );
        
        if (propertyIdMatch?.[1]) {
          propertyId = propertyIdMatch[1];
        }

        await Stats.create({
          propertyId,
          endpoint: req.originalUrl,
          method: req.method,
          responseTime: duration,
          statusCode: res.statusCode,
        });
      }
    } catch (error) {
      console.error('Error tracking API stats:', error);
    }
  });

  next();
};


// import Stats from '../models/statsModel.js';

// const lastPropertyViews = {};

// console.log('[STATS] Middleware loaded - View tracking initialized');

// setInterval(() => {
//   const now = Date.now();
//   const oneDay = 24 * 60 * 60 * 1000;
  
//   Object.keys(lastPropertyViews).forEach(key => {
//     if (now - lastPropertyViews[key] > oneDay) {
//       delete lastPropertyViews[key];
//     }
//   });
// }, 60 * 60 * 1000);

// export const trackAPIStats = async (req, res, next) => {
//   const start = Date.now();
//   let statsRecorded = false;
  
//   res.on('finish', async () => {
//     if (statsRecorded) return;
//     statsRecorded = true;
    
//     try {
//       // Skip: OPTIONS, HEAD, 304 (Not Modified), 404, 401, and health check endpoints
//       const skipStatuses = [204, 304, 401, 404];
//       const skipEndpoints = ['/api/users/verify-token', '/status', '/'];
      
//       if (skipStatuses.includes(res.statusCode) || 
//           skipEndpoints.some(ep => req.originalUrl.startsWith(ep)) ||
//           ['OPTIONS', 'HEAD'].includes(req.method)) {
//         return;
//       }

//       const duration = Date.now() - start;

//       let propertyId = null;
//       const propertyIdMatch = req.originalUrl.match(
//         /\/(?:products|properties)\/(?:single\/)?([a-f0-9]{24})/i
//       );
      
//       if (propertyIdMatch?.[1]) {
//         propertyId = propertyIdMatch[1];
//       }

//       // Get client IP with fallbacks
//       const clientIp = req.ip || 
//                       req.connection?.remoteAddress || 
//                       req.socket?.remoteAddress || 
//                       'unknown';

//       // For property views, apply deduplication logic
//       if (propertyId) {
//         const userId = req.user?._id;
//         const identifier = userId ? `user-${userId}` : `ip-${clientIp}`;
//         const viewKey = `${identifier}-${propertyId}`;

//         const now = Date.now();
//         const lastViewTime = lastPropertyViews[viewKey];
        
//         // View window: 1 hour (3600000 ms)
//         const VIEW_WINDOW = 60 * 60 * 1000;

//         // Skip if view is too recent
//         if (lastViewTime && (now - lastViewTime) <= VIEW_WINDOW) {
//           return;
//         }

//         // Update last view time
//         lastPropertyViews[viewKey] = now;
//       }

//       // Record the stat
//       const statData = {
//         propertyId: propertyId || null,
//         userId: req.user?._id || null,
//         endpoint: req.originalUrl,
//         method: req.method,
//         responseTime: duration,
//         statusCode: res.statusCode,
//         ipAddress: clientIp
//       };
      
//       await Stats.create(statData);
//     } catch (error) {
//       console.error('[STATS] Error tracking API stats:', error.message);
//     }
//   });

//   next();
// };

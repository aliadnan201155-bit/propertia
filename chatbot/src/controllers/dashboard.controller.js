import { Property } from '../models/property.model.js';
import { User } from '../models/user.model.js';
import { Inquiry } from '../models/inquiry.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sellerDashboardStats = asyncHandler(async (req, res) => {
    try {
        const sellerId = req.user._id;

        // Count active and sold listings
        const totalActiveListings = await Property.countDocuments({ owner: sellerId, status: "active" });
        const totalSoldListings = await Property.countDocuments({ owner: sellerId, status: "sold" });

        // Get all listings for this seller
        const allListings = await Property.find({ owner: sellerId });
        const prices = allListings.map(listing => listing.price);
        const totalPrices = prices.reduce((acc, price) => acc + price, 0);
        const averagePrice = prices.length > 0 ? totalPrices / prices.length : 0;

        // Listings per month (last 12 months)
        const now = new Date();
        const listingsPerMonth = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return {
                month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                count: allListings.filter(listing => {
                    const created = new Date(listing.createdAt);
                    return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear();
                }).length
            };
        }).reverse();

        // Price distribution (buckets)
        // const buckets = [
        //     { label: '0-50k', min: 0, max: 50000 },
        //     { label: '50k-100k', min: 50000, max: 100000 },
        //     { label: '100k-200k', min: 100000, max: 200000 },
        //     { label: '200k+', min: 200000, max: Infinity }
        // ];
        // const priceDistribution = buckets.map(bucket => ({
        //     range: bucket.label,
        //     count: prices.filter(price => price >= bucket.min && price < bucket.max).length
        // }));

        return res.json({
            success: true,
            data: {
                totalActiveListings,
                totalSoldListings,
                averagePrice,
                listingsPerMonth,
                // priceDistribution
            }
        });
    } catch (error) {
        console.log("server Error", error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        });
    }
});

const adminDashboardStats = asyncHandler(async (req, res) => {
    try {

        // Total counts
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const totalInquiries = await Inquiry.countDocuments();


        // User growth data (last 12 months)
        const now = new Date();
        const userGrowthData = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const usersInMonth = await User.countDocuments({
                createdAt: {
                    $gte: date,
                    $lt: nextDate
                }
            });

            userGrowthData.push({
                name: date.toLocaleString('default', { month: 'short' }),
                value: usersInMonth
            });
        }

        // User types distribution
        const buyersCount = await User.countDocuments({ role: 'buyer' });
        const sellersCount = await User.countDocuments({ role: 'seller' });
        const adminsCount = await User.countDocuments({ role: 'admin' });

        const userTypeData = [
            { name: 'Buyers', value: buyersCount },
            { name: 'Sellers', value: sellersCount },
            { name: 'Admins', value: adminsCount }
        ];

        const responseData = {
            success: true,
            data: {
                totalUsers,
                totalProperties,
                totalInquiries,
                userGrowthData,
                userTypeData
            }
        };

        return res.json(responseData);
    } catch (error) {
        console.error("Admin dashboard error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || error
        });
    }
});

export { sellerDashboardStats, adminDashboardStats };
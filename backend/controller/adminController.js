import Stats from "../models/statsModel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate, getMeetingLinkEmailTemplate } from "../email.js";

const formatRecentProperties = (properties) => {
  return properties.map((property) => ({
    type: "property",
    description: `New property listed: ${property.title}`,
    timestamp: property.createdAt,
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map((appointment) => ({
    type: "appointment",
    description:
      appointment.userId && appointment.propertyId
        ? `${appointment.userId.name} scheduled viewing for ${appointment.propertyId.title}`
        : "Appointment scheduled (details unavailable)",
    timestamp: appointment.createdAt,
  }));
};

// Add these helper functions before the existing exports
export const getAdminStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's property IDs once
    const userPropertyIds = await Property.find({ userId }).select("_id");

    const [
      totalProperties,
      activeListings,
      pendingAppointments,
      recentActivity,
      viewsData,
      propertyTypeData,
      totalViews
    ] = await Promise.all([
      Property.countDocuments({ userId }),
      Property.countDocuments({ userId }), // Count all properties as active since status field doesn't exist
      Appointment.countDocuments({
        propertyId: { $in: userPropertyIds },
        status: "pending",
      }),
      getRecentActivity(userId),
      getViewsData(userId),
      getPropertyTypeData(userId),
      Stats.countDocuments({
        propertyId: { $in: userPropertyIds },
        endpoint: /^\/api\/products\/single\//,
        method: "GET",
      })
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalViews,
        pendingAppointments,
        recentActivity,
        viewsData,
        propertyTypeData,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin statistics",
    });
  }
};

const getRecentActivity = async (userId) => {
  try {
    const recentProperties = await Property.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    // Get user's property IDs for appointment filtering
    const userPropertyIds = await Property.find({ userId }).select("_id");

    const recentAppointments = await Appointment.find({
      propertyId: { $in: userPropertyIds },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("propertyId", "title")
      .populate("userId", "name");

    // Filter out appointments with missing user or property data
    const validAppointments = recentAppointments.filter(
      (appointment) => appointment.userId && appointment.propertyId,
    );

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments),
    ].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const getViewsData = async (userId) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/products\/single\//,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Generate dates for last 30 days
    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const stat = stats.find((s) => s._id === dateString);
      data.push(stat ? stat.count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Property Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Property Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

const getPropertyTypeData = async (userId) => {
  try {
    const propertyTypes = await Property.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const labels = propertyTypes.map((item) => item._id);
    const data = propertyTypes.map((item) => item.count);

    const backgroundColors = [
      "rgba(59, 130, 246, 0.8)", // Blue
      "rgba(16, 185, 129, 0.8)", // Green
      "rgba(168, 85, 247, 0.8)", // Purple
      "rgba(251, 146, 60, 0.8)", // Orange
      "rgba(236, 72, 153, 0.8)", // Pink
    ];

    return {
      labels,
      datasets: [
        {
          label: "Properties by Type",
          data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: backgroundColors
            .slice(0, labels.length)
            .map((color) => color.replace("0.8", "1")),
          borderWidth: 2,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating property type data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "Properties by Type",
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2,
        },
      ],
    };
  }
};

// Add these new controller functions
export const getAllAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { myMeetings } = req.query;

    // Pagination setup
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    if (myMeetings === "true") {
      // Get user's own appointments
      const [appointments, total] = await Promise.all([
        Appointment.find({ userId })
          .populate({
            path: "propertyId",
            select: "title location userId",
            populate: {
              path: "userId",
              select: "name email phone",
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Appointment.countDocuments({ userId }),
      ]);

      res.json({
        success: true,
        appointments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } else {
      // Get appointments for user's properties
      const userPropertyIds = await Property.find({ userId }).select("_id");

      const [appointments, total] = await Promise.all([
        Appointment.find({
          propertyId: { $in: userPropertyIds },
        })
          .populate("propertyId", "title location")
          .populate("userId", "name email")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Appointment.countDocuments({
          propertyId: { $in: userPropertyIds },
        }),
      ]);

      res.json({
        success: true,
        appointments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const userId = req.user._id;

    const appointment =
      await Appointment.findById(appointmentId).populate("propertyId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the property belongs to the authenticated user
    const property = await Property.findOne({
      _id: appointment.propertyId._id,
      userId,
    });

    if (!property) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this appointment",
      });
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    // Send email notification using the template from email.js
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } - Propertia`,
      html: getEmailTemplate(appointment, status),
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
    });
  }
};

export const updateAppointmentMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;
    const userId = req.user._id;

    const appointment =
      await Appointment.findById(appointmentId).populate("propertyId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the property belongs to the authenticated user
    const property = await Property.findOne({
      _id: appointment.propertyId._id,
      userId,
    });

    if (!property) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this appointment",
      });
    }

    // Update meeting link
    appointment.meetingLink = meetingLink;
    await appointment.save();

    // Send email notification with meeting link
    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: "Meeting Link Updated - Propertia",
      html: getMeetingLinkEmailTemplate(appointment, meetingLink)
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Meeting link updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error updating meeting link:", error);
    res.status(500).json({
      success: false,
      message: "Error updating meeting link",
    });
  }
};

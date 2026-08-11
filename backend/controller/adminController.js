import Stats from "../models/statsModel.js";
import Property from "../models/propertymodel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/Usermodel.js";
import transporter from "../config/nodemailer.js";
import { getEmailTemplate, getMeetingLinkEmailTemplate } from "../email.js";
import { Parser } from "@json2csv/plainjs";

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
export const getOwnerStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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
        timestamp: { $gte: thirtyDaysAgo },
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

    // Get all property IDs owned by the user
    const userProperties = await Property.find({ userId }).select("_id");
    const userPropertyIds = userProperties.map((p) => p._id);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/products\/single\//,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
          propertyId: { $in: userPropertyIds },
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
    for (let i = 29; i >= 0; i--) {
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

// GET Appointments/My meetings in Admin Dashboard 
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

// EXPORT Appointments/My meetings in Admin Dashboard 
export const exportAllAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { myMeetings } = req.query;

    let appointments;

    if (myMeetings === "true") {
      // Get user's own appointments (all records for export)
      appointments = await Appointment.find({ userId })
        .populate({
          path: "propertyId",
          select: "title location userId",
          populate: {
            path: "userId",
            select: "name email phone",
          },
        })
        .sort({ createdAt: -1 });
    } else {
      // Get appointments for user's properties (all records for export)
      const userPropertyIds = await Property.find({ userId }).select("_id");

      appointments = await Appointment.find({
        propertyId: { $in: userPropertyIds },
      })
        .populate("propertyId", "title location")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    }

    // Transform appointments to flatten nested fields for CSV
    const csvData = appointments.map(appointment => ({
      propertyTitle: appointment.propertyId?.title || 'N/A',
      propertyLocation: appointment.propertyId?.location || 'N/A',
      userName: appointment.userId?.name || 'N/A',
      userEmail: appointment.userId?.email || 'N/A',
      date: appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A',
      time: appointment.time || 'N/A',
      status: appointment.status || 'N/A',
      meetingLink: appointment.meetingLink || 'N/A',
      meetingPlatform: appointment.meetingPlatform || 'N/A',
      notes: appointment.notes || 'N/A',
      createdAt: appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : 'N/A',
    }));

    const json2csvParser = new Parser({
      fields: ['propertyTitle', 'propertyLocation', 'userName', 'userEmail', 'date', 'time', 'status', 'meetingLink', 'meetingPlatform', 'notes', 'createdAt']
    });
    const csv = json2csvParser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment(myMeetings === "true" ? "my-appointments.csv" : "property-appointments.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Error exporting appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error exporting appointments",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const userId = req.user._id;

    const appointment = await Appointment.findById(appointmentId).populate({
      path: "propertyId",
      select: "title location userId",
      populate: {
        path: "userId",
        select: "name email",
      },
    }).populate("userId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the property belongs to the authenticated user or user is admin
    const isOwner = appointment.propertyId?.userId?._id?.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this appointment",
      });
    }

    // Update appointment status
    appointment.status = status;
    await appointment.save();

    // Send email notification to other participant(s) (exclude updater)
    const customerEmail = appointment.userId?.email;
    const ownerEmail = appointment.propertyId?.userId?.email;
    const updaterEmail = req.user?.email;
    const recipients = Array.from(new Set([customerEmail, ownerEmail].filter(Boolean)))
      .filter(email => email !== updaterEmail);

    if (recipients.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: recipients,
        subject: `Viewing Appointment ${
          status.charAt(0).toUpperCase() + status.slice(1)
        } - Propertia`,
        html: getEmailTemplate(appointment, status),
      };

      await transporter.sendMail(mailOptions);
      console.log('📧 Status update email sent to:', recipients);
    }

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

    const appointment = await Appointment.findById(appointmentId).populate({
      path: "propertyId",
      select: "title location userId",
      populate: {
        path: "userId",
        select: "name email",
      },
    }).populate("userId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the property belongs to the authenticated user or user is admin
    const isOwner = appointment.propertyId?.userId?._id?.toString() === userId.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this appointment",
      });
    }

    // Update meeting link
    appointment.meetingLink = meetingLink;
    await appointment.save();

    // Send email notification with meeting link to other participant(s) (exclude updater)
    const customerEmail = appointment.userId?.email;
    const ownerEmail = appointment.propertyId?.userId?.email;
    const updaterEmail = req.user?.email;
    const recipients = Array.from(new Set([customerEmail, ownerEmail].filter(Boolean)))
      .filter(email => email !== updaterEmail);

    if (recipients.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: recipients,
        subject: "Meeting Link Updated - Propertia",
        html: getMeetingLinkEmailTemplate(appointment, meetingLink),
      };

      await transporter.sendMail(mailOptions);
    }

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

export const getAdminOverviewStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      totalAdmins,
      totalProperties,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalViews,
      recentProperties,
      recentAppointments,
      appointmentTrends,
      viewTrends,
      ownerUserIds,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Property.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Stats.countDocuments({
        endpoint: /^\/api\/products\/single\//,
        method: "GET",
        timestamp: { $gte: thirtyDaysAgo },
      }),
      Property.find().sort({ createdAt: -1 }).limit(5).select("title createdAt"),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("propertyId", "title")
        .populate("userId", "name"),
      Appointment.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Stats.aggregate([
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
      ]),
      Property.distinct("userId"),
    ]);

    const labels = [];
    const appointmentsData = [];
    const viewsData = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const appointmentStat = appointmentTrends.find((s) => s._id === dateString);
      appointmentsData.push(appointmentStat ? appointmentStat.count : 0);

      const viewStat = viewTrends.find((s) => s._id === dateString);
      viewsData.push(viewStat ? viewStat.count : 0);
    }

    const validRecentAppointments = recentAppointments.filter(
      (appointment) => appointment.userId && appointment.propertyId
    );

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalOwners: ownerUserIds.length,
        totalProperties,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        totalViews,
        recentActivity: [
          ...formatRecentProperties(recentProperties),
          ...formatRecentAppointments(validRecentAppointments),
        ].sort((a, b) => b.timestamp - a.timestamp),
        chartData: {
          labels,
          datasets: [
            {
              label: "Appointments",
              data: appointmentsData,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Property Views",
              data: viewsData,
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error fetching admin overview stats:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching admin overview statistics",
    });
  }
};

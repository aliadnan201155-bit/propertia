import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Home,
  X,
  Loader,
  Filter,
  Search,
  Link as LinkIcon,
  Send,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { backendurl } from "../config/constants";

const MyMeetings = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/admin/appointments?myMeetings=true`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (response.data.success) {
          // Filter out appointments with missing user data
          const validAppointments = response.data.appointments.filter(
              (apt) => apt.userId && apt.propertyId
            );
            console.log(validAppointments);
        setAppointments(validAppointments);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchTerm === "" ||
      apt.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || apt.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendurl}/api/admin/appointments/exportCsv?myMeetings=true`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `meetings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Meetings exported successfully');
    } catch (error) {
      console.error('Error exporting meetings:', error);
      toast.error('Failed to export meetings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Section - Keep existing code */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              My Meetings
            </h1>
            <p className="text-gray-600">
              View your meetings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Meetings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-t-purple-500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">
                    Meeting Link
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100">
                {filteredAppointments.map((appointment, idx) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`hover:bg-purple-50 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-purple-50/30"
                    }`}
                  >
                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.propertyId.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.propertyId.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.propertyId?.userId?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.propertyId?.userId?.email || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-purple-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1 text-purple-400" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>

                    {/* Meeting Link */}
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                          {appointment.meetingLink ? (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors font-medium text-sm"
                            >
                              <LinkIcon className="w-4 h-4" />
                              Join
                            </a>
                          ) : (
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-sm">Pending</span>
                          )}
                        </div>
                    </td>


                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No meetings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMeetings;

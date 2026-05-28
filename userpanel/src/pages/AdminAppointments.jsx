import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Home,
  Loader,
  Search,
  Download,
  Edit3,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { backendurl } from "../config/constants";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "pending",
    date: "",
    time: "",
    meetingLink: "",
    notes: "",
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendurl}/api/appointments/manage`, {
        params: {
          page,
          limit,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAppointments(
          (response.data.appointments || []).filter((apt) => apt.status !== 'completed')
        );
        setPagination({
          total: response.data.pagination?.total || 0,
          pages: response.data.pagination?.pages || 1,
        });
      } else {
        toast.error(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching admin appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page, limit, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const ownerName = apt.propertyId?.userId?.name || "";
      const ownerEmail = apt.propertyId?.userId?.email || "";
      const matchesSearch =
        searchTerm === "" ||
        apt.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [appointments, searchTerm]);

  const startEdit = (apt) => {
    setEditingId(apt._id);
    setEditingAppointment(apt);
    setIsEditModalOpen(true);
    setEditForm({
      status: apt.status || "pending",
      date: apt.date ? new Date(apt.date).toISOString().split("T")[0] : "",
      time: apt.time || "",
      meetingLink: apt.meetingLink || "",
      notes: apt.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingAppointment(null);
    setIsEditModalOpen(false);
    setEditForm({ status: "pending", date: "", time: "", meetingLink: "", notes: "" });
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        status: editForm.status,
        date: editForm.date,
        time: editForm.time,
        meetingLink: editForm.meetingLink,
        notes: editForm.notes,
      };

      const response = await axios.put(`${backendurl}/api/appointments/manage/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Client Meeting updated");
        cancelEdit();
        fetchAppointments();
      } else {
        toast.error(response.data.message || "Failed to update client meeting");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.response?.data?.message || "Failed to update client meeting");
    }
  };

  const deleteAppointment = async (id) => {
    const ok = window.confirm("Delete this client meeting?");
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${backendurl}/api/appointments/manage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Client Meeting deleted");
        fetchAppointments();
      } else {
        toast.error(response.data.message || "Failed to delete client meeting");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(error.response?.data?.message || "Failed to delete client meeting");
    }
  };

  const getPageNumbers = () => {
    const totalPages = Math.max(1, pagination.pages || 1);
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const exportCsv = () => {
    const rows = filteredAppointments.map((apt) => ({
      propertyTitle: apt.propertyId?.title || "N/A",
      propertyLocation: apt.propertyId?.location || "N/A",
      clientName: apt.userId?.name || "N/A",
      clientEmail: apt.userId?.email || "N/A",
      ownerName: apt.propertyId?.userId?.name || "N/A",
      ownerEmail: apt.propertyId?.userId?.email || "N/A",
      date: apt.date ? new Date(apt.date).toLocaleDateString() : "N/A",
      time: apt.time || "N/A",
      status: apt.status || "N/A",
      meetingLink: apt.meetingLink || "N/A",
    }));

    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `admin_client_meetings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Client Meetings exported");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Meetings Management</h1>
            <p className="text-gray-600 mt-1">View both client and property owner, edit and delete client meetings</p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search property, client, owner"
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg w-full lg:w-80"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={exportCsv}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Property</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Client</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Owner</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Date/Time</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Meeting</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  return (
                    <motion.tr key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="font-medium text-gray-900">{apt.propertyId?.title || "N/A"}</div>
                            <div className="text-xs text-gray-500">{apt.propertyId?.location || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-indigo-500" />
                          <div>
                            <div className="font-medium text-gray-900">{apt.userId?.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{apt.userId?.email || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-emerald-500" />
                          <div>
                            <div className="font-medium text-gray-900">{apt.propertyId?.userId?.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{apt.propertyId?.userId?.email || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm text-gray-900 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(apt.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">{apt.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {apt.meetingLink ? (
                          <a className="text-blue-600 text-sm hover:underline" href={apt.meetingLink} target="_blank" rel="noopener noreferrer">Open link</a>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(apt)} className="p-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deleteAppointment(apt._id)} className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">No client meetings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
          <div className="text-sm text-gray-600">
            Showing page {page} of {Math.max(1, pagination.pages)} ({pagination.total} appointments)
          </div>
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageItem, idx) =>
                pageItem === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${pageItem}`}
                    onClick={() => setPage(pageItem)}
                    className={`rounded-lg border px-3 py-1 text-sm ${
                      page === pageItem
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageItem}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setPage((prev) => Math.min(pagination.pages || 1, prev + 1))}
              disabled={page >= (pagination.pages || 1)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Edit Client Meeting</h2>
                  <p className="text-sm text-gray-500">
                    {editingAppointment?.propertyId?.title || "Property"} - {editingAppointment?.userId?.name || "Client"}
                  </p>
                </div>
                <button
                  onClick={cancelEdit}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="text"
                    value={editForm.time}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, time: e.target.value }))}
                    placeholder="10:00 AM"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Meeting Link</label>
                  <input
                    type="url"
                    value={editForm.meetingLink}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                <button
                  onClick={cancelEdit}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(editingId)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;

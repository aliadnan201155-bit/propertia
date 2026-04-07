import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { UserPlus, Trash2, Shield, User, Search, RefreshCw } from "lucide-react";
import { backendurl } from "../config/constants";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendurl}/api/users/manage/users`, {
        params: { search, page: 1, limit: 100 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    toast.success("Users refreshed");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendurl}/api/users/manage/users`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("User created successfully");
        setForm({
          name: "",
          email: "",
          password: "",
          role: "user",
          isActive: true,
        });
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleRoleToggle = async (targetUser) => {
    try {
      const token = localStorage.getItem("token");
      const nextRole = targetUser.role === "admin" ? "user" : "admin";
      const response = await axios.put(
        `${backendurl}/api/users/manage/users/${targetUser._id}`,
        { role: nextRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`Role updated to ${nextRole}`);
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleActiveToggle = async (targetUser) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendurl}/api/users/manage/users/${targetUser._id}`,
        { isActive: !targetUser.isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`User ${targetUser.isActive ? "deactivated" : "activated"}`);
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async (targetUser) => {
    const ok = window.confirm(`Delete user ${targetUser.email}?`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${backendurl}/api/users/manage/users/${targetUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Create and manage platform users</p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    fetchUsers();
                  }
                }}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg w-full lg:w-64"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateUser}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Create New User
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Create
            </button>
          </div>
        </motion.form>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Role</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-700">{item.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${item.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                          {item.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRoleToggle(item)}
                            className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          >
                            Toggle Role
                          </button>
                          <button
                            onClick={() => handleActiveToggle(item)}
                            className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700 hover:bg-amber-200"
                          >
                            {item.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;

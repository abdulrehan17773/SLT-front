import React, { useState } from "react";
import SideBar from "../components/SideBar";
import {
  useGetAllUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../apis/adminApi";

function Users() {
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({
    page,
    limit,
  });

  const totalPages = data?.data?.pagination?.totalPages || 1;

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [editUserId, setEditUserId] = useState(null);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setLoading(true);

    try {
      if (editUserId) {
        await updateUser({
          id: editUserId,
          fullname: form.fullname,
          password: form.password,
        }).unwrap();
        setFormSuccess("User updated successfully!");
      } else {
        await addUser(form).unwrap();
        setFormSuccess("User added successfully!");
      }

      setForm({ fullname: "", email: "", password: "" });
      setEditUserId(null);
      refetch();
    } catch (error) {
      console.log(error);
      setFormError(error?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setForm({
      fullname: user.fullname,
      email: user.email,
      password: "",
    });
  };

  const handleDelete = async (id) => {
    setFormError("");
    setFormSuccess("");
    try {
      await deleteUser(id).unwrap();
      setFormSuccess("User deleted successfully!");
      refetch();
    } catch (error) {
      console.log(error);
      setFormError(error?.data?.message || "Failed to delete user.");
    }
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setForm({ fullname: "", email: "", password: "" });
    setFormError("");
    setFormSuccess("");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <SideBar activeTab="/dashboard/users" />

      {/* Content */}
      <main className="flex-1 h-screen overflow-y-auto p-6 pt-24 md:pt-10 md:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Users Management
        </h1>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 p-6 rounded-xl shadow-lg max-w-lg mb-10"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editUserId ? "Edit User" : "Add New User"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>

          {!editUserId && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              {editUserId ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required={!editUserId}
            />
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading
                ? editUserId
                  ? "Updating..."
                  : "Adding..."
                : editUserId
                ? "Update User"
                : "Add User"}
            </button>
            {editUserId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Success / Error Messages BELOW the form */}
          {formSuccess && (
            <p className="text-green-700 bg-green-100 border border-green-300 px-3 py-2 rounded mt-4">
              {formSuccess}
            </p>
          )}
          {formError && (
            <p className="text-red-700 bg-red-100 border border-red-300 px-3 py-2 rounded mt-4">
              {formError}
            </p>
          )}
        </form>

        {/* Users List */}
        {isLoading && <p className="text-gray-500">Loading users...</p>}
        {isError && <p className="text-red-500">Failed to load users.</p>}

        {data?.data?.users && (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
              <thead className="bg-gray-100 uppercase text-gray-700 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...data.data.users.filter((user) =>
                    user.role?.includes("admin")
                  ),
                  ...data.data.users.filter(
                    (user) => !user.role?.includes("admin")
                  ),
                ].map((user, idx) => {
                  const isAdmin = user.role?.includes("admin");
                  const roleLabel = isAdmin ? "admin" : "user";

                  return (
                    <tr
                      key={user._id}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.fullname}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {roleLabel}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Edit
                        </button>
                        {!isAdmin && (
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Users;

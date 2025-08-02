import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import SideBar from "../components/SideBar";
import {
  useGetAllUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../apis/adminApi";
import { useForm } from "react-hook-form";

function Users() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({ page, limit });

  const totalPages = data?.data?.pagination?.totalPages || 1;

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editUserId, setEditUserId] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setFormError("");
    setFormSuccess("");
    setLoading(true);

    try {
      if (editUserId) {
        await updateUser({
          id: editUserId,
          fullname: data.fullname,
          password: data.password || undefined,
        }).unwrap();
        setFormSuccess("User updated successfully!");
      } else {
        await addUser(data).unwrap();
        setFormSuccess("User added successfully!");
      }

      reset();
      setEditUserId(null);
      refetch();
    } catch (error) {
      setFormError(error?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setValue("fullname", user.fullname);
    setValue("email", user.email);
    setValue("password", "");
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    reset();
    setFormError("");
    setFormSuccess("");
  };

  const confirmDeleteUser = async () => {
    setFormError("");
    setFormSuccess("");
    try {
      await deleteUser(userToDelete._id).unwrap();
      setFormSuccess("User deleted successfully!");
      setUserToDelete(null);
      setShowDeleteModal(false);
      refetch();
    } catch (error) {
      setFormError(error?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#e8f5e9] overflow-hidden">
      <div className="flex-shrink-0">
        <SideBar activeTab="/dashboard/users" />
      </div>

      <main className="flex-1 p-4 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Users Management</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white border border-[#c8e6c9] p-6 rounded-xl shadow-md w-full max-w-xl mx-auto mb-10"
        >
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
            {editUserId ? "Edit User" : "Add New User"}
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...register("fullname", { required: "Full name is required" })}
              className="w-full bg-[#f1f8e9] border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#81c784] focus:outline-none"
            />
            {errors.fullname && (
              <p className="text-red-600 text-sm mt-1">{errors.fullname.message}</p>
            )}
          </div>

          {!editUserId && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
                className="w-full bg-[#f1f8e9] border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#81c784] focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">
              {editUserId ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              {...register("password", {
                validate: (value) => {
                  if (!editUserId && !value) return "Password is required";
                  if (value && value.length < 6) return "Password must be at least 6 characters";
                  return true;
                },
              })}
              className="w-full bg-[#f1f8e9] border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[#81c784] focus:outline-none"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex gap-3 mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2e7d32] text-white px-4 py-2 rounded hover:bg-[#1b5e20] transition disabled:opacity-50 cursor-pointer"
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
                className="bg-[#c8e6c9] text-[#1b5e20] px-4 py-2 rounded hover:bg-[#a5d6a7] transition cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {formSuccess && (
            <p className="text-green-800 bg-green-100 border border-green-300 px-3 py-2 rounded">
              {formSuccess}
            </p>
          )}
          {formError && (
            <p className="text-red-700 bg-red-50 border border-red-300 px-3 py-2 rounded">
              {formError}
            </p>
          )}
        </form>

        {isLoading && <p className="text-gray-500 text-center">Loading users...</p>}
        {isError && <p className="text-red-500 text-center">Failed to load users.</p>}

        {data?.data?.users && (
          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
              <thead className="bg-[#c8e6c9] text-[#1b5e20] text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...data.data.users.filter(u => u.role?.includes("admin")), ...data.data.users.filter(u => !u.role?.includes("admin"))].map((user, idx) => {
                  const isAdmin = user.role?.includes("admin");
                  return (
                    <tr key={user._id} className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-50`}>
                      <td className="px-4 py-3 whitespace-nowrap">{user.fullname}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{isAdmin ? "admin" : "user"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                        <button onClick={() => handleEdit(user)} className="text-[#2e7d32] cursor-pointer hover:text-[#1b5e20]">
                          <FiEdit size={16} />
                        </button>
                        {!isAdmin && (
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-700 cursor-pointer hover:text-red-900"
                          >
                            <FiTrash2 size={16} />
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

        <div className="mt-6 flex justify-center items-center gap-4 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-[#c8e6c9] text-[#1b5e20] rounded hover:bg-[#a5d6a7] disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span className="text-gray-700">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            className="px-3 py-1 bg-[#c8e6c9] text-[#1b5e20] rounded hover:bg-[#a5d6a7] disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md border border-gray-300">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h2>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete <strong>{userToDelete.fullname}</strong>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Users;

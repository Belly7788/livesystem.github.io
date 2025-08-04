// User.jsx
import { Link, Head } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../Component/Pagination/Pagination";
import DropdownInput from "../../Component/DropdownInput/DropdownInput";
import NoDataComponent from '../../Component/Empty/No-data/NoDataComponent';
import { showSuccessAlert } from "../../Component/Alert/SuccessAlert/SuccessAlert";
import { showConfirmAlert } from "../../Component/Alert/Confirm-Alert/Confirm-Alert";
import { showErrorAlert } from "../../Component/Alert/ErrorAlert/ErrorAlert"; // Import the new error alert

export default function User() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openActionDropdown, setOpenActionDropdown] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [isDeleting, setIsDeleting] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remark, setRemark] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const searchInputRef = useRef(null);

  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", firstName: "John", role: "Admin", remark: "" },
    { id: 2, username: "jane_smith", firstName: "Jane", role: "User", remark: "" },
  ]);

  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "User" },
    { id: 3, name: "Editor" },
  ];

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("Search term:", searchTerm);
    }
  };

  const openPopup = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUsername(user.username);
      setFullName(user.firstName);
      setSelectedRole(user.role);
      setRemark(user.remark);
    } else {
      setEditingUser(null);
      setUsername("");
      setFullName("");
      setPassword("");
      setConfirmPassword("");
      setSelectedRole("");
      setRemark("");
    }
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingUser(null);
    setUsername("");
    setFullName("");
    setPassword("");
    setConfirmPassword("");
    setSelectedRole("");
    setShowPassword(false);
    setRemark("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !fullName || !selectedRole) {
      await showErrorAlert({ // Use showErrorAlert instead of showSuccessAlert
        title: "Error",
        message: "Please fill in all required fields!",
        darkMode: false,
      });
      return;
    }
    if (!editingUser && password !== confirmPassword) {
      await showErrorAlert({ // Use showErrorAlert instead of showSuccessAlert
        title: "Error",
        message: "Passwords do not match!",
        darkMode: false,
      });
      return;
    }

    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? { ...user, username, firstName: fullName, role: selectedRole, remark }
          : user
      );
      setUsers(updatedUsers);
      await showSuccessAlert({
        title: "Success",
        message: "User updated successfully!",
        darkMode: false,
      });
    } else {
      const newUser = {
        id: users.length + 1,
        username,
        firstName: fullName,
        role: selectedRole,
        remark,
      };
      setUsers([...users, newUser]);
      await showSuccessAlert({
        title: "Success",
        message: "User added successfully!",
        darkMode: false,
      });
    }
    closePopup();
  };

  const handleEditClick = (user) => {
    setIsEditing((prev) => ({ ...prev, [user.id]: true }));
    openPopup(user);
    setTimeout(() => {
      setIsEditing((prev) => ({ ...prev, [user.id]: false }));
    }, 1000);
  };

  const handleDelete = async (userId) => {
    const confirmed = await showConfirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this user?",
      darkMode: false,
      onConfirm: () => {
        setUsers(users.filter((user) => user.id !== userId));
        showSuccessAlert({
          title: "Success",
          message: "User deleted successfully!",
          darkMode: false,
        });
      },
    });

    if (confirmed) {
      setIsDeleting((prev) => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setIsDeleting((prev) => ({ ...prev, [userId]: false }));
      }, 1000);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * entriesPerPage;
  const indexOfFirstUser = indexOfLastUser - entriesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    const maxPage = Math.ceil(filteredUsers.length / entriesPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, entriesPerPage, currentPage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-container')) {
        setOpenActionDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPopupOpen) {
        closePopup();
      }
      if (e.ctrlKey && e.key === "Enter" && isPopupOpen) {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPopupOpen]);

  return (
    <>
      <Head title="User" />

      <div className="mx-auto p-6 bg-gray-50 min-h-screen">
        <style>
          {`
            thead.sticky {
              position: sticky;
              top: 0;
              z-index: 10;
              background-color: #f3f4f6;
            }
          `}
        </style>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              ref={searchInputRef}
              className="w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] shadow-sm hover:shadow-md transition-shadow duration-200 bg-white text-gray-700 placeholder-gray-400 border border-gray-300"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => openPopup()}
              className="flex items-center text-sm px-4 py-2 rounded-lg transition bg-[#ff8800] text-white hover:bg-[#f7b500]"
            >
              <FaPlus className="mr-2" /> Add New
            </button>
          </div>
        </div>

        <div
          id="add-new-popup"
          className={`fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${
            isPopupOpen ? "bg-opacity-60 opacity-100 visible" : "bg-opacity-0 opacity-0 invisible"
          }`}
        >
          <div
            className={`rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out bg-white text-gray-900 ${
              isPopupOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 -translate-y-4 opacity-0"
            }`}
          >
            <div className="p-6 sticky top-0 z-10 rounded-t-xl bg-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <svg
                  className="w-6 h-6 mr-2 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
            </div>
            <div className="flex-1 custom-scrollbar overflow-y-auto p-6 pt-0">
              <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 bg-white text-gray-900 border-gray-200"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 bg-white text-gray-900 border-gray-200"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                  <DropdownInput
                    name="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    placeholder="Select a role"
                    options={roles}
                    darkMode={false}
                    className="w-full"
                    required
                  />
                </div>
                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 bg-white text-gray-900 border-gray-200"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 bg-white text-gray-900 border-gray-200"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="mr-2 custom-checkbox-border custom-checkbox"
                      />
                      <label htmlFor="showPassword" className="text-sm text-gray-700">
                        Show Password
                      </label>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Remark</label>
                  <textarea
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 bg-white text-gray-900 border-gray-200"
                    placeholder="Enter remarks"
                    rows="4"
                  />
                </div>
              </form>
            </div>
            <div className="rounded-b-xl p-6 pt-0 sticky bottom-0 z-10 bg-white">
              <div className="flex justify-end items-center space-x-4">
                <button
                  type="button"
                  onClick={closePopup}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-sm"
                >
                  Cancel (ESC)
                </button>
                <button
                  type="submit"
                  form="add-user-form"
                  className="border border-[#ff8800] text-[#ff8800] hover:bg-[#ff8800] hover:text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-md"
                >
                  {editingUser ? "Update" : "Save"} (CTRL + ENTER)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-off rounded-lg text-sm h-[calc(100vh-14rem)] mx-auto custom-scrollbar">
          <div className="w-full min-w-max">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <NoDataComponent
                        darkMode={false}
                        width={200}
                        height={200}
                        fontSize={16}
                      />
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr key={user.id} className="bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100 border-b cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.remark}</td>
                      <td className="p-3 w-36">
                        <div className="relative action-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionDropdown(openActionDropdown === user.id ? null : user.id);
                            }}
                            className="text-gray-500 hover:text-[#ff8800] p-2 rounded transition duration-200 hover:bg-orange-100"
                          >
                            <FaEllipsisV className="w-5 h-5" />
                          </button>
                          {openActionDropdown === user.id && (
                            <div className="absolute right-24 w-40 rounded-lg shadow-lg z-20 bg-white text-gray-900">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="w-full text-left hover:rounded px-4 py-2 text-sm flex items-center hover:bg-gray-100"
                                disabled={isEditing[user.id]}
                              >
                                {isEditing[user.id] ? (
                                  <span className="mr-2">Loading...</span>
                                ) : (
                                  <FaEdit className="w-4 h-4 mr-2 text-orange-400" />
                                )}
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="w-full text-left px-4 hover:rounded py-2 text-sm flex items-center hover:bg-gray-100"
                                disabled={isDeleting[user.id]}
                              >
                                {isDeleting[user.id] ? (
                                  <span className="mr-2">Loading...</span>
                                ) : (
                                  <FaTrash className="w-4 h-4 mr-2 text-red-400" />
                                )}
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          darkMode={false}
          currentPage={currentPage}
          totalEntries={filteredUsers.length}
          entriesPerPage={entriesPerPage}
          onPageChange={handlePageChange}
          onEntriesPerPageChange={handleEntriesPerPageChange}
        />
      </div>
    </>
  );
}

User.title = "System";
User.subtitle = "User";

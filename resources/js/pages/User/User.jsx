import { Link, Head, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../Component/Pagination/Pagination";
import DropdownInput from "../../Component/DropdownInput/DropdownInput";
import NoDataComponent from '../../Component/Empty/No-data/NoDataComponent';
import { showSuccessAlert } from "../../Component/Alert/SuccessAlert/SuccessAlert";
import { showConfirmAlert } from "../../Component/Alert/Confirm-Alert/Confirm-Alert";
import { showErrorAlert } from "../../Component/Alert/ErrorAlert/ErrorAlert";
import Spinner from "../../Component/Loading/spinner/spinner";
import axios from 'axios';

export default function User({ darkMode, users, pagination, roles, search }) {
    const [searchTerm, setSearchTerm] = useState(search || "");
    const [openActionDropdown, setOpenActionDropdown] = useState(null);
    const [isEditing, setIsEditing] = useState({});
    const [isDeleting, setIsDeleting] = useState({});
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [entriesPerPage, setEntriesPerPage] = useState(pagination.per_page);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [remark, setRemark] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const searchInputRef = useRef(null);
    const saveButtonRef = useRef(null);

    // Sync searchTerm with search prop
    useEffect(() => {
        setSearchTerm(search || "");
    }, [search]);

    // Real-time username validation
    useEffect(() => {
        if (!username || (editingUser && username === editingUser.username)) {
            setUsernameError("");
            return;
        }

        const debounce = setTimeout(() => {
            axios.get(`/system/user/check-username`, { params: { username } })
                .then(response => {
                    if (response.data.exists) {
                        setUsernameError("Username already exists");
                    } else {
                        setUsernameError("");
                    }
                })
                .catch(() => {
                    setUsernameError("Error checking username");
                });
        }, 500);

        return () => clearTimeout(debounce);
    }, [username, editingUser]);

    // Real-time password length validation
    useEffect(() => {
        if (password && password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
        } else {
            setPasswordError("");
        }
    }, [password]);

    // Real-time confirm password matching validation
    useEffect(() => {
        if (password && confirmPassword && confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    }, [confirmPassword, password]);

    const openPopup = (user = null) => {
        setEditingUser(user);
        if (user) {
            setUsername(user.username);
            setFullName(user.full_name);
            setSelectedRole(user.role_id);
            setRemark(user.remark || "");
            setPassword("");
            setConfirmPassword("");
        } else {
            resetForm();
        }
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        const hasChanges = username || fullName || password || confirmPassword || selectedRole || remark;
        if (hasChanges) {
            showConfirmAlert({
                title: "Confirm Close",
                message: "Are you sure you want to close? All changes will be lost.",
                darkMode,
                onConfirm: () => {
                    setIsPopupOpen(false);
                    setEditingUser(null);
                    resetForm();
                },
            });
        } else {
            setIsPopupOpen(false);
            setEditingUser(null);
            resetForm();
        }
    };

    const resetForm = () => {
        setUsername("");
        setFullName("");
        setPassword("");
        setConfirmPassword("");
        setSelectedRole("");
        setRemark("");
        setShowPassword(false);
        setUsernameError("");
        setPasswordError("");
        setConfirmPasswordError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;
        if (!username) {
            setUsernameError("Username is required");
            hasError = true;
        }
        if (!fullName) {
            showErrorAlert({ title: "Error", message: "Full name is required.", darkMode });
            hasError = true;
        }
        if (!selectedRole) {
            showErrorAlert({ title: "Error", message: "Role is required.", darkMode });
            hasError = true;
        }
        if (!editingUser && !password) {
            setPasswordError("Password is required");
            hasError = true;
        }
        if (!editingUser && !confirmPassword) {
            setConfirmPasswordError("Confirm password is required");
            hasError = true;
        }
        if (usernameError || passwordError || confirmPasswordError) {
            hasError = true;
        }

        if (hasError) {
            showErrorAlert({
                title: "Error",
                message: "Please fix all validation errors before submitting.",
                darkMode,
            });
            return;
        }

        setIsSaving(true);
        const data = {
            username,
            full_name: fullName,
            role_id: selectedRole,
            remark: remark || null,
            ...(password && { password, password_confirmation: confirmPassword }),
        };

        const request = editingUser
            ? router.put(`/system/user/${editingUser.id}`, data, {
                onSuccess: () => {
                    setIsSaving(false);
                    setIsPopupOpen(false);
                    setEditingUser(null);
                    resetForm();
                    showSuccessAlert({ title: "Success", message: "User updated successfully.", darkMode });
                },
                onError: (errors) => {
                    setIsSaving(false);
                    let errorMessage = "Failed to update user.";
                    if (errors.username) errorMessage = "Username already exists.";
                    showErrorAlert({ title: "Error", message: errorMessage, darkMode });
                },
            })
            : router.post('/system/user', data, {
                onSuccess: () => {
                    setIsSaving(false);
                    setIsPopupOpen(false);
                    setEditingUser(null);
                    resetForm();
                    showSuccessAlert({ title: "Success", message: "User created successfully.", darkMode });
                },
                onError: (errors) => {
                    setIsSaving(false);
                    let errorMessage = "Failed to create user.";
                    if (errors.username) errorMessage = "Username already exists.";
                    showErrorAlert({ title: "Error", message: errorMessage, darkMode });
                },
            });
    };

    const handleEditClick = (user) => {
        setIsEditing((prev) => ({ ...prev, [user.id]: true }));
        setTimeout(() => {
            openPopup(user);
            setIsEditing((prev) => ({ ...prev, [user.id]: false }));
        }, 500);
    };

    const handleDelete = (userId) => {
        showConfirmAlert({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this user?",
            darkMode,
            isLoading: isDeleting[userId],
            onConfirm: () => {
                setIsDeleting((prev) => ({ ...prev, [userId]: true }));
                router.put(`/system/user/${userId}/status`, {}, {
                    onSuccess: () => {
                        setIsDeleting((prev) => ({ ...prev, [userId]: false }));
                        setOpenActionDropdown(null);
                        showSuccessAlert({ title: "Success", message: "User deleted successfully.", darkMode });
                    },
                    onError: (errors) => {
                        setIsDeleting((prev) => ({ ...prev, [userId]: false }));
                        showErrorAlert({ title: "Error", message: errors.message || "Failed to delete user.", darkMode });
                    },
                });
            },
        });
    };

    const handleSearch = () => {
        setIsSearching(true);
        router.get(
            '/system/user',
            { search: searchTerm.trim(), page: 1, per_page: entriesPerPage },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsSearching(false),
            }
        );
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleEntriesPerPageChange = (e) => {
        const newEntriesPerPage = Number(e.target.value);
        setEntriesPerPage(newEntriesPerPage);
        setCurrentPage(1);
        router.get(
            '/system/user',
            { page: 1, per_page: newEntriesPerPage, search: searchTerm.trim() },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        router.get(
            '/system/user',
            { page, per_page: entriesPerPage, search: searchTerm.trim() },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isPopupOpen) {
                closePopup();
            }
            if (e.ctrlKey && e.key === "Enter" && isPopupOpen) {
                saveButtonRef.current?.click();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPopupOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.action-container')) {
                setOpenActionDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <Head title="User" />
            <div className={`w-full rounded-lg shadow-md ${darkMode ? "bg-[#1A1A1A] text-gray-200" : "bg-white text-gray-900"}`} style={{ fontFamily: "'Battambang', 'Roboto', sans-serif" }}>
                <div className="w-full mx-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Search by username or full name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleSearchKeyPress}
                                ref={searchInputRef}
                                className={`w-full p-2 pl-10 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8800] shadow-sm hover:shadow-md transition-shadow duration-200 ${darkMode ? "bg-[#2D2D2D] text-gray-300 placeholder-gray-500 border border-gray-700" : "bg-white text-gray-700 placeholder-gray-400 border border-gray-300"}`}
                                disabled={isSearching}
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {isSearching ? (
                                    <Spinner width="20px" height="20px" />
                                ) : (
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
                                )}
                            </span>
                            {searchTerm && !isSearching && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        router.get(
                                            '/system/user',
                                            { search: "", page: 1, per_page: entriesPerPage },
                                            { preserveState: true, preserveScroll: true }
                                        );
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#ff8800]"
                                >
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => openPopup()}
                                className={`flex items-center text-sm px-4 py-2 rounded-lg transition ${darkMode ? "bg-[#3A3A3A] text-gray-200 hover:bg-[#4A4A4A]" : "bg-[#ff8800] text-white hover:bg-[#f7b500]"}`}
                            >
                                <FaPlus className="mr-2" /> Add New
                            </button>
                        </div>
                    </div>
                    <div className="relative overflow-x-auto rounded-lg text-sm h-[calc(100vh-14rem)] mx-auto custom-scrollbar">
                        <div className="w-full min-w-max">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={`sticky ${darkMode ? "bg-[#2D2D2D] border-b border-gray-700" : "bg-[#ff8800]"}`}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>No</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>Username</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>Full Name</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>Role</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>Remark</th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-300" : "text-white"}`}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center">
                                                <NoDataComponent darkMode={darkMode} width={200} height={200} fontSize={16} />
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <tr key={user.id} className={`border-b cursor-pointer ${darkMode ? "bg-[#1A1A1A] text-gray-300 border-gray-700 hover:bg-[#2D2D2D]" : "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`label-pink ${darkMode ? "label-pink-darkmode" : ""}`}>{user.username}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.full_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role?.role_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.remark}</td>
                                                <td className="p-3 w-36">
                                                    <div className="relative action-container">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenActionDropdown(openActionDropdown === user.id ? null : user.id);
                                                            }}
                                                            className={`text-gray-500 hover:text-[#ff8800] p-2 rounded transition duration-200 ${darkMode ? "hover:drop-shadow-[0_0_8px_rgba(255,136,0,0.8)]" : "hover:bg-orange-100"}`}
                                                        >
                                                            <FaEllipsisV className="w-5 h-5" />
                                                        </button>
                                                        {openActionDropdown === user.id && (
                                                            <div className={`absolute right-24 w-40 rounded-lg shadow-lg z-20 ${darkMode ? "bg-[#2D2D2D] text-gray-200" : "bg-white text-gray-900"}`}>
                                                                <button
                                                                    onClick={() => handleEditClick(user)}
                                                                    className={`w-full text-left hover:rounded px-4 py-2 text-sm flex items-center ${darkMode ? "hover:bg-[#3A3A3A]" : "hover:bg-gray-100"}`}
                                                                    disabled={isEditing[user.id]}
                                                                >
                                                                    {isEditing[user.id] ? (
                                                                        <Spinner width="16px" height="16px" className="mr-2" />
                                                                    ) : (
                                                                        <FaEdit className="w-4 h-4 mr-2 text-orange-400" />
                                                                    )}
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className={`w-full text-left px-4 hover:rounded py-2 text-sm flex items-center ${darkMode ? "hover:bg-[#3A3A3A]" : "hover:bg-gray-100"}`}
                                                                    disabled={isDeleting[user.id]}
                                                                >
                                                                    {isDeleting[user.id] ? (
                                                                        <Spinner width="16px" height="16px" className="mr-2" />
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
                        darkMode={darkMode}
                        currentPage={currentPage}
                        totalEntries={pagination.total}
                        entriesPerPage={entriesPerPage}
                        onPageChange={handlePageChange}
                        onEntriesPerPageChange={handleEntriesPerPageChange}
                    />
                </div>
                <div id="add-new-popup" className={`fixed inset-0 bg-gray-900 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${isPopupOpen ? "bg-opacity-60 opacity-100 visible" : "bg-opacity-0 opacity-0 invisible"}`}>
                    <div className={`rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out ${darkMode ? "bg-[#1A1A1A] text-gray-200" : "bg-white text-gray-900"}`}>
                        <div className={`p-6 sticky top-0 z-10 rounded-t-xl ${darkMode ? "bg-[#1A1A1A]" : "bg-white"}`}>
                            <h2 className={`text-2xl font-bold mb-6 flex items-center ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                                <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                {editingUser ? "Edit User" : "Add New User"}
                            </h2>
                        </div>
                        <div className="flex-1 custom-scrollbar overflow-y-auto p-6 pt-0">
                            <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ${darkMode ? "bg-[#2D2D2D] text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ${usernameError ? 'border-red-500' : darkMode ? "bg-[#2D2D2D] text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                                            placeholder="Enter username"
                                            required
                                        />
                                        {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Role</label>
                                        <DropdownInput
                                            name="role"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            placeholder="Select role"
                                            options={roles.map(role => ({ id: role.id, name: role.name }))}
                                            darkMode={darkMode}
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ${passwordError ? 'border-red-500' : darkMode ? "bg-[#2D2D2D] text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                                            placeholder={editingUser ? "Enter new password" : "Enter password"}
                                            required={!editingUser}
                                        />
                                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Confirm Password</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ${confirmPasswordError ? 'border-red-500' : darkMode ? "bg-[#2D2D2D] text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                                            placeholder={editingUser ? "Confirm new password" : "Confirm password"}
                                            required={!editingUser}
                                        />
                                        {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                                    </div>
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={showPassword}
                                                onChange={() => setShowPassword(!showPassword)}
                                                className="mr-2"
                                            />
                                            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Show Password</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Remark</label>
                                        <textarea
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            className={`w-full border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200 ${darkMode ? "bg-[#2D2D2D] text-gray-300 border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}
                                            placeholder="Enter remark"
                                            rows="4"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className={`rounded-b-xl p-6 pt-0 sticky bottom-0 z-10 ${darkMode ? "bg-[#1A1A1A]" : "bg-white"}`}>
                            <div className="flex justify-end items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className={`${darkMode ? "bg-[#3A3A3A] text-gray-300 hover:bg-[#4A4A4A]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-sm`}
                                >
                                    Cancel (ESC)
                                </button>
                                <button
                                    type="submit"
                                    form="add-user-form"
                                    ref={saveButtonRef}
                                    disabled={isSaving || usernameError || passwordError || confirmPasswordError}
                                    className={`border flex items-center justify-center ${darkMode ? "border-[#ff8800] text-[#ff8800] hover:bg-[#ff8800] hover:text-white" : "border-[#ff8800] text-[#ff8800] hover:bg-[#ff8800] hover:text-white"} font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-md ${isSaving || usernameError || passwordError || confirmPasswordError ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {isSaving ? <Spinner width="16px" height="16px" className="mr-2" /> : (editingUser ? "Update" : "Save")}
                                    {isSaving ? "Saving..." : ' (CTRL + ENTER)'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

User.title = "System";
User.subtitle = "User";

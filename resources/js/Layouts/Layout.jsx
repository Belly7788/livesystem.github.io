import { Link, usePage, router } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaSearch,
  FaList,
  FaCheckCircle,
  FaTruck,
  FaComments,
  FaUser,
  FaTag,
  FaChartBar,
  FaCog,
  FaBox,
  FaSignOutAlt,
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaReceipt,
} from "react-icons/fa";
import { showConfirmAlert } from "../Component/Alert/Confirm-Alert/Confirm-Alert";

export function Layout({ children }) {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isSystemOpen, setIsSystemOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const title = React.Children.map(children, (child) => child.type.title)?.[0] || "";
    const subtitle = React.Children.map(children, (child) => child.type.subtitle)?.[0] || "";

    const { url } = usePage();
    const username = "User";

    const isActive = (href, subRoutes = []) => {
        return url === href || subRoutes.some((route) => url.startsWith(route));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        const confirmed = await showConfirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to logout?",
            onConfirm: () => {
                router.post('/logout');
            },
            darkMode: false,
            isLoading: false,
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className="flex min-h-screen">
            <aside
                ref={sidebarRef}
                className={`fixed top-0 left-0 h-screen w-64 bg-[#ff8800] text-white shadow-lg z-30 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:w-[17rem]`}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="w-full justify-center flex flex-col items-center">
                        <div className="mb-2 flex p-1 rounded-full justify-center bg-[#ffffff] shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img
                                src="/storage/logo/image/1.1.png"
                                alt="Logo"
                                className="w-20 h-20 rounded-full"
                            />
                        </div>
                        <div className="text-sm text-white">v.1.1.1.1</div>
                    </div>
                    <nav className="uppercase">
                        <ul className="space-y-2 truncate">
                            <li>
                                <Link
                                    href="/"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaHome className="mr-2" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sale"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/sale") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaShoppingCart className="mr-2" />
                                    Sale
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search-order"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/search-order") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaSearch className="mr-2" />
                                    Search Order
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/order-list"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/order-list") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaList className="mr-2" />
                                    Order List
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/confirm-transfer"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/confirm-transfer") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Confirm Transfer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pickup"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/pickup") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaTruck className="mr-2" />
                                    Pickup
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/chat"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/chat") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaComments className="mr-2" />
                                    Chat
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search-customer"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/search-customer") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaUser className="mr-2" />
                                    Search Customer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/label"
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/label") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FaTag className="mr-2" />
                                    Label
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsReportOpen(!isReportOpen)}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/report", ["/report/stock", "/report/receipt"])
                                            ? "bg-white text-[#ff8800]"
                                            : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                >
                                    <FaChartBar className="mr-2" />
                                    Report
                                    {isReportOpen ? (
                                        <FaAngleUp className="ml-auto" />
                                    ) : (
                                        <FaAngleDown className="ml-auto" />
                                    )}
                                </button>
                                <ul
                                    className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isReportOpen ? "max-h-40" : "max-h-0"
                                    }`}
                                >
                                    <li>
                                        <Link
                                            href="/report/stock"
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive("/report/stock") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <FaBox className="mr-2" />
                                            Stock
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/report/receipt"
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive("/report/receipt") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <FaReceipt className="mr-2" />
                                            Receipt
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsSystemOpen(!isSystemOpen)}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/system", ["/system/user"])
                                            ? "bg-white text-[#ff8800]"
                                            : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                >
                                    <FaCog className="mr-2" />
                                    System
                                    {isSystemOpen ? (
                                        <FaAngleUp className="ml-auto" />
                                    ) : (
                                        <FaAngleDown className="ml-auto" />
                                    )}
                                </button>
                                <ul
                                    className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isSystemOpen ? "max-h-40" : "max-h-0"
                                    }`}
                                >
                                    <li>
                                        <Link
                                            href="/system/user"
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive("/system/user") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            User
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/system/facebook"
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive("/system/facebook") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            facebook
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                                    className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/catalog", ["/catalog/products"])
                                            ? "bg-white text-[#ff8800]"
                                            : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                >
                                    <FaBox className="mr-2" />
                                    Catalog
                                    {isCatalogOpen ? (
                                        <FaAngleUp className="ml-auto" />
                                    ) : (
                                        <FaAngleDown className="ml-auto" />
                                    )}
                                </button>
                                <ul
                                    className={`ml-6 mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isCatalogOpen ? "max-h-40" : "max-h-0"
                                    }`}
                                >
                                    <li>
                                        <Link
                                            href="/catalog/products"
                                            className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                                                isActive("/catalog/products") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Products
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className={`flex items-center mb-2 w-full p-3 rounded-lg transition-colors duration-200 ${
                                        isActive("/logout") ? "bg-white text-[#ff8800]" : "hover:bg-white hover:text-[#ff8800]"
                                    }`}
                                >
                                    <FaSignOutAlt className="mr-2" />
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out lg:hidden ${
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div
                className="flex-1 lg:ml-[17rem]"
                onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
            >
                <header className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-md shadow-sm z-20 lg:left-[17rem]">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <button
                                className="lg:hidden text-gray-800 focus:outline-none mr-4"
                                onClick={toggleSidebar}
                            >
                                <FaBars className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl uppercase font-semibold">
                                {title}
                                {subtitle && (
                                    <>
                                        <span className="inline-block mx-2">|</span>
                                        {subtitle}
                                    </>
                                )}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <img
                                    src="/storage/logo/image/1.1.png"
                                    alt="User Profile"
                                    className="w-10 h-10 cursor-pointer rounded-full border-2 border-[#ff8800]"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                />
                                <div
                                    className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform ${
                                        isProfileOpen
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-95 pointer-events-none"
                                    }`}
                                >
                                    <div className="p-4 text-gray-800">
                                        <p className="font-semibold">Hello, {username}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="pt-20 flex-1 min-w-full custom-scrollbar p-2 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

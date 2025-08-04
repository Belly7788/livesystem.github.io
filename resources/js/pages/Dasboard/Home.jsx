import { Link, Head } from "@inertiajs/react";

export default function Home() {
  const menuItems = [
    { name: "Sale", href: "/sale", iconPath: "M12 2.1L1 12h3v9h7v-6h4v6h7v-9h3L12 2.1zM12 4.9l5 4.9v9h-3v-6H10v6H7v-9l5-4.9z" },
    { name: "Search Order", href: "/search-order", iconPath: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" },
    { name: "Order List", href: "/order-list", iconPath: "M4 5h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" },
    { name: "Confirm Transfer", href: "/confirm-transfer", iconPath: "M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h6l2 2h8v10z" },
    { name: "Stock", href: "/stock", iconPath: "M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM7 7h10v2H7zm0 4h10v2H7zm0 4h10v2H7z" },
    { name: "Search Customer", href: "/search-customer", iconPath: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
  ];

  return (
    <>
        <Head title="Home" />
        <div className="min-h-screen w-full bg-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full h-[40rem] mx-auto cursor-pointer">
                {menuItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="group flex flex-col items-center justify-center gap-4 rounded-lg bg-white text-[#ff8800] hover:bg-[#ff8800] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                    <svg
                    className="w-20 h-20 fill-[#ff8800] group-hover:fill-white transition-colors duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    >
                    <path d={item.iconPath} />
                    </svg>
                    <span className="text-lg font-semibold group-hover:text-white transition-colors duration-300">
                    {item.name}
                    </span>
                </Link>
                ))}
            </div>
        </div>
    </>
  );
}

Home.title = "Dashboard";


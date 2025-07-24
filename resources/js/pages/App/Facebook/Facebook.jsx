import { Link, Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";

const loadFacebookSDK = (appId) => {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      resolve();
      return;
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v23.0",
      });
      resolve();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onload = () => resolve();
      js.onerror = () => reject(new Error("Failed to load Facebook SDK"));
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  });
};

const Facebook = () => {
  const { connections, facebookAppId } = usePage().props;
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [error, setError] = useState(null);
  const [activeConnection, setActiveConnection] = useState(null);

  useEffect(() => {
    loadFacebookSDK(facebookAppId)
      .then(() => {
        window.FB.getLoginStatus((response) => {
          console.log("Login status:", response);
          if (response.status === "connected") {
            setIsConnected(true);
            fetchUserData(response.authResponse);
          }
        });
      })
      .catch((err) => {
        setError("Failed to initialize Facebook SDK");
        console.error(err);
      });
  }, [facebookAppId]);

  const fetchUserData = (authResponse) => {
    window.FB.api("/me?fields=id,name,picture", (response) => {
      if (response && !response.error) {
        setUserProfile({
          facebook_user_id: response.id,
          name: response.name,
          picture: response.picture?.data?.url || "https://via.placeholder.com/100",
        });

        axios
          .post("/system/facebook/connect", {
            facebook_user_id: response.id,
            facebook_user_name: response.name,
            access_token: authResponse.accessToken,
          })
          .catch((err) => {
            setError("Failed to save connection");
            console.error(err);
          });
      } else {
        setError("Failed to fetch user profile");
        console.error("Error fetching user profile:", response.error);
      }
    });

    window.FB.api("/me/accounts?fields=id,name,picture,access_token", (response) => {
      if (response && !response.error) {
        const pagesData = response.data.map((page) => ({
          id: page.id,
          name: page.name,
          picture: page.picture?.data?.url || "https://via.placeholder.com/50",
          access_token: page.access_token,
        }));
        setPages(pagesData);

        axios
          .post("/system/facebook/connect", {
            facebook_user_id: authResponse.userID,
            pages: pagesData,
          })
          .catch((err) => {
            setError("Failed to save pages");
            console.error(err);
          });
      } else {
        setError("Failed to fetch pages");
        console.error("Error fetching pages:", response.error);
      }
    });
  };

  const handleConnect = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          setIsConnected(true);
          fetchUserData(response.authResponse);
        } else {
          setError("Login cancelled or failed");
          console.error("Login failed:", response);
        }
      },
      { scope: "public_profile,pages_show_list,pages_read_engagement,pages_manage_posts" }
    );
  };

  const handleUnconnect = (facebook_user_id) => {
    window.FB.logout(() => {
      axios
        .post(`/system/facebook/disconnect/${facebook_user_id}`)
        .then(() => {
          setIsConnected(false);
          setPages([]);
          setSelectedPage("");
          setUserProfile(null);
          setError(null);
          setActiveConnection(null);
        })
        .catch((err) => {
          setError("Failed to disconnect");
          console.error(err);
        });
    });
  };

  const handleSave = () => {
    if (!selectedPage || !userProfile) {
      setError("Please select a page and ensure you are connected");
      return;
    }

    const page = pages.find((p) => p.name === selectedPage);
    axios
      .post("/system/facebook/select-page", {
        facebook_user_id: userProfile.facebook_user_id,
        page_id: page.id,
        page_name: page.name,
        page_picture: page.picture,
        page_access_token: page.access_token,
      })
      .then(() => {
        alert(`Saved page: ${selectedPage}`);
      })
      .catch((err) => {
        setError("Failed to save page");
        console.error(err);
      });
  };

  const switchAccount = (connection) => {
    setActiveConnection(connection);
    setSelectedPage(connection.selected_page_name || "");
    setUserProfile({
      facebook_user_id: connection.facebook_user_id,
      name: connection.facebook_user_name,
      picture: connection.selected_page_picture || "https://via.placeholder.com/100",
    });
    setPages([
      {
        id: connection.selected_page_id,
        name: connection.selected_page_name,
        picture: connection.selected_page_picture,
        access_token: connection.page_access_token,
      },
    ]);
    setIsConnected(true);
  };

  return (
    <>
      <Head title="Facebook" />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img
              src="/storage/logo/image/fb.png"
              alt="Facebook Logo"
              className="h-12"
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-[#ff8800]">
            Facebook Connection
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {/* Display Connected Accounts */}
          {connections.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Connected Accounts</h2>
              <div className="space-y-2">
                {connections.map((connection) => (
                  <div
                    key={connection.facebook_user_id}
                    className={`flex items-center justify-between p-3 bg-gray-50 rounded-md cursor-pointer ${
                      activeConnection?.facebook_user_id === connection.facebook_user_id
                        ? "border-2 border-[#ff8800]"
                        : ""
                    }`}
                    onClick={() => switchAccount(connection)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={connection.selected_page_picture || "https://via.placeholder.com/50"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">{connection.facebook_user_name}</p>
                        <p className="text-sm text-gray-500">
                          {connection.selected_page_name || "No page selected"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnconnect(connection.facebook_user_id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      Disconnect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Connect New Account */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="w-full bg-[#ff8800] text-white py-2 px-4 rounded-md hover:bg-[#e07b00] transition duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Connect to Facebook
            </button>
          ) : (
            <div className="space-y-4">
              {userProfile && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <img
                    src={userProfile.picture}
                    alt="Profile"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{userProfile.name}</p>
                    <p className="text-sm text-gray-500">Connected Account</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Facebook Page
                </label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#ff8800] focus:border-[#ff8800]"
                >
                  <option value="">Select a page</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.name}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPage && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <img
                    src={pages.find((page) => page.name === selectedPage)?.picture}
                    alt="Page Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{selectedPage}</p>
                    <p className="text-sm text-gray-500">Selected Page</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#ff8800] text-white py-2 px-4 rounded-md hover:bg-[#e07b00] transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => handleUnconnect(userProfile.facebook_user_id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Facebook;

Facebook.title = "System";
Facebook.subtitle = "facebook";

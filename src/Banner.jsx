import { useState, useEffect } from "react";

export default function Banner() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("https://weblift-api-server.onrender.com/api/v2/service-status");
        const data = await response.json();
        if (data.status_code === 200) {
          setStatus("up");
        } else {
          setStatus("loading");
        }
      } catch (error) {
        console.error("Error fetching service status:", error);
        setStatus("loading");
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-500 via-purple-400 to-blue-500">
      <div className="max-w-[85rem] px-4 py-2 lg:px-5 mx-auto">
        {status === "loading" ? (
          <div className="text-white text-center text-sm flex items-center justify-center my-2">
            <p>Checking health status of core system...</p>
            <div className="ml-2 border-t-2 border-white rounded-full w-4 h-4 animate-spin"></div>
          </div>
        ) : (
          <div className="text-white text-center text-sm flex items-center justify-center my-2">
            <p>All systems are up and running</p>
            <svg
              className="ml-2 w-5 h-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="rgba(83,230,35,1)"
            >
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

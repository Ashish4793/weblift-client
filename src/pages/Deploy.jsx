import { useState, useEffect } from "react";
import io from "socket.io-client";
import Confetti from "react-confetti"; // Assuming you have Confetti installed
import { useWindowSize } from "react-use"; // To get window size for confetti
import Navbar from "../Navbar";
import Banner from "../Banner";
function Deploy() {
  const [gitURL, setGitURL] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true); // State to control deploy form visibility
  const [buildCommand, setBuildCommand] = useState("");
  const [startCommand, setStartCommand] = useState("");
  const [rootDirectory, setRootDirectory] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [envVariables, setEnvVariables] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]); // Initially empty
  const [showConfetti, setShowConfetti] = useState(false); // Control confetti display
  const [status, setStatus] = useState(""); // State for status
  const [projectIp, setProjectIp] = useState(responseData?.data?.ip || "");

  const frameworks = [
    {
      name: "express.js",
      logo: "https://img.icons8.com/ios/50/ffffff/express-js.png",
    },
    { name: "vite.js", logo: "https://img.icons8.com/color/48/vite.png" },
    {
      name: "create react app",
      logo: "https://img.icons8.com/plasticine/100/react.png",
    },
    // { name: 'flask', logo: 'https://img.icons8.com/ios/50/ffffff/flask.png' },
  ];

  const handleRefreshStatus = async () => {
    if (!responseData?.data?.instance_ID) return;

    // Disable the button for 3 minutes
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 180000); // 3 minutes in milliseconds

    try {
      const response = await fetch(
        `https://weblift-api-server.onrender.com/api/v2/status?instanceID=${responseData.data.instance_ID}`
      );
      if (!response.ok) throw new Error("Failed to fetch project status");

      const data = await response.json();
      console.log(data);

      setStatus(data.status);

      // Update the project IP if it's available in the response
      if (data?.projectUrl) {
        setProjectIp(data.projectUrl);
        setShowConfetti(true);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  // Get window size for Confetti
  const { width, height } = useWindowSize();

  useEffect(() => {
    let socket;
    if (responseData) {
      socket = io("http://localhost:9002");

      socket.emit("subscribe", `${responseData.data.projectSlug}`);

      socket.on("message", (log) => {
        if (!log.toLowerCase().includes("joined")) {
          setLogs((prevLogs) => {
            if (prevLogs.length === 0) {
              return [log]; // First log received
            }
            return [...prevLogs, log]; // Append real logs
          });

          // Show Confetti if the final log contains "Deployment Complete!"
          if (log.toLowerCase().includes("deployment complete!")) {
            setShowConfetti(true);
            setLoading(false);
            setStatus("Deployed"); // Update status to "deployed"
          } else {
            console.log(false);
          }

          if (log.toLowerCase().includes("error")) {
            setLoading(false);
            setStatus("Failed");
          } else {
            console.log(false);
          }
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [responseData]);

  // Automatically scroll to the bottom of the logs when new logs are added
  useEffect(() => {
    if (logs.length > 0) {
      const logContainer = document.getElementById("log-container");
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      gitURL,
      selectedFramework,
      rootDirectory,
      buildCommand,
      startCommand,
      envVariables,
    };

    try {
      const response = await fetch("https://weblift-api-server.onrender.com/api/v2/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResponseData(data);
      setIsFormVisible(false); // Hide the form
      setError(null);
      setStatus(""); // Reset status when a new deployment starts
    } catch (error) {
      setResponseData(null);
      console.error("Error deploying project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-black font-jost text-white">

      <div className="w-full min-h-screen max-w-5xl">
      <Banner/>

      <Navbar/>

        {responseData && (
          <div className="mt-48 border border-gray-500 bg-zinc-900  p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              🚀 Deployment status...
            </h2>
            <p className="text-md my-1">
              Status :{" "}
              <a
                className={
                  status == "Deployment Complete!"
                    ? "text-green-500"
                    : "text-amber-300"
                }
              >
                {status || responseData.status}
              </a>
            </p>

            <p className="text-md my-1">
              Project name : {responseData.data.projectSlug}
            </p>
            <p className="text-md my-1">
              Project URL : {projectIp || "IP address yet to be assigned"}
            </p>

            <button
              className="rounded-lg bg-blue-500 my-2 p-2 text-xs font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              onClick={handleRefreshStatus}
              disabled={isDisabled}
            >
              Refresh status
            </button>
          </div>
        )}
        <div id="deployForm" className={`${isFormVisible ? 'block' : 'hidden'}`}        >
        <h1 className="text-3xl  font-bold my-6 text-center">Deploy Project</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 max-w-5xl mx-auto p-6 border mb-6 border-zinc-700 rounded-lg shadow-lg"
        >
          <h2 htmlFor="gitURL" className="block text-md mb-2">
            GitHub URL
          </h2>
          <input
            type="text"
            id="gitURL"
            name="gitURL"
            value={gitURL}
            onChange={(e) => setGitURL(e.target.value)}
            className="w-full p-2 mb-4 bg-zinc-900 text-white placeholder-white rounded border border-zinc-600 focus:outline-none focus:ring focus:ring-indigo-700"
            placeholder=""
            required
          />

          {/* Framework Selection */}
          <h2 className="text-md mb-4">Select a framework</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            {frameworks.map((framework) => (
              <label
                key={framework.name}
                className={`flex max-w-xs h-12 items-center p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedFramework === framework.name
                    ? "bg-zinc-600 border border-indigo-600"
                    : "bg-zinc-900 border-2 border-zinc-600 hover:bg-zinc-600"
                }`}
              >
                <input
                  type="radio"
                  name="framework"
                  value={framework.name}
                  checked={selectedFramework === framework.name}
                  onChange={() => setSelectedFramework(framework.name)}
                  className="sr-only"
                  aria-labelledby={`${framework.name}-label`}
                />
                <img
                  src={framework.logo}
                  alt=""
                  className="w-6 h-6 mr-4"
                  aria-hidden="true"
                />
                <span id={`${framework.name}-label`} className="text-sm">
                  {framework.name}
                </span>
              </label>
            ))}
          </div>

          {/* Root Directory */}
          <div>
            <h2 htmlFor="rootDirectory" className="block text-md mb-2">
              Root Directory
            </h2>
            <input
              type="text"
              id="rootDirectory"
              name="rootDirectory"
              value={rootDirectory}
              onChange={(e) => setRootDirectory(e.target.value)}
              className="w-full p-2 mb-4 bg-zinc-900 text-white placeholder-white rounded border border-zinc-600 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder=""
            />
          </div>

          {/* Build Command */}
          <div>
            <h2 htmlFor="buildCommand" className="block text-md mb-2">
              Build Command
            </h2>
            <input
              type="text"
              id="buildCommand"
              name="buildCommand"
              value={buildCommand}
              onChange={(e) => setBuildCommand(e.target.value)}
              className="w-full p-2 mb-4 bg-zinc-900 text-white placeholder-white rounded border border-zinc-600 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder=""
              required
            />
          </div>

          {/* Start Command */}
          <div>
            <h2 htmlFor="startCommand" className="block text-md mb-2">
              Start Command
            </h2>
            <input
              type="text"
              id="startCommand"
              name="startCommand"
              value={startCommand}
              onChange={(e) => setStartCommand(e.target.value)}
              className="w-full p-2 mb-4 bg-zinc-900 text-white placeholder-white rounded border border-zinc-600 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder=""
              required
            />
          </div>

          {/* Environment Variables */}
          <div>
            <h2 htmlFor="envVariables" className="block text-md mb-2">
              Environment Variables
            </h2>
            <textarea
              id="envVariables"
              name="envVariables"
              value={envVariables}
              onChange={(e) => setEnvVariables(e.target.value)}
              className="w-full p-2 mb-4 bg-zinc-900 text-white placeholder-white rounded border border-zinc-600 focus:outline-none focus:ring focus:ring-indigo-600"
              placeholder="Enter variables in KEY=VALUE format, one per line"
              rows="5"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-lg bg-indigo-600 hover:bg-indigo-700 text-neutral-100 font-bold py-2 px-4 rounded-xl focus:outline-none focus:ring focus:ring-gray-600 ${
                loading ? "cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Deploying...
                </div>
              ) : (
                "Deploy"
              )}
            </button>
          </div>
        </form>
        </div>

        {/* {responseData && (
          // <div className="mt-5 mb-12 bg-zinc-900 p-4 rounded-lg">
          //   <h2 className="text-xl font-semibold mb-2">📜 Logs</h2>
          //   <div
          //     className="mt-2 bg-black p-4 rounded-lg"
          //     style={{ height: "200px", overflowY: "auto" }}
          //     id="log-container"
          //   >
          //     <ul>
          //       {waitingForLogs && logs.length === 0 && (
          //         <li className="text-sm text-zinc-300">Waiting for logs...</li>
          //       )}
          //       {logs.map((log, index) => (
          //         <li key={index} className={`text-sm ${getLogClassName(log)}`}>
          //           {log}
          //         </li>
          //       ))}
          //     </ul>
          //   </div>
          // </div>
        )} */}

        {error && (
          <div className="mt-6 bg-red-500 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {/* Show Confetti when showConfetti is true */}
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false} // Confetti appears once
          />
        )}
      </div>
    </div>
  );
}

export default Deploy;

import axios from "axios";

// 1. YOUR MAIN BACKEND (Java/Node) - Port 8080
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. YOUR NEW .NET LOGGER -
const LoggerAPI = axios.create({
  baseURL: "http://localhost:5199/api", 
});

// Helper function to send logs
export const logActivity = async (level, message, source, data = null) => {
  try {
    // We don't await this strictly, so it doesn't slow down the app if logger fails
    LoggerAPI.post("/logs", {
      Level: level,
      Message: message,
      Source: source,
      Data: data ? JSON.stringify(data) : null
    });
  } catch (error) {
    // Fail silently so the user doesn't know logging failed
    console.error("Logger Service Failed:", error); 
  }
};

// ... Existing Interceptors (Keep these exactly as they were) ...
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
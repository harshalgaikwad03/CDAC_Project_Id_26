import axios from "axios";

// 1. MAIN BACKEND (Spring Boot) - 8080
const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. LOGGER SERVICE (.NET) - 5199
const LoggerAPI = axios.create({
  baseURL: "http://localhost:5199/api",
});

// 🔹 Helper function to send logs (NON-BLOCKING)
export const logActivity = async (level, message, source, data = null) => {
  try {
    await LoggerAPI.post("/logs", {
      Level: level,
      Message: message,
      Source: source,
      Data: data ? JSON.stringify(data) : null,
    });
  } catch {
    // 🔴 MUST NEVER BLOCK MAIN APP
    console.warn("Logger Service Failed (ignored)");
  }
};

// 🔹 Request Interceptor (JWT)
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

// 🔹 Response Interceptor (DO NOT MODIFY STATUS CODES)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔐 Auto logout only on AUTH failure
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return; // stop execution
    }

    // 🛡 Ensure error object is always usable by UI
    if (!error.response) {
      error.response = {
        status: 0,
        data: {
          message: "Network error. Please check your connection.",
        },
      };
    }

    // 🔴 IMPORTANT: never swallow backend error
    return Promise.reject(error);
  }
);

export default API;

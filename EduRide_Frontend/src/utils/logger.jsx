export const logEvent = async (
  level,
  message,
  data = "",
  source = "ReactApp"
) => {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        level: level,
        message: message,
        data: JSON.stringify(data),
        source: source
      })
    });
  } catch (error) {
    // fallback only, do not break UI
    console.error("Logger failed:", error);
  }
};

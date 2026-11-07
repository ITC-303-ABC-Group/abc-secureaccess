export const initial = (name = "") => name.trim().charAt(0).toUpperCase() || "U";

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export const formatDateTime = (iso) => `${formatDate(iso)}, ${formatTime(iso)}`;

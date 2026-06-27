export const getRelativeTime = (isoString: string, currentTime: number) => {
  const diffMs = currentTime - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  return `${diffMins} min ago`;
};

export const getRelativeStartedTime = (isoString: string, currentTime: number) => {
  const diffMs = currentTime - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "started just now";
  return `started ${diffMins} minutes ago`;
};

export const formatDateOfBirth = (dobString?: string) => {
  if (!dobString) return "—";
  if (dobString.includes("/")) return dobString;
  const parts = dobString.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day} / ${month} / ${year}`;
  }
  return dobString;
};

export const formatAddress = (address?: string[] | string) => {
  if (!address) return "—";
  if (Array.isArray(address)) return address[0] || "—";
  return address || "—";
};

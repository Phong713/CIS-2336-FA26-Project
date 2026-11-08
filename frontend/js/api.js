// All three pages use these functions to reach the same Express API.
async function requestJson(path, options = {}) {
  let response;
  try {
    response = await fetch(path, { cache: "no-store", ...options });
  } catch {
    throw new Error("Could not reach the room booking service. Please try again.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || data === null) {
    const error = new Error(data?.error || "The booking service could not complete the request.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function getRooms() {
  return requestJson("/api/rooms");
}

function getRoomById(id) {
  return requestJson("/api/rooms/" + encodeURIComponent(id));
}

function getBookings() {
  return requestJson("/api/bookings");
}

function createBooking(bookingData) {
  return requestJson("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
}

function deleteBooking(id) {
  return requestJson("/api/bookings/" + encodeURIComponent(id), { method: "DELETE" });
}

const container = document.getElementById("bookings-list");
const statusEl = document.getElementById("bookings-status");

function formatBookingTime(booking) {
  try {
    const dateFormat = new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
    });
    const timeFormat = new Intl.DateTimeFormat("en-US", {
      hour: "numeric", minute: "2-digit", timeZone: "UTC",
    });
    const start = new Date(booking.date + "T" + booking.startTime + ":00Z");
    const end = new Date(booking.date + "T" + booking.endTime + ":00Z");
    return dateFormat.format(start) + " · " + timeFormat.format(start) + " – " + timeFormat.format(end);
  } catch {
    return booking.date + " · " + booking.startTime + " – " + booking.endTime;
  }
}

function makeBookingItem(booking, roomName) {
  const item = document.getElementById("booking-template").content.firstElementChild.cloneNode(true);
  item.querySelector(".booking-room").textContent = roomName;
  item.querySelector(".booking-club").textContent = "Club: " + booking.clubName;

  item.querySelector(".booking-when").textContent = formatBookingTime(booking);

  const purpose = item.querySelector(".booking-purpose");
  if (booking.purpose) {
    purpose.textContent = "Purpose: " + booking.purpose;
  } else {
    purpose.hidden = true;
  }

  const button = item.querySelector(".cancel-button");
  button.dataset.id = booking.id;
  button.setAttribute("aria-label", "Cancel " + booking.clubName + " booking for " + roomName);
  button.addEventListener("click", () => handleCancelClick(booking.id));
  return item;
}

async function renderBookings() {
  try {
    const [bookings, rooms] = await Promise.all([getBookings(), getRooms()]);
    if (bookings.length === 0) {
      const empty = document.getElementById("empty-template").content.cloneNode(true);
      container.replaceChildren(empty);
      return;
    }
    const roomNames = new Map(rooms.map((room) => [room.id, room.name]));
    bookings.sort((a, b) =>
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    );
    const items = bookings.map((booking) =>
      makeBookingItem(booking, roomNames.get(booking.roomId) || booking.roomId)
    );
    container.replaceChildren(...items);
  } catch (error) {
    const message = document.createElement("p");
    message.className = "error";
    message.setAttribute("role", "alert");
    message.textContent = error.message;
    container.replaceChildren(message);
  }
}

async function handleCancelClick(bookingId) {
  const buttons = container.querySelectorAll(".cancel-button");
  for (const button of buttons) button.disabled = true;

  try {
    await deleteBooking(bookingId);
    statusEl.textContent = "Booking canceled.";
    statusEl.className = "status-message success";
    await renderBookings();
  } catch (error) {
    statusEl.textContent = error.message;
    statusEl.className = "status-message error";
    if (error.status === 404) await renderBookings();
  } finally {
    for (const button of buttons) button.disabled = false;
  }
}

// This script is deferred, so the page is ready before the first render.
renderBookings();
window.addEventListener("pageshow", (event) => {
  if (event.persisted) renderBookings();
});

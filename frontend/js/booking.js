const form = document.getElementById("booking-form");
const roomSelect = form.elements.roomId;
const submitButton = form.querySelector("button[type=submit]");
const statusEl = document.getElementById("form-status");
const bookingsLink = document.getElementById("view-bookings");

function showStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = "status-message " + kind;
}

async function populateRoomSelect() {
  try {
    const rooms = await getRooms();
    if (rooms.length === 0) {
      showStatus("There are no rooms to book.", "error");
      return;
    }
    for (const room of rooms) {
      roomSelect.add(new Option(room.name, room.id));
    }

    const requestedRoom = new URLSearchParams(window.location.search).get("roomId");
    if (rooms.some((room) => room.id === requestedRoom)) {
      roomSelect.value = requestedRoom;
    }
    roomSelect.disabled = false;
    submitButton.disabled = false;
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  if (submitButton.disabled) return;

  bookingsLink.hidden = true;
  const booking = Object.fromEntries(new FormData(form));
  booking.clubName = booking.clubName.trim();
  booking.purpose = booking.purpose.trim();

  if (!booking.clubName) {
    showStatus("Enter your club name.", "error");
    form.elements.clubName.focus();
    return;
  }
  if (booking.endTime <= booking.startTime) {
    showStatus("End time must be after the start time.", "error");
    form.elements.endTime.focus();
    return;
  }

  const roomName = roomSelect.selectedOptions[0].textContent;
  submitButton.disabled = true;
  showStatus("Saving your booking…", "");
  try {
    await createBooking(booking);
    form.reset();
    showStatus("Booking confirmed for " + roomName + ".", "success");
    bookingsLink.hidden = false;
  } catch (error) {
    showStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

form.addEventListener("input", () => {
  if (!submitButton.disabled) {
    showStatus("", "");
    bookingsLink.hidden = true;
  }
});
form.addEventListener("submit", handleBookingSubmit);
document.addEventListener("DOMContentLoaded", populateRoomSelect);

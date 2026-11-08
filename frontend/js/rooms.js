function makeRoomCard(room) {
  const card = document.getElementById("room-template").content.firstElementChild.cloneNode(true);
  card.querySelector(".room-name").textContent = room.name;
  card.querySelector(".room-capacity").textContent = "Capacity: " + room.capacity + " people";
  card.querySelector(".equipment-list").textContent = room.equipment.join(", ") || "None listed";

  const policy = card.querySelector(".food-policy");
  policy.textContent = room.foodAllowed ? "Food allowed" : "No food";
  policy.classList.toggle("food-yes", room.foodAllowed);

  const link = card.querySelector(".book-room");
  link.href = "booking.html?roomId=" + encodeURIComponent(room.id);
  link.setAttribute("aria-label", "Book room — " + room.name);
  return card;
}

async function renderRooms() {
  const list = document.getElementById("room-list");
  try {
    const rooms = await getRooms();
    if (rooms.length === 0) {
      list.textContent = "No rooms are listed.";
      return;
    }
    list.replaceChildren(...rooms.map(makeRoomCard));
  } catch (error) {
    list.textContent = error.message;
    list.classList.add("error");
  }
}

document.addEventListener("DOMContentLoaded", renderRooms);

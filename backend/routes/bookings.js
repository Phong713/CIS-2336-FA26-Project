const express = require("express");
const { readData, writeData } = require("../utils/jsonStore");

const router = express.Router();
const clockTime = /^([01]\d|2[0-3]):[0-5]\d$/;

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

router.get("/", (req, res) => {
  res.json(readData("bookings.json"));
});

router.post("/", (req, res) => {
  const body = req.body || {};
  const required = ["roomId", "clubName", "date", "startTime", "endTime"];
  if (required.some((field) => typeof body[field] !== "string" || !body[field].trim())) {
    return res.status(400).json({ error: "Enter a room, club name, date, start time and end time." });
  }
  if (body.purpose !== undefined && typeof body.purpose !== "string") {
    return res.status(400).json({ error: "Enter the purpose as text." });
  }

  const roomId = body.roomId.trim();
  const clubName = body.clubName.trim();
  const { date, startTime, endTime } = body;
  const purpose = (body.purpose || "").trim();

  if (!isCalendarDate(date)) {
    return res.status(400).json({ error: "Enter a valid calendar date in YYYY-MM-DD format." });
  }
  if (!clockTime.test(startTime) || !clockTime.test(endTime) || endTime <= startTime) {
    return res.status(400).json({ error: "Enter valid times with the end time after the start time." });
  }

  const rooms = readData("rooms.json");
  if (!rooms.some((room) => room.id === roomId)) {
    return res.status(400).json({ error: "Choose a room from the room list." });
  }

  const bookings = readData("bookings.json");
  const overlaps = bookings.some((booking) =>
    booking.roomId === roomId && booking.date === date &&
    startTime < booking.endTime && endTime > booking.startTime
  );
  if (overlaps) {
    return res.status(409).json({ error: "This room is already booked during that time. Choose another room or time." });
  }

  let timestamp = Date.now();
  while (bookings.some((booking) => booking.id === String(timestamp))) timestamp += 1;

  const booking = { id: String(timestamp), roomId, clubName, date, startTime, endTime, purpose };
  bookings.push(booking);
  writeData("bookings.json", bookings);
  res.status(201).json(booking);
});

router.delete("/:id", (req, res) => {
  const bookings = readData("bookings.json");
  const remaining = bookings.filter((booking) => booking.id !== req.params.id);

  if (remaining.length === bookings.length) {
    return res.status(404).json({ error: "Booking not found" });
  }
  writeData("bookings.json", remaining);
  res.json({ message: "Booking canceled" });
});

module.exports = router;

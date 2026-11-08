const express = require("express");
const { readData } = require("../utils/jsonStore");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(readData("rooms.json"));
});

router.get("/:id", (req, res) => {
  const rooms = readData("rooms.json");
  const room = rooms.find((item) => item.id === req.params.id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json(room);
});

module.exports = router;

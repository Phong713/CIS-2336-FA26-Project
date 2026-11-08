const express = require("express");
const path = require("path");
const roomsRouter = require("./routes/rooms");
const bookingsRouter = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/api", express.json());
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

app.use("/api", (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Send a valid JSON object." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "This request is too large." });
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: "The request could not be read." });
  }
  console.error(err);
  res.status(500).json({ error: "The room booking service could not access its data. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

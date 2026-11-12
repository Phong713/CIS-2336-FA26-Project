# UH Student Center Room Booking App

This CIS 2336 project lets student clubs reserve meeting rooms at the UH Student Center. The home page shows how many people each room holds, what equipment it has, and whether food is allowed.

## Run it locally

Use Node.js 18 or newer. Open a terminal in the folder that contains `package.json` and run these commands.

```bash
npm install
npm start
```

Once the server starts, open [http://localhost:3000](http://localhost:3000) in your browser.

## Try a booking

1. On **Home**, choose a room and click **Book room**.
2. Enter a club name, date, start time, and end time. Use Houston local time. The **Purpose** field is optional.
3. Submit the form, then open **My Bookings**. Refresh the page to see that the booking was saved. Click **Cancel** to remove it.

The app rejects overlapping bookings for the same room and date. You can book one meeting from 2 to 3 PM and another from 3 to 4 PM in the same room.

## How it works

The pages in `frontend/` use HTML, CSS, and JavaScript. They call the Express server through `frontend/js/api.js`. The room list comes from `backend/data/rooms.json`, and reservations are saved in `backend/data/bookings.json` so they stay after a server restart.

| Method | Route | What it does |
| --- | --- | --- |
| GET | `/api/rooms` | List the rooms |
| GET | `/api/rooms/:id` | Look up one room |
| GET | `/api/bookings` | List the reservations |
| POST | `/api/bookings` | Make a reservation |
| DELETE | `/api/bookings/:id` | Cancel a reservation |

A `POST /api/bookings` request takes `roomId`, `clubName`, `date`, `startTime`, `endTime`, and an optional `purpose` in its JSON body.

# CSE264 Final Project: Full Stack
## 
## Dylan Serino | dts226
## Maaz Tanveer | mat927 

## EventBoard Project Overview: A Campus Event Management And RSVP Platform

Full-stack web application that lets students explore and RSVP to campus events. It provides students with an organized hub for all upcoming campus events, letting them track their events and administrators are able to create, update and manage these events. This platform also integrates real-tme weather forecasts and interactive map displays to help with event planning and enhance the user experience. 


## Team Members and Roles

Dylan Serino: Frontend Developer / UI
React UI development, event card system,animations, styling, UX flow, and page navigation

Maaz Tanveer: Backend Developer / Database
Express.js routes, CRUD API, PostgreSQL database design and hosting, internal REST API, API integration

## Project Requirements and Features

1. User Accounts
    Student Users: View events, RSVP, access "My RSVPs"
    Admin Users: "Create, edit, delete events through admin dashboard
2. Relational Database
    PostgreSQL stores:
    Events, users and RSVPs
3. Interactive UI (Frontend):
    Dynamic React Interface including:
    Responsive event cards styled with neon/dark theme
    Filters: search, category and date
    Event Detail Page with interactive Google map, real-time weather forecast, and RSVP button
    Framer Motion animations for smooth transitions for event cards
    Student RSVP page showing all saved events
    Admin Dashboard with editable rows and management buttons
4. New Library / Framework: Framer Motion for event card effects and animations
5. Internal REST API (Express.js):
    GET /events – fetch all events
    POST /events – create event (admin only)
    PUT /events/:id – update event
    DELETE /events/:id – delete event
    POST /login – simple login system
    POST /rsvps – submit an RSVP
    GET /users/:id/rsvps – fetch user RSVPs
6. External REST API integration
    Google Maps API for event location and interactive map
    OpenWeather API for weather forecast

## How to Run
1. Clone git repo 
2. Install dependencies for client (npm install) then run (npm run dev)
3. Install server dependencies (npm install) then run (npm run dev)

## API Keys and Database setup

Important Keys you NEED in the server ENV along with DB_HOST, DB_PORT, and DB_DATABASE:
POSTGRES_USERNAME=eventboard
POSTGRES_PASSWORD=eventboard_lehigh
Important Line (and the only one) you NEED in a new client ENV:
VITE_OPENWEATHER_API_KEY=fa8382175a246cd46d81655de6f5ffd4



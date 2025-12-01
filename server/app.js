import express from 'express'
import cors from 'cors'
import 'dotenv/config'


import { query } from './db/postgres.js';

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 3000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors())

// base route
app.get('/', (req, res) => {
    res.send("Welcome to the EventBoard API!") 
})


app.get('/up', (req, res) => {
  res.json({status: 'up'})
})

// get all events
app.get('/api/events', async (req, res) => {
  try {
    const qs = `
      select id, title, description, category, start_time, end_time, location_text
      from events_eventboard
      order by start_time asc
    `;
    const result = await query(qs);

    // map db column names 
    const events = result.rows.map((row) => ({
      id: row.id, // we can convert to string later in the frontend if needed
      title: row.title,
      description: row.description,
      category: row.category,
      start: row.start_time, // still a timestamp, frontend will format
      end: row.end_time,
      locationText: row.location_text,
    }));

    res.json(events); // 200 status by default
  } catch (err) {
    console.error('error fetching events', err);
    res.status(500).json({ error: 'internal server error' }); //500 status
  }
});

// get a single event by id 
app.get('/api/events/:id', async (req, res) => {
  // get the id value 
  const { id } = req.params;

  try {
    // select one event where id matches the placeholder id
    const qs = `
      select id, title, description, category, start_time, end_time, location_text
      from events_eventboard
      where id = $1
    `;

    // run the query 
    const result = await query(qs, [id]);

    // if no rows came back id does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'event not found' }); // 404 error
    }

    // get the row
    const row = result.rows[0];

    // convert the db row into the event object shape for the frontend
    const event = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      start: row.start_time,
      end: row.end_time,
      locationText: row.location_text,
    };

    // send the event back as json
    res.json(event);
  } catch (err) {
    console.error('error fetching event by id', err);

    // send back a 500 error 
    res.status(500).json({ error: 'internal server error' });
  }
});

// create a new event
app.post('/api/events', async (req, res) => {
  // get data from the request body
  const { title, description, category, start, end, locationText } = req.body;

  // make sure data exists
  if (!title || !category || !start || !end || !locationText) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    // sql insert with parameter placeholders
    const qs = `
      insert into events_eventboard (title, description, category, start_time, end_time, location_text)
      values ($1, $2, $3, $4, $5, $6)
      returning id, title, description, category, start_time, end_time, location_text
    `;

    //must match order of placeholders above
    const values = [title, description || null, category, start, end, locationText];

    // run the insert and get the newly created row back
    const result = await query(qs, values);
    const row = result.rows[0];

    // make the response object for the frontend
    const newEvent = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      start: row.start_time,
      end: row.end_time,
      locationText: row.location_text,
    };

    // 201 = "created"
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('error creating event', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// update an existing event
app.put('/api/events/:id', async (req, res) => {
  // event id from the url
  const { id } = req.params;

  // data from the body
  const { title, description, category, start, end, locationText } = req.body;

  // simple check again
  if (!title || !category || !start || !end || !locationText) {
    return res.status(400).json({ error: 'missing required fields' });
  }

  try {
    // sql update with returning so we can send the updated row back
    const qs = `
      update events_eventboard
      set
        title = $1,
        description = $2,
        category = $3,
        start_time = $4,
        end_time = $5,
        location_text = $6
      where id = $7
      returning id, title, description, category, start_time, end_time, location_text
    `;

    const values = [title, description || null, category, start, end, locationText, id];

    const result = await query(qs, values);

    // if no rows id does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'event not found' });
    }

    const row = result.rows[0];

    const updatedEvent = {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      start: row.start_time,
      end: row.end_time,
      locationText: row.location_text,
    };

    res.json(updatedEvent);
  } catch (err) {
    console.error('error updating event', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// delete an event
app.delete('/api/events/:id', async (req, res) => {
  // id from the url
  const { id } = req.params;

  try { 
    // delete and return the id to confirm something was deleted
    const qs = `
      delete from events_eventboard
      where id = $1
      returning id
    `;

    const result = await query(qs, [id]);

    // no rows means nothing to delete so 404
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'event not found' });
    }

    // if we get here, the delete worked
    res.send();
  } catch (err) {
    console.error('error deleting event', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// create an rsvp
app.post('/api/rsvps', async (req, res) => {
  // get user id and event id from request body
  const { userId, eventId } = req.body;

  // basic check
  if (!userId || !eventId) {
    return res.status(400).json({ error: 'missing userId or eventId' });
  }

  try {
    // insert a new rsvp, unique in db prevents duplicates
    const qs = `
      insert into rsvps_eventboard (user_id, event_id)
      values ($1, $2)
      returning id, user_id, event_id, created_at
    `;

    const result = await query(qs, [userId, eventId]);
    const row = result.rows[0];

    // send back the new rsvp
    const newRsvp = {
      id: row.id,
      userId: row.user_id,
      eventId: row.event_id,
      createdAt: row.created_at,
    };

    res.status(201).json(newRsvp);
  } catch (err) {
    console.error('error creating rsvp', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// get all rsvps for a specific user
app.get('/api/rsvps/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // join to events so frontend gets all event data in one call
    const qs = `
      select 
        e.id, 
        e.title, 
        e.description, 
        e.category, 
        e.start_time, 
        e.end_time, 
        e.location_text
      from rsvps_eventboard r
      join events_eventboard e on r.event_id = e.id
      where r.user_id = $1
      order by e.start_time asc
    `;

    const result = await query(qs, [userId]);

    // convert rows 
    const events = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      start: row.start_time,
      end: row.end_time,
      locationText: row.location_text
    }));

    res.json(events);
  } catch (err) {
    console.error('error fetching rsvps', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// delete an rsvp 
app.delete('/api/rsvps/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const qs = `
      delete from rsvps_eventboard
      where user_id = $1 and event_id = $2
      returning id
    `;

    const result = await query(qs, [userId, eventId]);

    // if 0 rows nothing to delete
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'rsvp not found' });
    }

    res.send();
  } catch (err) {
    console.error('error deleting rsvp', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// get all users 
app.get('/api/users', async (req, res) => {
  try {
    const qs = `
      select id, name, email, role
      from users_eventboard
      order by id asc
    `;

    const result = await query(qs);

    // db row into user object here
    const users = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role, // "Admin" or "Student"
    }));

    res.json(users); // default 200
  } catch (err) {
    console.error('error fetching users', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// simple login using email only
app.post('/api/login', async (req, res) => {
  // get email from the request body
  const { email } = req.body;

  // basic validation
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    // look up the user by email
    const qs = `
      select id, name, email, role
      from users_eventboard
      where email = $1
    `;

    const result = await query(qs, [email]);

    // if no user found
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'invalid email' });
    }

    const row = result.rows[0];

    // to send back to the frontend
    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role, // "Admin" or "Student"
    };

    res.json({ user });
  } catch (err) {
    console.error('error during login', err);
    res.status(500).json({ error: 'internal server error' });
  }
});

app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  
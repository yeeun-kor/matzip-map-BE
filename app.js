import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

app.get('/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/places.json');

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get('/users/places', async (req, res) => {
  const fileContent = await fs.readFile('./data/user-places.json');

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.post('/users/places', async (req, res) => {
  const newPlace = req.body.place;

  const fileContent = await fs.readFile('./data/user-places.json');
  const userPlaces = JSON.parse(fileContent);

  // Add or update place
  const existingIndex = userPlaces.findIndex((place) => place.id === newPlace.id);
  if (existingIndex >= 0) {
    userPlaces[existingIndex] = newPlace; // Update existing place
  } else {
    userPlaces.push(newPlace); // Add new place
  }

  await fs.writeFile('./data/user-places.json', JSON.stringify(userPlaces));

  res.status(200).json({ message: 'User place added/updated!' });
});


app.delete('/users/places/:id', async (req, res) => {
  const placeId = req.params.id;

  const fileContent = await fs.readFile('./data/user-places.json');
  const userPlaces = JSON.parse(fileContent);

  // Remove place by ID
  const updatedPlaces = userPlaces.filter((place) => place.id !== placeId);

  await fs.writeFile('./data/user-places.json', JSON.stringify(updatedPlaces));

  res.status(204).send();
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);

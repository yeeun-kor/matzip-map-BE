import fs from 'node:fs/promises';
import path from 'node:path';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/places', async (req, res) => {
  const filePath = path.resolve(new URL(import.meta.url).pathname, '..', 'data', 'places.json');
  const fileContent = await fs.readFile(filePath);

  const placesData = JSON.parse(fileContent);

  res.status(200).json({ places: placesData });
});

app.get('/user-places', async (req, res) => {
  const filePath = path.resolve(new URL(import.meta.url).pathname, '..', 'data', 'user-places.json');
  const fileContent = await fs.readFile(filePath);

  const places = JSON.parse(fileContent);

  res.status(200).json({ places });
});

app.put('/user-places', async (req, res) => {
  const places = req.body.places;
  const filePath = path.resolve(new URL(import.meta.url).pathname, '..', 'data', 'user-places.json');
  await fs.writeFile(filePath, JSON.stringify(places));

  res.status(200).json({ message: 'User places updated!' });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);

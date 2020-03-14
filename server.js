require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const moviesData = require('./movies-data-small.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  // validate bearer token 
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  // move to next middleware
  next();
})


function handleGetMovies(req, res) {
  let results = moviesData;
  const { genre, country, avg_vote } = req.query;
  // filter by genre if genre query parameter is present
  if(genre) {
    // genre should include specified string, make this case insensitive
    results = results.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }
   
  // filter by country if country query parameter is present
  if(country) {
    // country should include specified string, make this case insensitive
    results = results.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  // filter by average vote if avg_vote query parameter is present  
  if(avg_vote) {
    // results should be greater than or equal to supplied number
    results = results.filter(movie => movie.avg_vote >= Number(avg_vote));
  }
  
  res.json(results);
}

app.get('/movie', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
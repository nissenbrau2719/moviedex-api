require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const moviesData = require('./movies-data-small.json');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
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

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }};
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT)
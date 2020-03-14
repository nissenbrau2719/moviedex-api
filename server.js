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
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  // validate bearer token 
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to next middleware
  next()
})

function handleGetMovies(req, res) {
  // filter by genre if genre query parameter is present
    // genre should include specified string, make this case insensitive

  // filter by country if country query parameter is present
    // country should include specified string, make this case insensitive

  // filter by average vote if avg_vote query parameter is present
    // results should be greater than or equal to supplied number
}

app.get('/movie', handleGetMovies)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
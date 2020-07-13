const express = require('express')
const { request, response } = require('express')
const app = express()

app.set('port', process.env.PORT || 3001)
app.locals.title = 'Rancid Tomatillos API'

app.use(express.json())

app.locals.comments = []
app.locals.favorites = [{movieID: 111}, {movieID: 222}, {movieID: 333}]

app.get('/', (request, response) => {
  response.send('Rancid Tomatillos API')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

app.post('/api/v1/comments', (request, response) => {
  const { author, comment, movieID } = request.body
  const commentID = Date.now()

  for (let requiredParameter of ['author', 'comment', 'movieID']) {
    if (!request.body[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { author: <string>, comment: <string>, movieID: <number> }.  You are missing a required parameter of ${requiredParameter}.`})
    }
  }

  app.locals.comments.push({ commentID, author, comment, movieID })
  response.status(201).json({ commentID, author, comment, movieID })
})

app.get('/api/v1/comments', (request, response) => {
  response.status(200).json(app.locals.comments)
})

app.post('/api/v1/favorites', (request, response) => {
  if (!request.body.movieID) {
    return response
      .status (422)
      .send({ error: `You are missing the required parameter of the movie ID.`})
  }

  app.locals.favorites.push(request.body)
  response.status(201).json(request.body)
})

app.get('/api/v1/favorites', (request, response) => {
  response.status(200).json(app.locals.favorites)
})

app.delete('/api/v1/favorites/:movieID', (request, response) => {
  const movieID = Number(request.params.movieID)

  let foundMovie = app.locals.favorites.find(movie => movie.movieID === movieID)

  const index = app.locals.favorites.indexOf(foundMovie)

  app.locals.favorites.splice(index, 1)

  response.json({ message: `Movie with an id number of ${foundMovie.movieID} has been deleted.`})
})

require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :body'))

let persons = [ 
    {  "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    } 
]



app.get('/', (request, response) => {
    response.send("home")
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let num = persons.length
    let requestTime = new Date()

    response.send(`Phonebook has info for ${num} people<br/> ${requestTime}`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next)

})

app.post('/api/persons', (request, response) => {
  const body = request.body
    //const isFound = persons.find(p => p.name === body.name)

    if (body.name === undefined) {
        return response.status(400).json({
          error: 'content missing'
        })
      }
    
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPreson => {
        response.json(savedPreson)
      })

      
    /*
    if (isFound) {
        return response.status(400).json(
            {error: 'name must be unique'}
        )
    }
*/
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  }
  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
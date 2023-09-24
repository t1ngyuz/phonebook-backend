const mongoose = require('mongoose')

const newName = process.argv[3]
const newNumber = process.argv[4]

const url= process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/*
const person = new Person({
    name: `${newName}`,
    number:  `${newNumber}`
})

if (newName) {
    person.save().then(result => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person
    .find({})
    .then(result => {
        console.log("phonebook:")
        result.forEach(person => {
        console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
*/

module.exports = mongoose.model('Person', personSchema)
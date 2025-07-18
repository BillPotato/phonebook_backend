require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Person = require("./models/Person")

const app = express()

morgan.token("body", (request, response) => {
	if (request.method == "POST") {
		// console.log("POST method detected!")
		return JSON.stringify(request.body)
	}
	return " "
})


app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


// _______________________________________


app.get("/info", (request, response, next) => {
	Person.find({})
		.then(people => {
			const message = `Phonebook has info for ${people.length} people`
			const now = new Date()
			const time = now.toLocaleString()

			response.write(`<div>${message}</div>`)
			response.end(`<div>${time}</div>`)
		})
		.catch(error => next(error))
})


app.get("/api/persons", (request, response, next) => {
	Person.find({})
		.then(people => {
			response.json(people)
		})	
		.catch(error => next(error))
})


app.post("/api/persons", (request, response, next) => {
	const newPerson = request.body

	// const exists = persons.filter(person => person.name == newPerson.name).length > 0

	if (!newPerson.name || !newPerson.number) {
		const error = {"error": "missing parameters"}
		response.status(422).json(error)
	}
	// else if (exists) {
	// 	const error = {"error": "name already exists"}
	// 	response.status(409).json(error)
	// }
	else {
		person = new Person(newPerson)	
		person.save().then(savedPerson => {
			response.json(person)
		})
	}
})


app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id
	// console.log(`Searching for id ${id}`)
	Person.findById(id)
		.then(foundPerson => {
			if (foundPerson) {
				response.json(foundPerson)
			}
			else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
	const {name, number} = request.body
	Person.findById(request.params.id)
		.then(person => {
			person.name = name
			person.number = number

			person.save().then(updatedPerson => {
				response.json(updatedPerson)
			})
		})
		.catch(error => next(error))
})


app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id
	Person.findByIdAndDelete(id)
		.then(res => {
			response.status(204).end()
		})
		.catch(error => next(error))
})


// _______________________________________


// handle unknown endpoint
const unknownEndpointHandler = (request, response) => {
	response.status(404).json({error: "Unknown Endpoint"})
}
app.use(unknownEndpointHandler)


// handle errors
const errorHandler = (error, request, response, next) => {
	console.log(error)
	if (error.name == "CastError") {
		return response.status(400).json({error: "Invalid ID"})
	}
	next(error)
}
app.use(errorHandler)


// _______________________________________


const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Phonebook backend running on port ${PORT}`)
})

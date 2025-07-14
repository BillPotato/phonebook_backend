const express = require("express")
const app = express()

const morgan = require("morgan")

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
morgan.token("body", (request, response) => {
	if (request.method == "POST") {
		// console.log("POST method detected!")
		return JSON.stringify(request.body)
	}
	return " "
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


// _______________________________________


app.get("/info", (request, response) => {
	const message = `Phonebook has info for ${persons.length} people`
	const now = new Date()
	const time = now.toLocaleString()

	response.write(`<div>${message}</div>`)
	response.end(`<div>${time}</div>`)
})


app.get("/api/persons", (request, response) => {
	response.json(persons)
})


app.post("/api/persons", (request, response) => {
	const newPerson = {...request.body, "id": Math.floor((Math.random() * 1e9)).toString()}

	const exists = persons.filter(person => person.name == newPerson.name).length > 0

	if (!newPerson.name || !newPerson.number) {
		const error = {"error": "missing parameters"}
		response.status(422).json(error)
	}
	else if (exists) {
		const error = {"error": "name already exists"}
		response.status(409).json(error)
	}
	else {
		persons = persons.concat(newPerson)
		response.json(newPerson)
	}
})


app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id
	const person = persons.find(person => person.id == id)

	if (person) {
		response.json(person)
	}
	else {
		response.status(404).end()
	}
})


app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id
	persons = persons.filter(person => person.id != id)

	response.status(204).end()
})


// _______________________________________


const PORT = 3001
app.listen(PORT)
console.log("Phonebook backend running!")
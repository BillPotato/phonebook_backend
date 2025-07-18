const mongoose = require("mongoose")

let [password, name, number] = [null, null, null]

if (process.argv.length == 3) {
	password = process.argv[2]
}
else if (process.argv.length == 5) {
	[password, name, number] = process.argv.slice(2)
}
else {
	console.log("enter password (+ name + number) as arguments")
	process.exit(1)
}

const url = `mongodb+srv://fullstack:${password}@fullstack.ee04jaw.mongodb.net/?retryWrites=true&w=majority&appName=fullstack`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

// handle request based on argv length
if (password && name && number) {
	const person = new Person({
		name,
		number,
	})

	person.save().then(newPerson => {
		console.log(`${newPerson.name} was added`)
		mongoose.connection.close()
	})
}
else if (password) {
	Person.find({}).then(foundPeople => {
		foundPeople.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}
const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)
mongoose.connect(url)
	.then(res => {
		console.log("MONGODB connection success")
	})
	.catch(err => {
		console.log("MONGODB connection failed")
	})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})
personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = document._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person
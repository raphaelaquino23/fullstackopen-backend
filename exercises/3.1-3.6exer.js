const { application } = require('express');
const express = require('express');
const app = express();

app.use(express.json());

let persons = [
  { 
    "id": 1,
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

app.get("/", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${Math.max(
      ...persons.map((n) => n.id)
    )} people!</p>
    <p>The date right now is ${new Date()}</p>`
  );
});

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => {return person.id === id})
  person ? response.json(person) : response.status(404).end();
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('id to be deleted is ', id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end();
})

const generateID = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + Math.floor(Math.random() * 20) + 1
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name){
    response.status(400).json({ error: "body is missing" })
  }

  if(!body.number){
    response.status(400).json({ error: "number is missing" })
  }
  
  if(persons.find(person => person.name === body.name)){
    response.status(400).json({ error: "name must be unique" })
  }

  const person = {
    name: body.name, 
    number: body.number,
    id: generateID(),
  }

  persons = persons.concat(person);
  
  response.json(person);
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
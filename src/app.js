const express = require('express');

const validateTeam = require('./middlewares/validateTeam');

const existingId = require('./middlewares/existingId');

const teams = [
  {
    id: 1,
    name: 'São Paulo Futebol Clube',
    initials: 'SPF',
  },
  {
    id: 2,
    name: 'Clube Atlético Mineiro',
    initials: 'CAM',
  },
];

let nextID = 3;

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ message: 'Olá mundo!' }));

app.get('/teams', (req, res) => res.status(200).json({ teams }));

app.post('/teams', validateTeam, (req, res) => {
  const newTeam = { id: nextID, ...req.body };
  teams.push(newTeam);
  nextID += 1;

  res.status(201).json({ team: newTeam });
});

app.put('/teams/:id', existingId, validateTeam, (req, res) => {
  const { id } = req.params;

  const updateTeam = teams.find((team) => team.id === Number(id));

  const index = teams.indexOf(updateTeam);
  const update = { id, ...req.body };
  teams.splice(index, update);
  res.status(201).json(update);
});

app.get('/teams/:id', existingId, (req, res) => {
  const team = teams.find(({ id }) => id === Number(req.params.id));
  res.status(200).json(team);
});

app.delete('/teams/:id', (req, res) => {
  const { id } = req.params;
  const arrayPosition = teams.findIndex((team) => team.id === Number(id));
  teams.splice(arrayPosition, 1);
  
  res.status(200).end();
});

module.exports = app;
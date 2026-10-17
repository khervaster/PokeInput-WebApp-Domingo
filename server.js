 require('dotenv').config();
 const express= require('express');
 const mongoose = require('mongoose');
 const cors = require('cors');

 const app = express();
 app.use(express.json());
 app.use(cors());

 app.use(cors({
  origin: 'http://localhost:4200'
}));

 mongoose.connect(process.env.MONGODB_URI);

// cons mongoose = require('mongoose.connect(process.env.MONGODB_URI);')

app.listen(5000, () => {
    console.log('Server is running on port 5000')
}) 

const Pokemon = mongoose.model('Pokemon', {
    name: String,
    type: String,
    level: Number,
    nature: String
    
});

app.post('/api/pokemon', async (req, res) => {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).send(pokemon);
})

app.get('/api/pokemon', async (req, res) => {
    const list = await Pokemon.find();
    res.send(list);
})

// DELETE endpoint
app.delete('/api/pokemon/:id', async (req, res) => {
  try {
    await Pokemon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pokemon deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT endpoint (Update)
app.put('/api/pokemon/:id', async (req, res) => {
  try {
    const updated = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API is runnning on port 5000 -> http://localhost:5000
require('dotenv').config();

const express = require('express');
const pool = require('./db');


const app = express(); //isntancia - app es mi servidor
app.use(express.json());

app.get('/', (req, res) =>{
    res.json({message: 'Retell webhook running'});
});



pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB Error:', err);
  else console.log('DB connected at:', res.rows[0].now);
});

const PORT = process.env.PORT || 3000; //3000 fallback

app.listen(PORT, () =>{ //Arranca el servidor
    console.log(`Server running on port ${PORT}`);
});
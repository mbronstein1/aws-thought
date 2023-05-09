const express = require('express');
const PORT = process.env.PORT || 3001;
const userRoutes = require('./routes/user-routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/api', userRoutes);

app.listen(PORT, () => console.log(`API Server now listening on PORT ${PORT}`));
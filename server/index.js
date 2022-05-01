const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

dotenv.config();

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/classroom', require('./routes/api/classroom'));
app.use('/api/classroom', require('./routes/api/lesson'));
app.use('/api/classroom', require('./routes/api/quiz'));
app.use('/api/classroom', require('./routes/api/quiz.game'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const { Router } = require('express');
const user = require('./routes/user.router');
const auth = require('./routes/auth.router');
const profile = require('./routes/profile.router');
const classroom = require('./routes/classroom.router');
const lesson = require('./routes/lesson.router');
const quiz = require('./routes/quiz.router');
const quizgame = require('./routes/quizgame.router');
const dashboard = require('./routes/dashboard.router');

const routes = Router();

routes.use('/api/user', user);
routes.use('/api/auth', auth);
routes.use('/api/profile', profile);
routes.use('/api/classroom', classroom);
routes.use('/api/classroom', lesson);
routes.use('/api/classroom', quiz);
routes.use('/api/classroom', quizgame);
routes.use('/api/classroom', dashboard);

module.exports = routes;



const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const { requireAuth, checkUser } = require('./middlewares/authMiddlewares');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(authRoutes);
app.use(companyRoutes);

const PORT = 8830;
const dbURI = "mongodb+srv://isa:77ruIwO0WFRsdQ7J@cluster0.fhtwa.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((result) => {
    console.log('DB is connected...')
})
.catch((err) => {
    console.log(err);
})

app.listen(PORT, () => {
    console.log(`Server starts on ${PORT}...`);
});

app.get('*', checkUser);

app.get('/test', requireAuth, (req, res) => {
    res.send({message: "next page"})
})
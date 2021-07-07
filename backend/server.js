const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log(`catch unhandle expection`);
    process.exit(1); 
});
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

}).then(con => {
    console.log("connaction is successfuly");
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandal rejection');
    server.close(() => {
        process.exit(1); 
    });
});
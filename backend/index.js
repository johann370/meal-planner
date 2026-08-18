const app = require('./app')
// TODO(you): listen on process.env.PORT when Render sets it, falling back
// to 3000 for local dev. Update the console.log to reflect whichever port
// actually got used.
if(process.env.PORT) {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}else {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}

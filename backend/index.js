const app = require('./app')
if(process.env.PORT) {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}else {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}

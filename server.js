const app = require('./config/express')();
const port = app.get('port');

app.listen(port, () =>{
    console.log(`servidor rodando na porta ${port}`)
});
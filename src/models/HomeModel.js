// Importa o Mongoose:
const MONGOOSE = require('mongoose');
// Cria um esquema de dados para a homepage:
const HomeSchema = new MONGOOSE.Schema({
    titulo: { type: String, required: true },
    descricao: String
});
// Cria um 'model' para a homepage:
const HomeModel = MONGOOSE.model('Home', HomeSchema);

class Home {

}

module.exports = Home;
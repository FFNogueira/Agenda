require('dotenv').config();

// Importa o módulo built-in 'path':
const PATH = require('path');
// importa o Express:
const EXPRESS = require('express');

// Cria um servidor do Express:
const APP = EXPRESS();

// Importa o Mongoose:
const MONGOOSE = require('mongoose');

// Conecta o Mongoose com o MongoDB:
MONGOOSE.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database!');
        APP.emit('connected');
    })
    .catch((err) => console.log(`ERRO: ${err}`));

// Gerenciador das sessões do usuário:
const SESSION = require('express-session');
const MONGOSTORE = require('connect-mongo');
const FLASH = require('connect-flash');
const SESSIONoptions = SESSION({
    secret: process.env.SECRETSTRING,
    store: MONGOSTORE.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        // os cookies de sessão durarão apenas 7 dias (em milissegundos):
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

//Inicializa o Gerenciador de Sessões:
APP.use(SESSIONoptions);
APP.use(FLASH());

// Importando o módulo Helmet
//const HELMET = require('helmet');

// Importando o módulo CSURF (evita ataques CSRF):
const CSRF = require('csurf');

// Utilizando middlewares para tratamento de tokens CSRF:
const CheckCsrfError = require('./middleware/middlewares.js').CheckCsrfError;
const csrfMiddleware = require('./middleware/middlewares.js').csrfMiddleware;

// Habilitando o módulo Helmet
//APP.use(HELMET());

// Importando "routes.js"
const ROUTE = require(PATH.resolve(__dirname, 'routes.js'));

// Habilitando Tratamento de requisições POST:
APP.use(EXPRESS.urlencoded({ extended: true }));

// Habilita recepção de dados JSON:
APP.use(EXPRESS.json());

// Habilitando arquivos estáticos
APP.use(EXPRESS.static(PATH.resolve(__dirname, '..', 'public')))

// Habilitando o uso de views:
APP.set('views', PATH.resolve(__dirname, 'views'));
// Escolhendo a engine de processamento das views:
APP.set('view engine', 'ejs');

// Habilitando o módulo CSURF
APP.use(CSRF());

// Checando erros de token CSRF:
APP.use(CheckCsrfError);

// Gerando nossos tokens CRSF:
APP.use(csrfMiddleware);

// Habilitando o uso de rotas:
APP.use(ROUTE);

APP.on('connected', () => {
    // Coloca o servidor para funcionar na porta 3000:
    APP.listen(3000, () => console.log('Servidor Executando: http://127.0.0.1:3000'));
});



// comando do servidor: npm run start
// importa o Express:
const EXPRESS = require('express');
// Cria uma nova rota:
const ROUTE = EXPRESS.Router();
// Importa os middlewares:
const middlewares = require('./middleware/middlewares.js');
// Importa o controlador da homepage:
const homeController = require('./controllers/homeController.js');
// Importa o controlador de login:
const loginController = require('./controllers/loginController.js');
// Importa o controlador de registro:
const registerController = require('./controllers/registerController.js');
// Importa o controlador de logout:
const logoutController = require('./controllers/logoutController.js');
// Importa o controlador de criação de novos contatos:
const contactsController = require('./controllers/contactsController.js');
// Importa o controlador das requisições de edição de contatos:
const editReqController = require('./controllers/editReqController.js');
// Importa o controlador das requisições de remoção de contatos:
const deleteReqController = require('./controllers/deleteReqController.js');
// Importa o controlador da página de edição de contatos:
const editController = require('./controllers/editController.js');

/* Trata requisições 'get' à homepage */
ROUTE.get('/', homeController.getHomepage);
/* Trata requisições 'post' à homepage */
ROUTE.post('/', homeController.postHomepage);

/* Trata requisições 'get' à página de login */
ROUTE.get('/login', middlewares.redirectIfLogged, loginController.getLoginPage);
/* Trata requisições 'post' à página de login */
ROUTE.post('/login', loginController.postLoginPage);

/* Trata requisições 'post' à página de registro */
ROUTE.post('/register', registerController.postRegisterPage);

/* Trata requisições 'get' à página de Logout */
ROUTE.get('/logout', logoutController.getLogoutPage);

/* Trata requisições 'get' à página de novos contatos */
ROUTE.get('/contacts', middlewares.redirectIfNotLogged, contactsController.getContactsPage);
/* Trata requisições 'post' à página de novos contatos */
ROUTE.post('/contacts', contactsController.postContactsPage);

/* Trata requisições 'post' para a ação de edição de contatos */
ROUTE.post('/editReq', editReqController.postEditReq);

/* Trata requisições 'post' para a ação de remoção de contatos */
ROUTE.post('/deleteReq', deleteReqController.postDeleteReq);

/* Trata requisições 'get' à página de edição de contatos */
ROUTE.get('/edit', middlewares.redirectIfNotLogged, editController.getEditPage);
/* Trata requisições 'post' à página de edição de contatos */
ROUTE.post('/edit', editController.postEditPage);


// Este comando deve ir no final do arquivo "route.js":
module.exports = ROUTE;
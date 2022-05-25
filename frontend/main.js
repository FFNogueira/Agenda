/* ====== NÃO EDITE ====== */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './assets/css/style.css';
// comando do webpack: npm run generator
/* ===================== */

// Se existir um botão de editar na página:
if (document.querySelector('td[name="actions"] button[name="editar"]')) {
    // importa a classe "Edit":
    const ReqEdit = require('./modules/ReqEdit.js');
    // Cria um novo objeto "Edit"
    const myReqEdit = new ReqEdit();
    // Inicia funcionalidade do botão de "editar":
    myReqEdit.start();
}

// Se existir um botão de deletar na página:
if (document.querySelector('td[name="actions"] button[name="deletar"]')) {
    // importa a classe "ReqDelete":
    const ReqDelete = require('./modules/ReqDelete.js');
    // Cria um novo objeto "ReqDelete"
    const myReqDelete = new ReqDelete();
    // Inicia funcionalidade do botão de "deletar":
    myReqDelete.start();
}
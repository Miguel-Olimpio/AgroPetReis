// healthCheckRoutes.js
import express from 'express';

const checkHealthrouter = express.Router();

// Rota para a verificação de integridade
checkHealthrouter.get('/health-check', (req, res) => {
    // As verificações de integridade para configuração de um dominio https precisam ser feitas
    // no entanto elas sao feitas em intervalos muito curtos de tempo, portanto essas rotas se 
    // se acessadas em qualquer outra rota, serão criadas sessions no banco de dados, logo 
    // Esta rota é feita única e esclusivamente para a configuração de uma rota que será capaz
    // de realizar esta verificação sem a criação de uma session
    res.status(200).send('OK');
});

export {checkHealthrouter}

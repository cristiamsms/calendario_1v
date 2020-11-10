 /*
     Rutas de Auth
     host+/api/auth
 
 */
 
const {Router}= require('express');
const {check}=require('express-validator');
const {crearUsuario,login,token}=require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-JWT');

const router=Router();





router.post(
    '/new',
    [
        check('name','El nombre es requerido').not().isEmpty(),
        check('email','El email es requerido').isEmail(),
        check('password','La Contraseña tiene que tener almenos 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        check('email','El email es requerido').isEmail(),
        check('password','La Contraseña tiene que tener almenos 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    login);

router.get('/renew',validarJWT,token);

 module.exports =router;
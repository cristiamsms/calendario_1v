const { getEventos,crearEvento,actualizarEvento,eliminarEvento } = require("../controllers/events");
const {validarJWT} = require("../middlewares/validar-JWT");
const {Router}=require('express');
const {check}=require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {isDate} = require("../helpers/isDate");

const router=Router();

router.use(validarJWT);


router.get('/', 
getEventos)

router.post('/',[
    check('title','el titulo es requerido').not().isEmpty(),
    check('start','La fecha de inicio invalida ').custom(isDate),
    check('end','La fecha de fin invalida ').custom(isDate),
    validarCampos
],crearEvento)

router.put('/:id',[
    check('title','el titulo es requerido').not().isEmpty(),
    check('start','La fecha de inicio invalida ').custom(isDate),
    check('end','La fecha de fin invalida ').custom(isDate),
    validarCampos
],actualizarEvento)

router.delete('/:id',eliminarEvento)


module.exports =router;
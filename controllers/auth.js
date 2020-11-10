const {response} = require('express');
const Usuario =require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const crearUsuario = async(req,res=response)=>{

    const {email, password}= req.body;
    try {
        let usuario = await Usuario.findOne({email});

        if(usuario){

            return res.status(400).json({
                ok:false,
                msg:'Un usuario existe con ese correo'
            })
        } 
        
        usuario = new Usuario(req.body);
        

        //Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt); 



        await usuario.save();

        const token = await generarJWT(usuario.id,usuario.name);
     
        res.status(201).json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
      
        });

        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }
    


}
const login = async(req,res=response)=>{

    const {email,password}=req.body;
    
   try {

    const usuario = await Usuario.findOne({email});

    if(!usuario){

        return res.status(400).json({
            ok:false,
            msg:'Un usuario o contraseña incorrectos '
        })
    } 

    const validPassword=bcrypt.compareSync(password, usuario.password)

    if(!validPassword) {
        return res.status(400).json({
            ok:false,
            msg:'Un usuario o contraseña incorrectos'
        })
    }

    const token = await generarJWT(usuario.id,usuario.name);
    res.status(202).json({
       ok:true,
       uid:usuario.id,
        name:usuario.name,
        token
      
    });




   } catch (error) {
    res.status(500).json({
        ok:false,
        msg:'Por favor hable con el administrador'
    });
   }
   


}
const token = async(req,res=response)=>{
    const {uid,name}=req
    
    const token = await generarJWT(uid,name);
    
    res.json({
       ok:true,
       token,
       uid,
       name
    });

}
module.exports={
    crearUsuario,login,token
}
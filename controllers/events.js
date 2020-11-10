const {response} = require('express');
const Evento=require('../models/Evento');

const getEventos= async(req,res=response)=>{
    const eventos=await Evento.find().populate('user','name');

    try {
        res.status(200).json({
            ok:true,
            eventos 
        })
    } catch (error) {
       return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }

    
}

const crearEvento=async(req,res=response)=>{
    const evento=new Evento(req.body);

    try {
        evento.user=req.uid;
        const eventoGuardado = await evento.save();
        res.status(200).json({
            ok:true,
            evento:eventoGuardado
        })
    } catch (error) {
       return res.status(500).json({
        ok:false,
        msg:'Hable con el administrador'
    })
    }

   
}
const actualizarEvento=async(req,res=response)=>{
    const EventoId= req.params.id;

    try {
        const evento= await Evento.findById(EventoId)
        if(!evento){
           return res.status(404).json({
                ok:false,
                msg:'Evento no existe'
            })
        }
        if(evento.user.toString() !== req.uid){
           return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de editar este evento'
            })
        }
        const nuevoEvento ={
            ...req.body,
            user:req.uid
        }
        const eventoActualizado = await Evento.findByIdAndUpdate(EventoId,nuevoEvento,{new:true});
        res.status(200).json({
        ok:true,
        evento:eventoActualizado
    })
    } catch (error) {
       return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
   
}
const eliminarEvento=async(req,res=response)=>{
    const EventoId= req.params.id;
    try {
        const evento= await Evento.findById(EventoId)
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:'Evento no existe'
            })
        }
        if(evento.user.toString() !== req.uid){
           return res.status(401).json({
                ok:false,
                msg:'No tiene privilegio de eliminar este evento'
            })
        }
        const eventoBorrado = await Evento.findByIdAndDelete(EventoId);
        

        res.status(200).json({
            ok:true,
            evento:eventoBorrado
        })
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
   
}

module.exports={
    getEventos,crearEvento,actualizarEvento,eliminarEvento
}
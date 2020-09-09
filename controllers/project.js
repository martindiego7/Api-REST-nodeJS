'use strict'

var Project = require('../models/project');
var fs = require('fs');
var path = require('path');

const { exists } = require('../models/project');

var controller = {
    home: function(req, res){
        return res.status(200).send({
            message: "Soy la home"
        });
    },
    test: function(req, res){
        return res.status(200).send({
            message: "Soy el metodo o accion test del controlador de project"
        });
    },
    saveProject: function(req, res){
        var pro = new Project();
        
        var params = req.body;
        pro.name = params.name;
        pro.description = params.description;
        pro.category = params.category;
        pro.year = params.year;
        pro.langs = params.langs;
        pro.image = null;

        pro.save((err, projectStore)=>{
            if(err) return res.status(500).send({
                message: "Error al guardar"
            });

            if(!projectStore) return res.status(404).send({
                message: "No se ha podido guardar el proyecto"
            });

            return res.status(200).send({
                pro: projectStore
            })
        });
    },

    getProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null){
            return res.status(404).send({
                message: "El proyecto no existe"
            });
        }

        Project.findById(projectId,(err, project) =>{
            if(err) return res.status(500).send({
                message: "Error al devolver los datos"
            });
            if(!project) return res.status(404).send({
                message: "El proyecto no existe"
            });

            return res.status(200).send({
                project
            })
        });
    },

    getProjects: function(req, res){
        Project.find().sort('-year').exec((err, project)=>{
            if(err) return res.status(500).send({
                message: "Error al devolver los datos"
            });
            if(!project) return res.status(404).send({
                message: "No hay proyectos que mostrar"
            });

            return res.status(200).send({
               project
            })
        });
    },

    updateProject: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId,update, {new: true},(err, project) =>{
            if(err) return res.status(500).send({
                message: "Error al actualizar"
            });
            if(!project) return res.status(404).send({
                message: "No existe el proyecto"
            });

            return res.status(200).send({
                project: project
            });
        })
    },

    deleteProject: function(req, res){
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId,(err, projectDeleted) =>{
            if(err) return res.status(500).send({
                message: "No se ha podido borrar el documento"
            });
            if(!projectDeleted) return res.status(404).send({
                message: "No existe ese documento"
            });

            return res.status(200).send({
                project: projectDeleted
            })
        })
    },

    uploadImage: function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida ....';

        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[1];
            var extSplit = fileName.split('\.');
            var fileExt = extSplit[1];

            if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif')
            {
                Project.findByIdAndUpdate(projectId, {image: fileName},{new: true},(err, project)=>{
                    if(err) return res.status(500).send({
                        message: "Error al guardar imagen en la BBDD"
                    });
    
                    if(!project) return res.status(404).send({
                        message: "La imagen no existe"
                    });
    
                    return res.status(200).send({
                        project: project
                    });
    
    
                });
            }else{
                fs.unlink(filePath ,(err)=>{
                    return res.status(200).send({
                        message: "La extension no es valida"
                    });
                });
            }

            
        }
        else{
            return res.status(200).send({
                message: fileName
            });
        }
    },

    getImageFile: function(req, res){
        var file = req.params.image;
    
        var path_file = './uploads/'+file;
           
        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }
            else{
                return res.status(404).send({
                    message: "No existe la imagen"
                });
            }
        });
        
    }

};

module.exports = controller;
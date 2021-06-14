'use strict'

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const server = express();
require('dotenv').config();

const PORT = process.env.PORT;


const mongoose = require("mongoose");

server.use(cors());
server.use(express.json());

mongoose.connect('mongodb://localhost:27017/Digimon', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

const digimonSchema = new Schema({
    name: String,
    img: String,
    level: String
})

var myDigimonModal = mongoose.model("myDigimonModal", digimonSchema);


server.get('/', testHandler);
server.get('/pictures', getDigimonHandler);
server.post('/addFav', addToFav);
server.get('/getFav', getFavHandler);
server.delete('/delete/:id', deleteFavHandler);
//server.put('/update/:id', updateHandler);




// time is up
// function updateHandler(req,res){
//     const{name,level,img}
//     const id = req.params.id;
//     myDigimonModal.findOne({ _id:id }, err => {
//         myDigimonModal.find({}, (err, data) => {
//               res.send(data)
//         })
//         res.send(data)
//     })
// }

function deleteFavHandler(req, res) {
    const id = req.params.id;
    myDigimonModal.remove({ _id:id }, err => {
        myDigimonModal.find({}, (err, data) => {
              res.send(data)
        })
    })

}


function getFavHandler(req, res) {
    myDigimonModal.find({}, (err, fav) => {
        res.send(fav)

    })
}

function addToFav(req, res) {
    //console.log(req.body);
    const { name, img, level } = req.body;
    const newFav = new myDigimonModal({
        name: name,
        img: img,
        level: level
    })
    newFav.save();
}

function getDigimonHandler(req, res) {
    //console.log(req.query)
    const URL = ` https://digimon-api.vercel.app/api/digimon`
    axios.get(URL).then(item => {
        //console.log(item.data);
        const digimonArray = item.data.map(item2 => {
            return new Digimon(item2)
        })
        // console.log(digimonArray);
        res.send(digimonArray);
    })
}

function testHandler(req, res) {
    res.send('test')
}

//https://digimon-api.vercel.app/api/digimon

class Digimon {
    constructor(data) {
        this.name = data.name
        this.img = data.img
        this.level = data.level
    }
}

server.listen(PORT, () => {
    console.log(`Welcome on Port ${PORT}`)
})
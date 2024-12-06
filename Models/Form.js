const mongoose=require('mongoose');

const personSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        reuired:true,
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:Number,
        required:true
    }
})
const Person = mongoose.model('Person', personSchema);

module.exports = Person;
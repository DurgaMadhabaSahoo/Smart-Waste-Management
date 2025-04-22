import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
    brand: {
        type : String,
        required : true, 
    },
    numberPlate:{
        type : String,
        required : true, 
        unique: true,
    },
    capacity: {
        type : String,
        required : true,
    },
}, {timestamps : true});

const Truck = mongoose.model('Truck', truckSchema);

export default Truck;
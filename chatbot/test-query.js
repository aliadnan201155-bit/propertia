// Quick test to check area field values in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const propertySchema = new mongoose.Schema({
    area: String,
    squareFeet: Number,
    title: String,
    location: String
});

const Property = mongoose.model('Property', propertySchema);

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const properties = await Property.find().select('title location area squareFeet');
        
        console.log('\n=== All Properties Area Data ===\n');
        properties.forEach((prop, idx) => {
            console.log(`${idx + 1}. ${prop.title}`);
            console.log(`   Location: ${prop.location}`);
            console.log(`   area field: ${prop.area}`);
            console.log(`   squareFeet field: ${prop.squareFeet}`);
            console.log('---');
        });
        
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Schema
const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: { type: Number, required: true },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Model
const Contact = mongoose.model('Contact', contactSchema);

// Create Contact (create a document)
const createContact = async () => {
  const contact = new Contact({
    fullName: 'John Doe',
    phone: 5555555555,
    age: 30,
  });
  try {
    const result = await contact.save();
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Create many contacts
const createManyContacts = async contacts => {
  try {
    const result = await Contact.create(contacts);
    console.log(result);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Get Contact
const getContacts = async () => {
  /*
  Comparison Query Operators
  - eq
  - ne (not equal)
  - gt
  - gte
  - lt
  - lte
  - in 
  - nin (not in)
  */
  try {
    // const contacts = await Contact.find();
    // const contacts = await Contact.find().limit(2).sort('-age');
    // const contacts = await Contact.find({ age: { $in: [25, 18, 45, 60] } });
    const contacts = await Contact.find({ age: { $gte: 25 } });
    console.log(contacts);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Update Contact
const updateContact = async (id, newAge) => {
  try {
    // Query first
    // const contact = await Contact.findById(id);
    // contact.age = newAge;
    // const result = await contact.save();
    // console.log(result);

    // Update first
    // const result = await Contact.updateOne(
    //   { _id: id },
    //   { $set: { age: newAge } }
    // );
    // console.log(result);
    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: { age: newAge },
      },
      { new: true }
    );

    console.log(contact);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Remove Contact
const removeContact = async id => {
  try {
    // const result = await Contact.deleteOne({ _id: id });
    const contact = await Contact.findByIdAndRemove(id);
    console.log(contact);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// removeContact('63f4d7017657fc8047470b32');
// updateContact('63f4d7017657fc8047470b34', 30);
// getContacts();
// createContact();
// createManyContacts([
//   {
//     fullName: 'John Doe',
//     email: 'john@gmail.com',
//     phone: 5555555555,
//     age: 25,
//   },
//   {
//     fullName: 'Jane Doe',
//     email: 'jane@gmail.com',
//     phone: 4444444444,
//     age: 30,
//   },
//   {
//     fullName: 'Sam Smith',
//     email: 'sam@gmail.com',
//     phone: 3333333333,
//     age: 18,
//   },
// ]);

const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');
const path=require('path')
const Person=require('./Models/Form')
require('dotenv').config();

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
const dbURL=process.env.URL;

mongoose.connect(dbURL, {
    useNewUrlParser: true,    // Recommended options
    useUnifiedTopology: true, 
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

app.get('/',(req,res)=>{
    res.send("hello")
})

app.get('/form', (req, res) => {
    res.render('new', { Person2: null }); // Initially render the page without data
});

app.post('/form/create', async(req, res) => {
    try {
        const { name, age, gender, password } = req.body; // Retrieve form data

        // Save the new user to the database (assuming Mongoose or similar ORM)
        const newuser = await Person.create({ name, age, gender, password });

        // Pass the created user to the template for rendering
        console.log(newuser)
        res.render('new', { Person2: newuser });
    } catch (error) {
        console.error("Error creating user:", error);

        // Handle the error and send a meaningful response
        res.status(500).send("Error creating user. Please try again.");
    }
});


app.get('/form/edit/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id); // Fetch the person by ID

        if (!person) {  // If person is not found
            return res.status(404).send('Person not found'); // Respond with 404
        }

        res.render('edit', { Person: person }); // Render the edit form with the person's data
    } catch (err) {
        console.error('Error fetching person:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/form/update/:id', async (req, res) => {
    console.log('Form Data:', req.body)
    try {
        const { name, age, gender, password } = req.body; // Get the form data
        const updatedPerson = {
            name,
            age,
            gender,
            password,
        };

        const person = await Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true }); // Update the person by ID

        if (!person) { // If the person is not found, return 404
            return res.status(404).send('Person not found');
        }

        res.render('new',{Person2:person}); // Redirect to the edit page to see the updated data
    } catch (err) {
        console.error('Error updating person:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/form/:id', async (req, res) => {
    try {
      const user = await Person.findById(req.params.id);
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      console.log(user);
      res.status(200).send(user);  // Send user data to the client
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  });
  


const port=4080;

app.listen(port,(req,res)=>{
    console.log("server ruunning on 4080")
})
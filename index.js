const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const jsonParser = bodyParser.json();
const fileName = 'students.json';


// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));


app.get('/', (request, response) => {
    response.render('home');
});

// This is a RESTful GET web service
app.get('/students', (request, response) => {
    data.sort((a, b) => (a.name > b.name) ? 1 : -1);
    response.send(data);
});


app.post('/students', jsonParser, (request, response) => {
    const newStudent = request.body;
    const existingStudentIndex = data.findIndex(student => student.id === newStudent.id);

    if (existingStudentIndex !== -1) {
        // Update existing student
        data[existingStudentIndex] = newStudent;
    } else {
        // Add new student
        data.push(newStudent);
    }

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
});

app.delete('/students/:id', (request, response) => {
   
    // Object destructuring is better even though it will produce the same result
    const { id } = request.params;
    console.log(id)
    // const index = data.findIndex(student => student.id === id);
    const index = data.filter(student => student.id == id)

    const studentTobeDeleted = index[0]
    // index[0] beccause data.filter returns an array so we access the first location of the arrray that contains the actual student
    console.log(studentTobeDeleted)

    if (index.length) {
        // Using filter once again to get an array which contains all the records except the student to be deleted
        data = data.filter(student => student != studentTobeDeleted)
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        return response.status(200).json({
            message: 'Student Successfully deleted'
        })
    }
    return response.status(404).json({
        message: 'Cannot find the user'
    })

});


app.put('/students/:id', jsonParser, (request, response) => {
    const id = parseInt(request.params.id);
    const updatedStudent = request.body;
    let index = data.findIndex(student => student.id === id);
    if (index !== -1) {
        // Remove the old record from the data array
        data.splice(index, 1);

        // Add the updated record to the same index
        data.splice(index, 0, updatedStudent);

        // Write the updated data back to the students.json file
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

        response.status(200).send('Student record updated successfully.');
    } else {
        response.status(404).send('Student record not found.');
    }
});



function median(arr) {
    // Your median calculation logic here
    return medianValue;
}
app.get('/', (req, res) => {
    const medianValue = Median();
    res.render('home', { medianValue });
});

app.listen(port);
console.log('server listening on port 3000');
console.log('Go to http://localhost:3000/ in your browser');
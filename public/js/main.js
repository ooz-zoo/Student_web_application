const server = 'http://localhost:3000';
var studentName;
var studentMarks;
var studentId;
var editId;

async function fetchStudents() {
    const url = server + '/students';
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(url, options);
    const students = await response.json();
    populateContent(students);
    // Calculate the median and display it in the UI
    const median = calculateMedian(students);
    document.getElementById('median').innerText = median;
}

async function addStudent() {
    const url = server + '/students';
    const student = { id: studentId, name: studentName, marks: studentMarks };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);
    fetchStudents();
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentMarks').value = '';
    //reloads page
    location.reload();
}

async function deleteStudent(id) {
    const url = server + '/students/' + id;
    const options = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(url, options);
    const result = await response.json();
    if (response.status) {
        alert(result.message)
        fetchStudents()
        //reloads page
        location.reload();
    }
}


function calculateMedian(students) {
    // Extract marks from the students array
    const marks = students.map(student => student.marks);

    // Sort the marks in ascending order
    marks.sort((a, b) => a - b);

    const mid = Math.floor(marks.length / 2);

    if (marks.length % 2 === 0) {
        // If the number of marks is even, return the average of the middle two
        return (marks[mid - 1] + marks[mid]) / 2;
    } else {
        // If the number of marks is odd, return the middle mark
        return marks[mid];
    }
}
async function editStudent(id, name, marks) {
    // Set the global editId variable to the ID of the student being edited
    editId = id;

    // Set the student details in the input fields
    document.getElementById('studentId').value = id;
    document.getElementById('studentName').value = name;
    document.getElementById('studentMarks').value = marks;

    const studentMarksElement = document.getElementById('studentMarks');
    studentMarksElement.scrollIntoView({ behavior: 'smooth' });

    const studentMarks = document.getElementById('studentMarks');
    studentMarks.focus();
    studentMarks.select();
}

async function updateStudent() {
    // Get the updated student details from the input fields
    const id = parseInt(document.getElementById('studentId').value);
    const name = document.getElementById('studentName').value;
    const marks = parseInt(document.getElementById('studentMarks').value);

    // Send a PUT request to update the student details
    const url = server + '/students/' + editId;
    const student = { id: id, name: name, marks: marks };
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);
    const result = await response.json();
    if (response.status) {
        alert(result.message)
        fetchStudents()
        //reloads page
        location.reload();
    }

    // Clear the input fields and reset the editId variable
    document.getElementById('studentId').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('studentMarks').value = '';
    editId = null;
}

function updateChart(labels, data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Student Marks',
                data: data,
                backgroundColor: '#8a2be2',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                barPercentage: 0.8 
            }]
        },
        options: {
            plugins: {

                legend: {
                    labels: {
                        color: 'black',
                        font: {
                            weight: 'bold',
                            size: 18,
                            family: 'Arial',
                        },
                    }
                }
            },


            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        color: 'black',
                        font: {
                            weight: 'bold',
                            size: 18,
                            family: 'Arial'
                        },

                    },
                    title: {
                        display: true,
                        text: 'Student Marks',
                        color: '#8a2be2',
                        font: {
                            weight: 'bold',
                            size: 18
                        }
                    }
                },
                x: {
                    ticks: {
                        color: 'black',
                        font: {
                            weight: 'bold',
                            size: 18,
                            family: 'Arial'
                        },
                    },
                    title: {
                        display: true,
                        text: 'Student Name',
                        color: '#8a2be2',
                        font: {
                            weight: 'bold',
                            size: 18
                        }
                    },

                }
            }
        }

    });
}


function populateContent(students) {
    var chartLabels = [];
    var chartData = [];
    var table = document.getElementById('content');
    table.innerHTML = "<tr><th>Student ID</th><th>Student Name</th><th>Student Marks</th><th>Action</th></tr>";
    students.forEach(student => {
        var row = document.createElement('tr');
        var dataId = document.createElement('td')
        var textId = document.createTextNode(student.id)
        dataId.appendChild(textId)
        var dataName = document.createElement('td');
        var textName = document.createTextNode(student.name);
        dataName.appendChild(textName);
        var dataMarks = document.createElement('td');
        var textMarks = document.createTextNode(student.marks);
        dataMarks.appendChild(textMarks);
        var dataAction = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteStudent(${student.id})`)
        dataAction.appendChild(deleteButton);
        var editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `editStudent(${student.id},'${student.name}',${student.marks})`)
        dataAction.appendChild(editButton);
        row.appendChild(dataId);
        row.appendChild(dataName);
        row.appendChild(dataMarks);
        row.appendChild(dataAction);
        table.appendChild(row);
        chartLabels.push(student.name);
        chartData.push(student.marks);
    });
    updateChart(chartLabels, chartData)
}



document.querySelector('form').addEventListener('submit', (e) => {
    studentName = document.getElementById('studentName').value;
    studentMarks = document.getElementById('studentMarks').value;
    studentId = document.getElementById('studentId').value;
    if (studentName && studentMarks && studentId) {
        studentMarks = parseInt(studentMarks);
        studentId = parseInt(studentId);
        addStudent();

    }
    e.preventDefault();
});


fetchStudents();
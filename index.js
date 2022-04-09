const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



// MySQL
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "dashboard_kit",
});



// Post Project
app.post("/addproject", (req, res) => {
    const projectId = req.body.projectId;
    const projectTitle = req.body.projectTitle;
    const department = req.body.department;
    const priority = req.body.priority;
    const client = req.body.client;
    const price = req.body.price;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const team = req.body.team;
    const description = req.body.description;
    const category = req.body.category;

    db.query(
        "INSERT INTO projects (projectId, projectTitle, department, priority, client, price, startDate, endDate, team, description, category) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [projectId, projectTitle, department, priority, client, price, startDate, endDate, team, description, category],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }
        }
    );
});

app.get("/projects", (req, res) => {
    db.query("SELECT * FROM projects", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.delete("/projectDelete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM projects WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Get specfic project by id
app.get('/projects/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM projects WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});


app.put("/update", (req, res) => {
    const id = req.body.id;
    const wage = req.body.wage;
    db.query('UPDATE projects SET projectId = ?, projectTitle = ?, department = ?, priority = ? client = ?, price = ?, startDate = ?, endDate = ?, WHERE id = ?', [projectId, projectTitle, department, priority, client, price, startDate, endDate, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/addemployee", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const mobile = req.body.mobile;
    const password = req.body.password;
    const designation = req.body.designation;
    const department = req.body.department;
    const address = req.body.address;
    const email = req.body.email;
    const birth = req.body.birth;
    const education = req.body.education;
    const description = req.body.description;

    db.query(
        "INSERT INTO employees (firstName, lastName, gender, mobile, password, designation, department, address, email, birth, education, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [firstName, lastName, gender, mobile, password, designation, department, address, email, birth, education, description],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }
        }
    );
});

app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


app.delete("/employeeDelete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

// Get specfic project by id
app.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM employees WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});

app.put("/employeeUpdae/:id", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const mobile = req.body.mobile;
    const password = req.body.password;
    const designation = req.body.designation;
    const department = req.body.department;
    const address = req.body.address;
    const email = req.body.email;
    const birth = req.body.birth;
    const education = req.body.education;
    const description = req.body.description;
    db.query('UPDATE projects SET firstName = ?, lastName = ?, department = ?, gender = ? mobile = ?, password = ?, designation = ?, address = ?email= ?,birth= ?,education= ?,description= ?,  WHERE id = ?', [firstName, lastName, department, gender, mobile, password, designation, address, email, birth, education, description, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});



// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
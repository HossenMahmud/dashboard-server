const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const { findSourceMap } = require("module");
const bodyParser = require('body-parser')


app.use(cors());
app.use(express.json());
app.use(bodyParser.json())


const port = process.env.PORT || 5000;

// MySQL
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "dashboard_kit",
});


// File upload folder
const UPLOADS_FOLDER = "./uploads/";

// var upload = multer({ dest: UPLOADS_FOLDER });

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const fileName =
            file.originalname
                .replace(fileExt, "")
                .toLowerCase()
                .split(" ")
                .join("-") +
            "-" +
            Date.now();

        cb(null, fileName + fileExt);
    },
});

// preapre the final multer upload object
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "image") {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true);
            } else {
                cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
            }
        } else if (file.fieldname === "file") {
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(new Error("Only .pdf format allowed!"));
            }
        } else {
            cb(new Error("There was an unknown error!"));
        }
    },
});


// Post Project
app.post("/addproject", upload.single("file"), (req, res) => {
    const projectId = req.body.projectId;
    const projectTitle = req.body.projectTitle;
    const department = req.body.department;
    const priority = req.body.priority;
    const client = req.body.client;
    const price = req.body.price;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const teamMember = req.body.teamMember;
    const description = req.body.description;
    const category = req.body.category;
    const teamLeader = req.body.teamLeader;
    const phases = req.body.phases;
    const file = req.file.path;
    //console.log(file);

    db.query(
        "INSERT INTO projects (projectId, projectTitle, department, priority, client, price, startDate, endDate, teamMember, description, category,teamLeader,phases,file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [projectId, projectTitle, department, priority, client, price, startDate, endDate, teamMember, description, category, teamLeader, phases, file],
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

app.put("/projectUpdate/:id", (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const keys = Object.keys(data);
    const sqlquery = `UPDATE projects SET ${keys.map(
        (key) => key + " = ?"
    )} WHERE id = ${id}`;

    const value = keys.map((key) => {
        return data[key];
    });

    db.query(sqlquery, value, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});



app.post("/addemployee", upload.fields([
    {
        name: "image",
        maxCount: 1,
    },
    {
        name: "file",
        maxCount: 1,
    },
]), (req, res) => {
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
    const image = req.files.image[0].path;
    const file = req.files.file[0].path;


    db.query(
        "INSERT INTO employees (firstName, lastName, gender, mobile, password, designation, department, address, email, birth, education, description,image,file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [firstName, lastName, gender, mobile, password, designation, department, address, email, birth, education, description, image, file],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }
        }
    );
});

// app.get('/getSingleFiles/:fileName', function (req, res) {
//     const fileName = req.params.fileName;
// });

// const getallSingleFiles = async (req, res, next) => {
//     try {
//         const files = await SingleFile.find();
//         res.status(200).send(files);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }



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
    const id = req.params.id;
    const data = req.body;

    const keys = Object.keys(data);
    const sqlquery = `UPDATE employees SET ${keys.map(
        (key) => key + " = ?"
    )} WHERE id = ${id}`;

    const value = keys.map((key) => {
        return data[key];
    });

    db.query(sqlquery, value, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});








app.post("/addclient", upload.fields([
    {
        name: "image",
        maxCount: 1,
    },
    {
        name: "file",
        maxCount: 1,
    },
]), (req, res) => {
    const name = req.body.name;
    const companyName = req.body.companyName;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const date = req.body.date;
    const currency = req.body.currency;
    const billMethod = req.body.billMethod;
    const location = req.body.location;
    const description = req.body.description;
    const image = req.files.image[0].path;
    const file = req.files.file[0].path;


    db.query(
        "INSERT INTO clients (name, companyName, email, mobile, date, currency, billMethod, location, description,image,file) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [name, companyName, email, mobile, date, currency, billMethod, location, description, image, file],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }
        }
    );
});




app.get("/clients", (req, res) => {
    db.query("SELECT * FROM clients", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/clientDelete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM clients WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.get('/client/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM clients WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});


app.put("/clientUpdate/:id", (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const keys = Object.keys(data);
    const sqlquery = `UPDATE clients SET ${keys.map(
        (key) => key + " = ?"
    )} WHERE id = ${id}`;

    const value = keys.map((key) => {
        return data[key];
    });

    db.query(sqlquery, value, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});




// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
//server.js
const express = require('express');
const mysql = require("mysql");
const cors = require('cors');
const session = require('express-session'); // Include express-session

const app = express();
app.use(express.json());
app.use(cors());

// Session configuration
app.use(session({
    secret: 'react', // Replace with a strong, random key for production
    resave: false,
    saveUninitialized: false
}));

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'signdb'
});

app.get('/', (req, res) => {
    return res.json("From backend side");
});

app.post('/user', (req, res) => {
    const sql = "SELECT * FROM user WHERE Username = ? AND Password = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) return res.json("Error");

        if (data.length > 0) {
            req.session.user = data[0];
            return res.json({ message: "Login successfully", user: data[0] });
        } else {
            return res.json({ message: "No Record" });
        }
    });
});

app.post('/signdb', (req, res) => {
    const sql = "INSERT INTO `user`(`Email`, `Username`, `Password`) VALUES (?, ?, ?)";
    db.query(sql, [req.body.email, req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("listening");
});
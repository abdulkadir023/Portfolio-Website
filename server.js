import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

dotenv.config()

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

db.connect();


app.get('/', (req, res) =>{
    res.render('index.html');
});

app.post('/contactMe', async(req, res) =>{

    const {name, email, phone, subject, message} = req.body;

    try {

        const result = await db.query('INSERT INTO clients (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, subject, message]
        );

        const clients = result.rows[0];

        console.log("New Client: ", clients);
        
    } catch (error) {
        console.log(error);
        
    }
    
    res.redirect('/');

})
app.listen(port, () =>{
    console.log(`listening on http://localhost:${port}`);
});
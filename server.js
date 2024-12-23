import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio',
    password: 'Admin',
    port: 5432
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


    
    
    console.log({name}, {email}, {phone}, {subject}, {message});

    res.json({name}, {email}, {phone}, {subject}, {message});

})
app.listen(port, () =>{
    console.log(`listening on http://localhost:${port}`);
});
const express = require("express")
const multer = require("multer")
const cors = require("cors")
const port = 8000
const app = express()
app.use(cors())
const db = require('./queries')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public")
    },
    file: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage }).array("file")

//ROUTES
app.post('/register', db.createUser)
app.get('/', db.getPosts)
app.get('/item/:id', db.getItem)
app.put('/update', db.updateItem)
app.delete('/delete', db.deleteItem)
app.post('/create', db.createItem)
// app.get('/', db.getFavorites)
   

app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.files)
    }) 
})

app.listen(port, () => {
    console.log("app is running on port 8000")
})
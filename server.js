import express from "express";

import { fileURLToPath } from "url";

import { dirname, join } from "path";

import path from 'path';
import favicon from 'serve-favicon';


import fs from "fs";

const app = express();
 
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(favicon(path.join(__dirname, 'favicon.ico')));

 

app.use(express.static(join(__dirname, "public")));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.set("view engine", "ejs");
 
app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    try {
      res.render("index", { files: files });
    } catch (err) {
      console.log(`somethinf Error: ${err}`);
    }
  });
  res.sendFile(path.join(__dirname, 'views', 'index.ejs'));
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename.trim()}`, "utf-8", (err, data) => {
    res.render("shows", { filename: req.params.filename, filedata: data });
  });
});

app.get('/delete/:filename', (req,res) => {
    fs.unlink(`./files/${req.params.filename.trim()}`, (done)=>{
        console.log(done)
    })
   res.redirect('/')
})


app.get('/edit/:filename', (req, res) => {
  console.log(req.body)
    res.render('edit', {filename: req.params.filename})
})
app.post('/edit', (req,res)=>{
  console.log(req.body)
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.newname}`,(err, done)=> {
    try {
      console.log(done)
    } catch (error) {
      console.log(`error :${err} and something catch error: ${error}`)
    }
  })
  res.redirect('/')
})

app.post("/create", (req, res, next) => {
  fs.writeFile(`./files/${req.body.title.split(' ').join("")}`,req.body.details,(err) => {
      console.log(`something error ${err}`);
    //   res.json(req.body.title)
      res.redirect("/");
    }
  );
});





// app.get("/Delete/:filename", (req,res)=>{
//     fs.unlink(`./files/${req.params.filename}.txt`, (err, done)=>{
//         try {
//             console.log(`succesfully deleted: ${done}`)
//             console.log(req.body.title)
//         } catch (error) {
//             console.log(`${error} and ${err}`)
//         }
//     })
//     res.redirect('/')
// })




const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

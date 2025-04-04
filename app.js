const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir("./hisaab", function (err, files) {
        if (err) return res.status(500).send(err);
        res.render("index", {files: files});
    });
});

app.get("/create", function(req, res) {
    res.render("create");
});

app.post("/createhisaab", function (req, res) {

    let currentDate = new Date();
    let dayOfTheMonth = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let year = String(currentDate.getFullYear());
    let fileName = dayOfTheMonth + "-" + month + "-" + year + ".txt";

    fs.writeFile(`./hisaab/${fileName}`, req.body.content, function (err) {
        if (err) return res.status(500).send(err);
        res.redirect("/");
    });
});

app.get("/edit/:filename", function(req, res) {
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) res.status(500).send(err);
        res.render("edit", { filedata: filedata, filename : req.params.filename });
    });
});

app.post("/update/:filename", function (req, res) {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.content, function (err) {
        if (err) return res.status(500).send(err);
        res.redirect("/")
    });
});

app.get("/hisaab/:filename", function (req, res) {
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function (err, filedata) {
        if (err) res.status(500).send(err);
        res.render("hisaab", {filedata: filedata, filename: req.params.filename});
    });
});

app.get("/delete/:filename", function (req, res) {
    fs.unlink(`./hisaab/${req.params.filename}`, function (err) {
        if (err) res.status(500).send(err);
        res.redirect("/");
    });
});

app.listen(3000);




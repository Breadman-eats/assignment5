/********************************************************************************
*  WEB700 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Matthaus Matthew Student ID: 137314233 Date: 2025-06-14
*
*  Published URL: https://vercel.com/matthaus-matthews-projects/assignment4-q5df/DXGEsK4ETak1teLGucbX7b293Gae
*
********************************************************************************/

// Required Modules & EJS Setup
const express = require("express");
const path = require("path");
const app = express();

// Set the port for the server
const HTTP_PORT = process.env.PORT || 8080;

const LegoData = require("./modules/LegoSets");
const legoData = new LegoData();

// Middleware for form data and static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Home and About Views
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// GET Add Set Form
app.get("/lego/addSet", async (req, res) => {
  try {
    const themes = await legoData.getAllThemes();
    res.render("addSet", { themes, page: "/lego/addSet" });
  } catch (err) {
    res.status(500).send("Unable to load addSet form.");
  }
});

// POST Add Set Form
app.post("/lego/addSet", async (req, res) => {
  try {
    const foundTheme = await legoData.getThemeById(req.body.theme_id);
    req.body.theme = foundTheme.name;
    await legoData.addSet(req.body);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(500).send("Error adding set: " + err);
  }
});

// Render All Sets or Filter by Theme
app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render("sets", { sets, page: "/lego/sets" });
  } catch (err) {
    res.status(404).send("Sets not found: " + err);
  }
});

// Single Set Detail View
app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.set_num);
    res.render("set", { set, page: "" });
  } catch (err) {
    res.status(404).send("Set not found: " + err);
  }
});

// Delete Set Route
app.get("/lego/deleteSet/:set_num", async (req, res) => {
  try {
    await legoData.deleteSetByNum(req.params.set_num);
    res.redirect("/lego/sets");
  } catch (err) {
    res.status(404).send("Failed to delete set: " + err);
  }
});

// Fallback 404 View
app.use((req, res) => {
  res.status(404).render("404", { page: "" });
});

// Initialize and Start Server
legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

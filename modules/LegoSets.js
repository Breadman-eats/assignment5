/********************************************************************************
*  WEB700 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Matthaus Matthew  Student ID: 137314233  Date: 18/07/2025
********************************************************************************/

//Importing data from json files
const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

//Creating the legoData class
class legoData {
  constructor() {
    this.sets = [];
    this.themes = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        this.sets = [];
        setData.forEach(set => {
          const theme = themeData.find(theme => theme.id === set.theme_id);
          this.sets.push({
            ...set,
            theme: theme ? theme.name : "Unknown"
          });
        });

        //Store all themes in this.themes
        this.themes = [...themeData];

        resolve();
      } catch (err) {
        reject("Unable to load data: " + err);
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length > 0) {
        resolve(this.sets);
      } else {
        reject("No sets available.");
      }
    });
  }

  // Adding a new set
  addSet(newSet) {
    return new Promise((resolve, reject) => {
      const exists = this.sets.find(set => set.set_num === newSet.set_num);
      if (exists) {
        reject("Set already exists");
      } else {
        this.sets.push(newSet);
        resolve();
      }
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find(set => set.set_num === setNum);
      if (foundSet) {
        resolve(foundSet);
      } else {
        reject("Unable to find requested set: " + setNum);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const results = this.sets.filter(set =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );
      if (results.length > 0) {
        resolve(results);
      } else {
        reject("Unable to find requested sets for theme: " + theme);
      }
    });
  }

  //Get all themes
  getAllThemes() {
    return new Promise((resolve, reject) => {
      if (this.themes.length > 0) {
        resolve(this.themes);
      } else {
        reject("No themes available.");
      }
    });
  }

  //Get theme by ID
  getThemeById(id) {
    return new Promise((resolve, reject) => {
      const foundTheme = this.themes.find(theme => theme.id == id);
      if (foundTheme) {
        resolve(foundTheme);
      } else {
        reject("Unable to find requested theme: " + id);
      }
    });
  }

  //Delete a set by set number
  deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const index = this.sets.findIndex(set => set.set_num === setNum);
      if (index !== -1) {
        this.sets.splice(index, 1);
        resolve();
      } else {
        reject("Unable to find set to delete: " + setNum);
      }
    });
  }
}

// Exporting the legoData class
module.exports = legoData;

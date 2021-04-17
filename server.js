const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "reactxo",
});

app.get("/load", (req, res) => {
    db.query("SELECT * FROM history", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/save", (req, res) => {
  const gameState = req.body.gameState;
  const playerWon = req.body.playerWon;
  const gameSize = req.body.gameSize;

  db.query(
    "INSERT INTO history (gameState, playerWon, gameSize) VALUES (?,?,?)",
    [gameState, playerWon, gameSize],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});
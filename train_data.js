// train_data.js
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
var db;

// raw function

function run(sql, params) {
	return new Promise((resolve, reject) => {
		db.run(sql, params, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

function run2(sql, param0, param1) {
	return new Promise((resolve, reject) => {
		db.run(sql, param0, param1, (err) => {
			if (err) reject(err);
			resolve();
		});
	});
}

function get(sql, params) {
	return new Promise((resolve, reject) => {
		db.get(sql, params, (err, row) => {
			if (err) reject(err);
			resolve(row);
		});
	});
}

function all(sql, params) {
	return new Promise((resolve, reject) => {
    if (params != null) {
      db.all(sql, params, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });  
    } else {
      db.all(sql, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });  
    }
	});
}

function each(sql, func) {
	return new Promise((resolve, reject) => {
		db.each(sql,
      (err, row) => {
        func(err, row);
      }, (err) => {
			  if (err) reject(err);
			  resolve();
		});
	});
}

//
//

const account = [
  "1822030",
  "1822043",
  "1822061",
  "1922001",
  "1922004",
  "1922019",
  "1922029",
  "1922033",
  "1922054",
  "19N2048",
  "2022001",
  "2022002",
  "2022004",
  "2022009",
  "2022014",
  "2022016",
  "2022021",
  "2022022",
  "2022024",
  "2022027",
  "2022029",
  "2022031",
  "2022036",
  "2022038",
  "2022039",
  "2022044",
  "2022050",
  "2022059",
  "2022063",
  "2022065",
  "2022071",
  "2022075",
  "2022077",
  "2022079",
  "2022080",
  "blank",
  "admin",
  "guest"
];

async function init(name)
{
  console.log("kvs.init("+name+")");
  var exists = fs.existsSync(name);
  db = new sqlite3.Database(name);

  var val = '[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]';
  
  if (!exists) {
    await run(
      "CREATE TABLE Rules (id INTEGER PRIMARY KEY AUTOINCREMENT, trainer TEXT, rule TEXT)"
    );
    for (var i = 0; i < account.length; i++) {
      //console.log("%d: %s", i, account[i]);
      await run2(
        'INSERT INTO Rules (trainer,rule) VALUES (?,?)', account[i], val
      );
    }
  }
}

async function checkTrainer(key, func)
{
  var rows = await all("SELECT * from Rules WHERE trainer = ?", key);
  func(rows);
}

async function getRule(key, func)
{
  var rows = await all("SELECT rule from Rules WHERE trainer = ?", key);
  func(rows);
}

async function putRule(key, val, func)
{
  var rows = await run2('UPDATE Rules SET rule = ? WHERE trainer = ?', val ,key);
  func(rows);
}

async function setRule(key, val, func)
{
  var rows = await run2('INSERT INTO Rules (trainer,rule) VALUES (?,?)',key, val);
  func(rows);
}

module.exports.init = init;
module.exports.checkTrainer = checkTrainer;
module.exports.getRule = getRule;
module.exports.putRule = putRule;
module.exports.setRule = setRule;

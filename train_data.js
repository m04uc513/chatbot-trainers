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

/*
async function main()
{

  var val = '[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]';

  const name = 'train_data.db'
  var exists = fs.existsSync(name);
  db = new sqlite3.Database(name);

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
  
  var row = await all("SELECT * from Rules");
  if (row) {
    console.log(row);
    //for (var i = 0; i < row.length; i++) {
      //console.log("%d:\t%s\t%s", i, row[i].trainer, row[i].rule);
    //}
  }
}

main();
*/

async function init(name)
{
  console.log("kvs.init("+name+")");
  db = new sqlite3.Database(name);
  //var row = await all("SELECT * from Rules");
  //console.log(row);
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

async function setRule(key, val, func)
{
  var rows = await run2('UPDATE Rules SET rule = ? WHERE trainer = ?', val ,key);
  func(rows);
}

module.exports.init = init;
module.exports.checkTrainer = checkTrainer;
module.exports.getRule = getRule;
module.exports.setRule = setRule;

// Preinfo_db.js

require("dotenv").config();

// ライブラリの読み込み
const sqlite3 = require("sqlite3");
const uuid = require("uuid");

module.exports = class Preinfo_db {
  constructor(path) {
    const db_path = path || process.env.ROOT_PATH + process.env.PREINFO_DB_PATH;
    this.db = new sqlite3.Database(db_path);
    this.db.run(
      "create table if not exists formdata(uuid, companyName, employeeNumber, employeeName_last, employeeName_first, enable, timestamp)"
    );
  }

  entry(data) {
    if (
      data?.companyName === undefined ||
      data?.employeeNumber === undefined ||
      data?.employeeName_last === undefined ||
      data?.employeeName_first === undefined 
    ) {
      return null;
    }

    data.uuid = uuid.v4();
    data.timestamp = new Date().toLocaleString();
    data.enable = 1;

    this.db.serialize(() => {
      this.db.run(
        "insert into formdata(uuid, companyName, employeeNumber, employeeName_last, employeeName_first, enable, timestamp) values(?, ?, ?, ?, ?, ?, ?)",
        [
          data.uuid,
          data.companyName,
          data.employeeNumber,
          data.employeeName_last,
          data.employeeName_first,
          data.enable,
          data.timestamp,
        ]
      );
    });
    return data.uuid;
  }

  async read(uuid) {
    return new Promise((resolve, reject) => {
      if (uuid === undefined || uuid === null || uuid === "") {
        reject(null);
      }
      this.db.serialize(() => {
        this.db.get(
          "select * from formdata where uuid = ? and enable = 1",
          [uuid],
          (err, row) => {
            if (err) {
              reject(null);
            }
            resolve(row);
          }
        );
      });
    });
  }

  async check_enable(uuid) {
    return new Promise((resolve, reject) => {
      if (uuid === undefined || uuid === null || uuid === "") {
        reject(null);
      }
      this.db.serialize(() => {
        this.db.get(
          "select enable from formdata where uuid = ?",
          [uuid],
          (err, row) => {
            if (err) {
              reject(null);
            }
            if (row == undefined) resolve(0);
            else resolve(row.enable == 1);
          }
        );
      });
    });
  }

  disable(uuid) {
    if (uuid === undefined || uuid === null || uuid === "") {
      return null;
    }
    this.db.serialize(() => {
      this.db.run("update formdata set enable = 0 where uuid = ?", [uuid]);
    });
  }

  reset(password) {
    if (password === process.env.DB_RESET_PASSWORD) {
      this.db.serialize(() => {
        this.db.run("drop table if exists formdata");
      });
    }
  }
};

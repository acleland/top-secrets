const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  secret;

  constructor(row) {
    this.id = row.id;
    this.secret = row.secret;
  }

  static async getAll() {
    const { rows } = await pool.query(`
    SELECT * FROM secrets;
    `);
    console.log(rows);
    return rows.map((row) => new Secret(row));
  }
};

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'requests.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS request_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT    NOT NULL,
    payload     TEXT    NOT NULL,
    status_code INTEGER NOT NULL,
    created_at  DATETIME DEFAULT (datetime('now'))
  )
`);

const _insertStmt = db.prepare(`
  INSERT INTO request_logs (user_id, payload, status_code)
  VALUES (@user_id, @payload, @status_code)
`);

function insertLog(params) {
  return _insertStmt.run(params);
}

const ALLOWED_SORT_COLUMNS = new Set(['id', 'user_id', 'payload', 'status_code', 'created_at']);

function getLogs({ sort_by = 'created_at', order = 'desc' } = {}) {
  const col = ALLOWED_SORT_COLUMNS.has(sort_by) ? sort_by : 'created_at';
  const dir = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return db.prepare(`SELECT * FROM request_logs ORDER BY ${col} ${dir}`).all();
}

module.exports = { insertLog, getLogs };

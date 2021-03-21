export const getSecretWithId = `SELECT * FROM wallet where id=$1 AND user_id=$2`;
export const insertNewSecret = `INSERT INTO wallet (label, secret, user_id) VALUES ($1, $2, $3)`;
export const getAllEntries = `SELECT * FROM wallet`;

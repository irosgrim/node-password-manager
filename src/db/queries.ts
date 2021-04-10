export const getCryptoKeyForUser = `SELECT key FROM encryption_keys WHERE id=$1`;
export const getSecretWithId = `SELECT * FROM wallet where id=$1 AND user_id=$2`;
export const insertNewSecret = `INSERT INTO wallet (label, secret, user_id) VALUES ($1, $2, $3)`;
export const getAllEntries = `SELECT id, label FROM wallet WHERE user_id=$1`;
export const search = `SELECT id, label FROM wallet WHERE label ~* $1::text AND user_id=$2`;
export const updateSpecificSecret = `UPDATE wallet SET label=$1, secret=$2 WHERE user_id=$3 AND id=$4 RETURNING id, label, secret`;

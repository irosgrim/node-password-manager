export const getCryptoKeyForUser = `SELECT key FROM encryption_keys 
    WHERE id=$1`;

export const getSecretWithId = `SELECT * FROM wallet 
    WHERE id=$1 AND user_id=$2`;

export const deleteSecretWithId = `DELETE FROM wallet 
    WHERE id=$1 AND user_id=$2`;

export const getAttachmentsForSecretWithId = `SELECT attachments FROM wallet WHERE id=$1 AND user_id=$2`;

export const insertNewSecret = `INSERT INTO wallet (label, secret, user_id, date_created, date_modified, icon, category, attachments) 
    VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6)
    RETURNING *
    `;

export const getAllEntries = `SELECT id, label, date_created, date_modified, icon, category, attachments 
    FROM wallet 
    WHERE user_id=$1`;

export const search = `SELECT id, label, date_created, date_modified, icon, category, attachments 
    FROM wallet 
    WHERE label ~* $1::text 
    AND user_id=$2`;

export const updateSpecificSecret = `UPDATE wallet SET label=$1, secret=$2, icon=$3, category=$4, date_modified=NOW(), attachments=$5 
    WHERE user_id=$6
    AND id=$7 
    RETURNING id, label, secret, date_created, date_modified, icon, category, attachments`;

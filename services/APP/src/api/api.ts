import { deleteFiles } from '../cloudStorage/cloud';
import Cryptography from '../crypto/crypto';
import { pool } from '../db/connect';
import { 
    deleteSecretWithId, 
    getAllEntries, 
    getCryptoKeyForUser, 
    getSecretWithId, 
    insertNewSecret, 
    search, 
    updateSpecificSecret, 
    getUser } from '../db/queries';
import { Secret } from '../types/types';

export interface NewSecretFields {
    id?: number;
    secret: string; 
    label: string;
    icon: string;
    category: string;
}

export interface ApiOperations {
    checkCredentials: (credentials: {username: string, password: string}) => Promise<number | undefined>;
    getAllSecrets: (authorisedUser: number) => Promise<Secret[] | void>;
    getSecretById: (secretId: number, authorisedUser: number) => Promise<Secret | void>;
    searchSecret: (searchQuery: string, authorisedUser: number) => Promise<Secret[] | void>;
    newSecret: (secret: NewSecretFields, authorisedUser: number, filesPaths: string[]) => Promise<string | void>;
    updateSecret: (secret: NewSecretFields, authorisedUser: number, filesPaths: string[]) => Promise<string | void>;
}

class Api implements ApiOperations {
    constructor() {}

    private async encryptSecret(authorisedUser: number, secret: string): Promise<string> {
        const cryptoKeyForUser = await pool.query(getCryptoKeyForUser, [authorisedUser]);
        const cryptoKey = cryptoKeyForUser.rows[0].key;
        const cryptography = new Cryptography();
        const secretEncrypted = await cryptography.encrypt(secret, cryptoKey);
        return secretEncrypted;
    }

    public async checkCredentials(credentials: {username: string, password: string}): Promise<number | undefined> {
        const user = await pool.query(getUser, [credentials.username]);
        // TODO: implement proper password check!
        if(!user.rows.length) {
            return;
        }
        const password = user.rows[0].password;
        if(credentials.password !== password) {
            return;
        }
        return user.rows[0].id;
    }

    public async getAllSecrets(authorisedUser: number): Promise<Secret[] | void> {
        try {
            const r = await pool.query(getAllEntries, [ authorisedUser ]);
            return r.rows;
        } catch (err) {
            throw err;
        }
    }

    public async getSecretById(secretId: number, authorisedUser: number): Promise<Secret | void> {
        try {
            const cryptoKeyForUser = pool.query(getCryptoKeyForUser, [authorisedUser]);
            const resultsQueryPromise = pool.query(getSecretWithId, [secretId, authorisedUser]);
            const [results, cryptoKey] = await Promise.all([resultsQueryPromise, cryptoKeyForUser]);
            if(!results.rows.length) {
                return;
            }
            const _cryptoKey = cryptoKey.rows[0].key;
            const decryptedData = results.rows.map((entry) => {
                const secretData = new Cryptography().decrypt(entry.secret, _cryptoKey);
                return {
                    ...entry,
                    secret: JSON.parse(secretData),
                };
            });
            return decryptedData[0];
        } catch (err) {
            throw err;
        }
    }

    public async searchSecret(searchQuery: string, authorisedUser: number): Promise<Secret[] | void> {
        try {
            const results = await pool.query(search, [searchQuery, authorisedUser]);
            return results.rows;
        } catch (err) {
            throw err;
        }
    }

    public async newSecret(secret: NewSecretFields, authorisedUser: number, filesPaths: string[]): Promise<string | void> {
        try {
            const secretEncrypted = await this.encryptSecret(authorisedUser, secret.secret);
            const r = await pool.query(insertNewSecret, [secret.label, secretEncrypted, authorisedUser, secret.icon, secret.category, filesPaths]);
            return r.rows[0];
        } catch(err) {
            throw err;
        }
    }

    public async updateSecret(secret: NewSecretFields, authorisedUser: number, filesPaths: string[]): Promise<string | void> {
        try {
            const secretEncrypted = await this.encryptSecret(authorisedUser, secret.secret);
            const updateQueryResponse = await pool.query(updateSpecificSecret, [secret.label, secretEncrypted, secret.icon, secret.category, filesPaths, authorisedUser, secret.id]);
            return updateQueryResponse.rows[0];
        } catch(err) {
            throw err;
        }
    }

    public async deleteSecret(secretId: number, authorisedUser: number): Promise<number | void> {
        try {
            const results = await pool.query(getSecretWithId, [secretId, authorisedUser]);
            if(!results.rows.length) {
                return;
            }
            const attachments = results.rows[0].attachments;
            const deleteAttachments = await deleteFiles(attachments);
            const deleteResults = await pool.query(deleteSecretWithId, [secretId, authorisedUser]);
            return deleteResults.rows[0];
        } catch (err) {
            throw err;
        }
    }

}

export const api = new Api();
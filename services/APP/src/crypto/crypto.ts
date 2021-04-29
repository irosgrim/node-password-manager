import crypto from 'crypto';

export default class Cryptography {
    private readonly algorithm: string = 'aes-256-ctr';
    private iv;
    constructor() {
        this.iv = crypto.randomBytes(16);
    }

    public encrypt(text: string, secretKey: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, secretKey, this.iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return this.iv.toString('hex') +'.'+ encrypted.toString('hex');
    }

    public decrypt(hash: string, secretKey: string): string {
        const encryptedHash = hash.split('.');
        const iv = encryptedHash[0];
        const content = encryptedHash[1];
        const decipher = crypto.createDecipheriv(this.algorithm, secretKey, Buffer.from(iv, 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
        return decrypted.toString();
    }
}
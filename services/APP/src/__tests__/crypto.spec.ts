import Cryptography from '../crypto/crypto'

describe('Encrypt / decrypt', () => {
    const key = 'peanutbutterjelly_cats_are_c00l!';
    const secret = 'my darkest secret';
    const _crypto = new Cryptography();

    test('it should encrypt text using the 32 bit key provided', () => {
        const sut = _crypto.encrypt(secret, key);
        expect(sut).toBeTruthy();
    })

    test('it should decrypt text using the 32 bit key provided', () => {
        const encryptedText = _crypto.encrypt(secret, key);
        const sut = _crypto.decrypt(encryptedText, key);
        expect(sut).toEqual(secret);
    })
})
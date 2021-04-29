import supertest from 'supertest';
import { app } from '../server';
const request = supertest(app);

describe('GET /secrets', () => {
    it('should return an array of secrets', async done => {
        request.get(`/secrets`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res.body[0].label).toBeDefined;
            done()
          })
    })

    it('should return a specific secret', async done => {
        request.get(`/secrets/76`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            expect(res.body.id).toEqual(76);
            done()
          })
    })

})
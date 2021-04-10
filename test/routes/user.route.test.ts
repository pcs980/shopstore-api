import request from 'supertest';
import app from '../../src/app';

describe('User Routes', () => {
  describe('POST /signup', () => {
    test('should return error if body is empty', async (done) => {
      request(app)
        .post('/signup')
        .send({})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('EMPTY_BODY');
          expect(body.message).toBe('Request with empty body');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    test('should return error if name is invalid', async (done) => {
      request(app)
        .post('/signup')
        .send({name: '  '})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('INVALID_REQUEST');
          expect(body.message).toBe('Invalid name: "  "');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    test('should return error if password is invalid', async (done) => {
      request(app)
        .post('/signup')
        .send({name: 'name', password: ''})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('INVALID_REQUEST');
          expect(body.message).toBe('Invalid password');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    test('should return error if email is invalid', async (done) => {
      request(app)
        .post('/signup')
        .send({name: 'Name', password: '123', email: 'email.com'})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('INVALID_REQUEST');
          expect(body.message).toBe('Invalid e-mail address: "email.com"');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });
  });
  describe('POST /signin', () => {
    test('should return error if body is empty', async (done) => {
      request(app)
        .post('/signin')
        .send({})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('EMPTY_BODY');
          expect(body.message).toBe('Request with empty body');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    test('should return error if password is invalid', async (done) => {
      request(app)
        .post('/signin')
        .send({email: 'john@company.com', password: ''})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('INVALID_REQUEST');
          expect(body.message).toBe('Invalid password');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });

    test('should return error if email is invalid', async (done) => {
      request(app)
        .post('/signin')
        .send({email: 'email.com', password: '123'})
        .expect(412)
        .then(({ body }) => {
          expect(body.code).toBe('INVALID_REQUEST');
          expect(body.message).toBe('Invalid e-mail address: "email.com"');
          done();
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
    });
  });
});
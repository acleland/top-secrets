const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Richard',
  lastName: 'Warmonger',
  email: 'warmonger@defense.gov',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);

  const user = await UserService.create({ ...mockUser, ...userProps });

  const { email } = user;

  await agent.post('/api/v1/users/sessions').send({ email, password });
  console.log('user', { user });
  return [agent, user];
};

describe('auth routes for top secret information', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: mockUser.email, password: mockUser.password });
    expect(res.status).toEqual(200);
  });

  it('/secrets should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.status).toEqual(401);
  });

  it('/secrets should return status 200 if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});

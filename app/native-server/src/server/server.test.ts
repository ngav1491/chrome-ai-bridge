import { describe, expect, test, afterAll, beforeAll } from '@jest/globals';
import supertest from 'supertest';
import Server from './index';

describe('máy chủkiểm thử', () => {
  // khởi độngmáy chủkiểm thửthể hiện
  beforeAll(async () => {
    await Server.getInstance().ready();
  });

  // đóngmáy chủ
  afterAll(async () => {
    await Server.stop();
  });

  test('GET /ping trả vềphản hồi', async () => {
    const response = await supertest(Server.getInstance().server)
      .get('/ping')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      status: 'ok',
      message: 'pong',
    });
  });
});

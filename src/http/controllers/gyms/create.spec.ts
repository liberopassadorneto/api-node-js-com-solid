import { app } from '@/app'
import { prismaCreateAndAuthenticateUser } from '@/utils/test/prisma-create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get create a gym', async () => {
    const { token } = await prismaCreateAndAuthenticateUser({
      app,
      isAdmin: true,
    })

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym Title',
        description: 'Gym Description',
        phone: '123456789',
        latitude: -23.5505,
        longitude: 23.5505,
      })

    expect(response.statusCode).toEqual(201)
  })
})

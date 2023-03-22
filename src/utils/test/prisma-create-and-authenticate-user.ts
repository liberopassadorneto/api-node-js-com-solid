import { prisma } from '@/libs/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

interface PrismaCreateAndAuthenticateUserParams {
  app: FastifyInstance
  isAdmin?: boolean
}

export async function prismaCreateAndAuthenticateUser({
  app,
  isAdmin = false,
}: PrismaCreateAndAuthenticateUserParams) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}

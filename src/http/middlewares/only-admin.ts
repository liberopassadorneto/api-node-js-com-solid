import { FastifyReply, FastifyRequest } from 'fastify'

export async function onlyAdmin(req: FastifyRequest, reply: FastifyReply) {
  const { role } = req.user

  if (role !== 'ADMIN') {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}

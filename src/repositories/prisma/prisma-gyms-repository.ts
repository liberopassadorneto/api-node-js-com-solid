import { prisma } from '@/libs/prisma'
import { Prisma, Gym } from '@prisma/client'
import {
  FindManyNearbyParams,
  GymsRepository,
  SearchManyParams,
} from '../gyms.repository'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany({ query, page }: SearchManyParams): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    if (!gyms) {
      return []
    }

    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    // gyms with distance <= 10km
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ${latitude} = latitude AND ${longitude} = longitude
        OR (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= 10
    `

    if (!gyms) {
      return []
    }

    return gyms
  }
}

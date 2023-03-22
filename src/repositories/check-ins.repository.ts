import { CheckIn, Prisma } from '@prisma/client'

export interface FindByUserIdOnDateParams {
  userId: string
  date: Date
}

export interface FindManyByUserIdParams {
  userId: string
  page: number
}

export interface CheckInsRepository {
  findByUserIdOnDate({
    userId,
    date,
  }: FindByUserIdOnDateParams): Promise<CheckIn | null>
  findManyByUserId({ userId, page }: FindManyByUserIdParams): Promise<CheckIn[]>
  findById(id: string): Promise<CheckIn | null>
  countByUserId(userId: string): Promise<number>
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(data: CheckIn): Promise<CheckIn>
}

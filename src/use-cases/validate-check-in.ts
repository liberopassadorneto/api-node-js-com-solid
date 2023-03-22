import { CheckInsRepository } from '@/repositories/check-ins.repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found.error'
import { CheckIn } from '@prisma/client'
import dayjs = require('dayjs')
import { CheckInExpiredError } from './errors/check-in-expired.error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCheckInToNow = dayjs(new Date()).diff(
      dayjs(checkIn.created_at),
      'minute',
    )

    if (distanceInMinutesFromCheckInToNow > 20) {
      throw new CheckInExpiredError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}

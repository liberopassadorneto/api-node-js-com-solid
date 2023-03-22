import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms.repository'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins.error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckInUseCase', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id',
      title: 'Gym Title',
      description: 'Gym Description',
      phone: '123456789',
      latitude: -23.5505,
      longitude: 23.5505,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -23.5505,
      userLongitude: 23.5505,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // TDD
  // red: erro no teste
  // green: codar o mínimo para o teste passar
  // refactor: refatorar o código
  it('should not be able to check in twice in the same day', async () => {
    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -23.5505,
      userLongitude: 23.5505,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -23.5505,
        userLongitude: 23.5505,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -23.5505,
      userLongitude: 23.5505,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -23.5505,
      userLongitude: 23.5505,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a distance gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'Quality',
      description: 'Quality Description',
      latitude: new Decimal(-22.447826),
      longitude: new Decimal(-43.1610418),
      phone: '123456789',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-02',
        userLatitude: -22.5442798,
        userLongitude: -43.183025,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

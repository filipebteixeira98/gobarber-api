import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '78004584-7461-46ae-8843-8fd546e4e87d',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(
      '78004584-7461-46ae-8843-8fd546e4e87d',
    );
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();

    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '01f1ae16-ba46-4803-a624-8d6ee8cc028c',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '01f1ae16-ba46-4803-a624-8d6ee8cc028c',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

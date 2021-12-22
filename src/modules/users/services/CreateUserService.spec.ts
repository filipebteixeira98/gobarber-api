import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'ada07cae1ef69753c8a5ae883b29b8b7',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same e-mail from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '9ed2f3aa6d8d445573bdbd5a451548d4',
    });

    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'fe40c325a325a618385d04d5337f8ae3',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

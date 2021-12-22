import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '37ea7cec60090427cedba1bdade49fe1',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'profile.jpg',
    });

    expect(user.avatar).toBe('profile.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: '81dd27792bd2af0839d44040bd071746',
        avatarFilename: 'profile.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '25c7a033bbebaf3c1b79d94537352e11',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'profile.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'another-profile.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('profile.jpg');
    expect(user.avatar).toBe('another-profile.jpg');
  });
});

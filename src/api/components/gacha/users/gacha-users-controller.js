const gachaPrizesRepository = require('../prizes/gacha-prizes-repository');
const gachaUsersRepository = require('./gacha-users-repository').default;
const gachaUsersService = require('./gacha-users-repository').default;
const { errorResponder, errorTypes } = require('../../../../core/errors');
const { hashPassword } = require('../../../../utils/password');

async function getUsers(request, response, next) {
  try {
    const users = await gachaUsersService.getUsers();

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getUser(request, response, next) {
  try {
    const user = await gachaUsersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function createUser(request, response, next) {
  try {
    const {
      email,
      password,
      full_name: fullName,
      confirm_password: confirmPassword,
    } = request.body;

    if (!email) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Email is required');
    }

    if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Full name is required'
      );
    }

    if (await gachaUsersService.emailExists(email)) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    if (password.length < 8) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password must be at least 8 characters long'
      );
    }

    if (password !== confirmPassword) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password and confirm password do not match'
      );
    }

    const hashedPassword = await hashPassword(password);

    const success = await gachaUsersService.createUser(
      email,
      hashedPassword,
      fullName
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(request, response, next) {
  try {
    const { email, full_name: fullName } = request.body;

    const user = await gachaUsersService.getUser(request.params.id);
    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    if (!email) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Email is required');
    }

    if (!fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Full name is required'
      );
    }

    // Email must be unique, if it is changed
    if (email !== user.email && (await gachaUsersService.emailExists(email))) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    const success = await gachaUsersService.updateUser(
      request.params.id,
      email,
      fullName
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    return next(error);
  }
}

async function changePassword(request, response, next) {
  try {
    const { id } = request.params;
    const {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    } = request.body;

    const user = await gachaUsersService.getUser(id);
    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    if (!oldPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Old Password is required'
      );
    }
    const match = await passwordMatched(oldPassword, user.password);
    if (!match) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Wrong Password');
    }

    if (!newPassword || newPassword.length < 8) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Password must be at least 8 characters long'
      );
    }

    if (oldPassword === newPassword) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'New Password must be different from Old Password'
      );
    }

    if (newPassword !== confirmNewPassword) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Passwords do not match'
      );
    }

    const newPasswordHash = await hashPassword(newPassword);
    const success = await gachaUsersService.changePassword(id, newPasswordHash);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response
      .status(200)
      .json({ message: 'Successfully changed user password' });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(request, response, next) {
  try {
    const success = await gachaUsersService.deleteUser(request.params.id);

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
}

async function rollGacha(request, response) {
  try {
    const { id } = request.params;

    const user = await gachaUsersService.getUserByiD(id);
    if (!user) return response.status(400).json({ message: 'TIDAK TERSEDIA' });

    const countToday = await gachaUsersService.countGachaToday(user.email);
    if (countToday >= 5) {
      return response
        .status(400)
        .json({ message: 'Mencapai limit 5x per hari' });
    }

    const prizes = await gachaPrizesRepository.getPrizes();
    const availablePrizes = prizes.filter((p) => p.kuota - p.kuota_keluar > 0);

    if (availablePrizes.length === 0) {
      return response.status(404).json({ message: 'Maaf, hadiah telah habis' });
    }

    const wonPrize =
      availablePrizes[Math.floor(Math.random() * availablePrizes.length)];

    await gachaPrizesRepository.updateKuota(wonPrize._id);

    const history = await gachaUsersService.saveGachaHistory({
      userEmail: user.email,
      userNama: user.fullNama,
      prizeNama: wonPrize.nama,
      status: wonPrize.name.toLowerCase().includes('kurang berutung')
        ? 'lose'
        : 'win',
    });

    response.status(200).json({
      status: ' Gacha SUKSES',
      data: history,
    });
  } catch (error) {
    response.status(500).json({ status: 'error', message: error.message });
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  rollGacha,
};

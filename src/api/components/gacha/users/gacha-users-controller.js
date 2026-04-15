const gachaPrizesRepository = require('../prizes/gacha-prizes-repository');
const gachaUsersService = require('./gacha-users-service');

const { errorResponder, errorTypes } = require('../../../../core/errors');
const { hashPassword, passwordMatched } = require('../../../../utils/password');

async function getGachaUsers(request, response, next) {
  try {
    const users = await gachaUsersService.getGachaUsers();

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

async function getGachaUser(request, response, next) {
  try {
    const user = await gachaUsersService.getGachaUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User not found');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

async function createGachaUser(request, response, next) {
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

    const success = await gachaUsersService.createGachaUser(
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

async function updateGachaUser(request, response, next) {
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

    if (email !== user.email && (await gachaUsersService.emailExists(email))) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already exists'
      );
    }

    const success = await gachaUsersService.updateGachaUser(
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

    const user = await gachaUsersService.getGachaUser(id);
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

async function deleteGachaUser(request, response, next) {
  try {
    const success = await gachaUsersService.deleteGachaUser(request.params.id);

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

async function rollGacha(request, response, next) {
  try {
    const { id } = request.params;

    const user = await gachaUsersService.getGachaUser(id);
    if (!user) {
      return next(
        errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'TIDAK TERSEDIA')
      );
    }

    const countToday = await gachaUsersService.checkLimit(user.email);
    if (countToday >= 5) {
      return next(errorResponder(403, 'Mencapai limit 5x per hari'));
    }

    const prizes = await gachaPrizesRepository.getPrizes();
    const availablePrizes = prizes.filter((p) => p.kuota - p.kuotaKeluar > 0);

    if (availablePrizes.length === 0) {
      return next(errorResponder(404, 'Maaf, hadiah telah habis'));
    }

    const wonPrize =
      availablePrizes[Math.floor(Math.random() * availablePrizes.length)];

    const { _id: prizeId, nama: prizeNama } = wonPrize;
    await gachaPrizesRepository.updateKuota(prizeId);

    const history = await gachaUsersService.saveRoll({
      userEmail: user.email,
      userNama: user.fullNama,
      prizeNama,
      status: prizeNama.toLowerCase().includes('kurang beruntung')
        ? 'lose'
        : 'win',
    });

    return response.status(200).json({
      success: true,
      status: ' Gacha SUKSES',
      data: history,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getGachaUsers,
  getGachaUser,
  createGachaUser,
  updateGachaUser,
  changePassword,
  deleteGachaUser,
  rollGacha,
};

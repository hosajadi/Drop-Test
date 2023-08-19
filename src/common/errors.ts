function errorFormatter(
  type: string,
  englishMessage: string,
  persianMessage: string,
  auxiliaryFields: Record<string, string> = {},
): {
  type: string;
  message_en: string;
  message_fa: string;
} {
  return {
    type,
    message_en: englishMessage,
    message_fa: persianMessage,
    ...auxiliaryFields,
  };
}

export const errorsTypes = {
  user: {
    USER_ALREADY_EXIST: errorFormatter("user.USER_ALREADY_EXIST", "this user already exist", "این کاربر وجود دارد"),
    USER_INVALID_CREDENTIAL: errorFormatter(
      "user.USER_INVALID_CREDENTIAL",
      "username or password are incorrect",
      "نام کاربری یا گذرواژه اشتباه است",
    ),
    USER_NOT_ALLOWED: errorFormatter("user.USER_NOT_ALLOWED", "Needs higher permission", "به سطح دسترسی بالاتر نیاز است"),
    USER_NOT_FOUND: errorFormatter("user.USER_NOT_FOUND", "user not found", "کاربر پیدا نشد"),
  },
  device: {
    DEVICE_ALREADY_EXIST: errorFormatter("device.DEVICE_ALREADY_EXIST", "this device already exist", "این دستگاه وجود دارد"),
    DEVICE_INVALID_CREDENTIAL: errorFormatter(
      "device.DEVICE_INVALID_CREDENTIAL",
      "Username or password are incorrect",
      "نام کاربری یا گذرواژه اشتباه است",
    ),
    DEVICE_NOT_FOUND: errorFormatter("device.DEVICE_NOT_FOUND", "Device not found", "دستگاه پیدا نشد"),
    DEVICE_SETTING_NOT_FOUND: errorFormatter("device.DEVICE_SETTING_NOT_FOUND", "Device setting not found", "تنظیمات دستگاه پیدا نشد"),
  },
};

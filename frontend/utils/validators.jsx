// src/utils/validators.js

export const isValidEmail = (email) => {
  if (!email) return false;

  const value = email.trim().toLowerCase();

  // Practical real-world email regex
  const EMAIL_REGEX =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

  return EMAIL_REGEX.test(value);
};

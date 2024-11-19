const validatePasswords = (password, confirmPassword) => {
  return password === confirmPassword;
};

export default {
  validatePasswords,
}; 
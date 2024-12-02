export const validateEmail = (email) => {
  const regex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,7}$/;
  return regex.test(email);
}
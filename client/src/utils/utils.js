export const validateEmail = (email) => {
  const regex = /\b[A-Za-z0-9]+(?:[.\-_][A-Za-z0-9]+)*@[A-Za-z0-9-]+\.[A-Za-z]{2,7}\b/;
  return regex.test(email);
}


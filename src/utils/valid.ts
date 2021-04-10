const validEmail = (email: string): boolean => {
  if (!validText(email)) {
    return false;
  }

  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(email);
};

const validText = (text: string): boolean => {
  if (!text) {
    return false;
  } else if (text.trim().length === 0) {
    return false;
  }

  return true;
};

export {
  validEmail,
  validText
};

const validEmail = (email: string): boolean => {
  if (!validText(email)) {
    return false;
  }

  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  return re.test(email);
};

const validNumber = (number: number | string): boolean => {
  if (!number) {
    return false;
  }
  if (isNaN(Number(number))) {
    return false;
  }

  return true;
};

const validText = (text: string): boolean => {
  if (!text) {
    return false;
  } else if (text.trim().length === 0) {
    return false;
  }

  return true;
};

const validUuid = (uuid = ''): boolean => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

export {
  validEmail,
  validNumber,
  validText,
  validUuid,
};

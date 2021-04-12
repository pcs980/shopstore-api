import { v4 } from 'uuid';

const generateCode = (size = 5): string => {
  const numbers = [];
  while (numbers.length < size) {
    numbers.push(Math.floor(Math.random() * (9 - 1 + 1)) + 1);
  }
  return numbers.join('');
};

const generateUuid = (): string => {
  return v4();
};

export {
  generateCode,
  generateUuid,
};

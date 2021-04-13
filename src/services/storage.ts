import fs from 'fs';
import { InternalError } from '../errors';
import { generateUuid } from '../utils/generators';
import logger from '../utils/logger';

interface DecodedBase64 {
  type: string;
  data: Buffer;
}

const createPublicImageFolder = () => {
  try {
    fs.mkdirSync('public/images', { recursive: true });
  } catch (error) {
    console.log('mkdir error', error);
    if (error.code !== 'EEXIST')  {
      throw new InternalError(
        `MKDIR_${error.code}`,
        'Make directory error',
        error.message,
      )
    }
  }
};

const addExtension = (filename: string, mimetype = ''): string => {
  filename = removeExtension(filename);
  const slash = mimetype.indexOf('/');
  if (slash < 0) {
    return filename;
  }
  const extension = mimetype.substring(slash + 1);
  if (extension === 'jpeg') {
    return `${filename}.jpg`;
  }
  return `${filename}.${extension}`;
};

const removeExtension = (filename = ''): string => {
  const dot = filename.indexOf('.');
  if (dot < 0) {
    return filename;
  }
  return filename.substring(0, dot);
};

const decodeBase64 = (base64string: string): DecodedBase64 => {
  const matches: any = base64string.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  return {
    type: matches[1],
    data: Buffer.from(matches[2], 'base64'),
  };
};

const storeLocalFiles = async (base64files: string[]): Promise<string[]> => {
  createPublicImageFolder();

  const filenames: string[] = [];

  base64files.forEach((base64string) => {
    const decoded = decodeBase64(base64string);
    const filename = addExtension(generateUuid(), decoded.type);

    fs.writeFileSync(`public/images/${filename}`, decoded.data, { encoding: 'base64' });
    logger.debug(`Image stored: ${filename}`);

    return filenames.push(filename);
  });


  return filenames;
};

export {
  storeLocalFiles
};

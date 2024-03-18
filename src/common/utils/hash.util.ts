import * as bcrypt from 'bcrypt';
import { SALT_OR_ROUND } from '../../constants';

export const hashPass = async (data: string) => {
  const salt = await bcrypt.genSalt(SALT_OR_ROUND);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

export const comparePass = async (data: string, encrypted: string) => {
  const isMatch = await bcrypt.compare(data, encrypted);
  return isMatch;
};

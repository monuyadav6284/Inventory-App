import * as bcrypt from 'bcrypt';

export function encrypt(data: string) {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hashSync(data, SALT);
}

export function compareHash(data: string, hash: string) {
  return bcrypt.compareSync(data, hash);
}

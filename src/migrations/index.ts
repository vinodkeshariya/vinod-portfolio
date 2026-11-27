import * as migration_20261127_150258_initial from './20261127_150258_initial';

export const migrations = [
  {
    up: migration_20261127_150258_initial.up,
    down: migration_20261127_150258_initial.down,
    name: '20261127_150258_initial'
  },
];

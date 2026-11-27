import * as migration_20261127_150258_initial from './20261127_150258_initial';
import * as migration_20261127_160904_media_blob_prefix from './20261127_160904_media_blob_prefix';

export const migrations = [
  {
    up: migration_20261127_150258_initial.up,
    down: migration_20261127_150258_initial.down,
    name: '20261127_150258_initial',
  },
  {
    up: migration_20261127_160904_media_blob_prefix.up,
    down: migration_20261127_160904_media_blob_prefix.down,
    name: '20261127_160904_media_blob_prefix'
  },
];

import * as migration_20261127_150258_initial from './20261127_150258_initial';
import * as migration_20261127_160904_media_blob_prefix from './20261127_160904_media_blob_prefix';
import * as migration_20261127_170016_cms_content from './20261127_170016_cms_content';
import * as migration_20261127_170400_page_texts from './20261127_170400_page_texts';
import * as migration_20261127_170500_seed_content from './20261127_170500_seed_content';
import * as migration_20261127_182400_seed_page_texts from './20261127_182400_seed_page_texts';

export const migrations = [
  {
    up: migration_20261127_150258_initial.up,
    down: migration_20261127_150258_initial.down,
    name: '20261127_150258_initial',
  },
  {
    up: migration_20261127_160904_media_blob_prefix.up,
    down: migration_20261127_160904_media_blob_prefix.down,
    name: '20261127_160904_media_blob_prefix',
  },
  {
    up: migration_20261127_170016_cms_content.up,
    down: migration_20261127_170016_cms_content.down,
    name: '20261127_170016_cms_content',
  },
  {
    up: migration_20261127_170400_page_texts.up,
    down: migration_20261127_170400_page_texts.down,
    name: '20261127_170400_page_texts',
  },
  {
    up: migration_20261127_170500_seed_content.up,
    down: migration_20261127_170500_seed_content.down,
    name: '20261127_170500_seed_content',
  },
  {
    up: migration_20261127_182400_seed_page_texts.up,
    down: migration_20261127_182400_seed_page_texts.down,
    name: '20261127_182400_seed_page_texts'
  },
];

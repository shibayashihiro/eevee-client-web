import fs from 'fs';
import path from 'path';

import { parse } from 'csv-parse/sync';

export type App = {
  appName: string;
  channelId: string;
};

const records = parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'apps.csv')), {
  columns: true,
  skip_empty_lines: true,
});

const isValidRecord = (record: unknown): record is { app_name: string; channel_id: string } => {
  if (record === null) {
    return false;
  }
  const r = record as Record<string, unknown>;
  if (typeof r.app_name !== 'string' || typeof r.channel_id !== 'string') {
    return false;
  }
  return true;
};

export const apps: App[] = records.filter(isValidRecord).map((record) => ({
  appName: record.app_name,
  channelId: record.channel_id,
}));

import fetch from 'cross-fetch';

if (!global.fetch) {
  (global as any).fetch = fetch;
}

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Node.js 22+ ships a native localStorage that requires --localstorage-file to
// function. Vitest's populateGlobal skips overriding it with the jsdom version
// because it already exists in the global scope. Replace it here with a simple
// in-memory implementation so Storage APIs work in all tests.
const _store = {};
const localStorageMock = {
  getItem: (key) => Object.prototype.hasOwnProperty.call(_store, key) ? _store[key] : null,
  setItem: (key, value) => { _store[key] = String(value); },
  removeItem: (key) => { delete _store[key]; },
  clear: () => { Object.keys(_store).forEach((k) => delete _store[k]); },
  get length() { return Object.keys(_store).length; },
  key: (index) => Object.keys(_store)[index] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

afterEach(() => {
  cleanup();
  localStorageMock.clear();
});

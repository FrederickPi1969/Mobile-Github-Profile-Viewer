import { GIT_TOKEN, fetchData, GitUser } from '../src/model';

const fetch = require('jest-fetch-mock');

beforeEach(() => {
  fetch.resetMocks();
});

test('1. Test dotenv loaded authentication TOKEN correctly', () => {
  expect(GIT_TOKEN.slice(0, 5)).toBe('b0db4');
});

test('2. Test fetching empty string', () => {
  // empty input will lead to null user returned
  fetchData('').then((user) => { expect(user).toBe(null); });
});

test('3. Test fetching non-existing user', () => {
  // non-existing userLogin will lead to null user returned
  fetchData('FrederickPi11111111').then((user) => { expect(user).toBe(null); });
});

test('4. Test fetching valid user', () => {
  // querying non-existing userLogin will cause null user returned
  fetchData('BillyZhaohengLi').then((user) => {
    expect(user.userLogin).toBe('BillyZhaohengLi');
    expect(user.userName).toBe(null);
    expect(user.bio).toBe(null);
    expect(user.repo.edges.length).toBe(19);
    expect(user.followers.edges.length).toBe(5);
  });
});

test('5. Test fetching with bad authorization', () => {
  // wrong authorization token will cause null user returned
  fetchData('BillyZhaohengLi', 'aaaaaaaaaaaaaaaa').then((user) => {
    expect(user).toBe(null);
  });
});

test('6. Test GitUser object parse json file correctly', () => {
  const json = JSON.parse('{"data" : {"user": {"name" :"a", "login":"b"}}}');
  const user = new GitUser(json);
  expect(user.userName).toBe('a');
  expect(user.userLogin).toBe('b');
});

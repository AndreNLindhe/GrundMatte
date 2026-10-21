const test = require('node:test');
const assert = require('node:assert/strict');
const {
  tolkaTal, normaliseraIntervall, nyUppgift, tolkaSvar, tidKvar, formateraTid
} = require('../js/multiplikation-logik.js');

test('tolkaTal', () => {
  assert.equal(tolkaTal('345', 1), 345);
  assert.equal(tolkaTal(' 7 ', 1), 7);
  assert.equal(tolkaTal('', 4), 4);
  assert.equal(tolkaTal('-3', 4), 4);
  assert.equal(tolkaTal('2.5', 4), 4);
  assert.equal(tolkaTal('abc', 4), 4);
  assert.equal(tolkaTal('0', 4), 0);
});

test('normaliseraIntervall byter plats', () => {
  assert.deepEqual(normaliseraIntervall(345, 11), { fran: 11, till: 345 });
  assert.deepEqual(normaliseraIntervall(2, 5), { fran: 2, till: 5 });
});

test('nyUppgift håller sig i intervallet', () => {
  for (let i = 0; i < 1000; i++) {
    const { a, b } = nyUppgift(11, 345, null);
    assert.ok(a >= 11 && a <= 345 && b >= 11 && b <= 345 && Number.isInteger(a) && Number.isInteger(b));
  }
});

test('nyUppgift upprepar inte förra', () => {
  for (let i = 0; i < 500; i++) {
    const u = nyUppgift(2, 3, { a: 2, b: 3 });
    assert.notDeepEqual(u, { a: 2, b: 3 });
  }
});

test('nyUppgift med ett enda tal', () => {
  assert.deepEqual(nyUppgift(7, 7, { a: 7, b: 7 }), { a: 7, b: 7 });
});

test('nyUppgift når båda ändpunkterna', () => {
  assert.deepEqual(nyUppgift(1, 10, null, () => 0), { a: 1, b: 1 });
  assert.deepEqual(nyUppgift(1, 10, null, () => 0.9999), { a: 10, b: 10 });
});

test('tolkaSvar', () => {
  assert.equal(tolkaSvar(''), null);
  assert.equal(tolkaSvar('   '), null);
  assert.equal(tolkaSvar(' 28 '), 28);
  assert.equal(tolkaSvar('028'), 28);
  assert.equal(tolkaSvar('119025'), 119025);
  assert.ok(Number.isNaN(tolkaSvar('2e1')));
  assert.ok(Number.isNaN(tolkaSvar('-28')));
  assert.ok(Number.isNaN(tolkaSvar('28,0')));
});

test('tidKvar och formateraTid', () => {
  assert.equal(tidKvar(10000, 0), 10);
  assert.equal(tidKvar(10000, 9001), 1);
  assert.equal(tidKvar(10000, 12000), 0);
  assert.equal(formateraTid(120), '2:00');
  assert.equal(formateraTid(83), '1:23');
  assert.equal(formateraTid(5), '0:05');
});

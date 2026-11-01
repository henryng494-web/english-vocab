/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const moduleFixture = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/subscription-trial.ts','utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { module: moduleFixture, exports: moduleFixture.exports, Number });
const { eligibleFreeTrial } = moduleFixture.exports;
const intro = { price: 0, periodUnit: 'WEEK', periodNumberOfUnits: 1, cycles: 1 };
for (const eligibility of [undefined, 0, 1, 3]) {
  test(`does not promise a free trial for eligibility ${eligibility}`, () => {
    assert.equal(eligibleFreeTrial(intro, eligibility), undefined);
  });
}
test('eligible free trials use the actual StoreKit duration, including changes from seven days', () => {
  assert.equal(JSON.stringify(eligibleFreeTrial(intro,2)), JSON.stringify({unit:'week',count:1}));
  assert.equal(JSON.stringify(eligibleFreeTrial({...intro,periodUnit:'MONTH',periodNumberOfUnits:3},2)),JSON.stringify({unit:'month',count:3}));
});
test('paid introductory offers are not free trials', () => {
  assert.equal(eligibleFreeTrial({...intro,price:0.99},2),undefined);
});
test('missing offers and incomplete or invalid durations never advertise a trial', () => {
  for (const value of [null, undefined, {price:0}, {...intro,periodUnit:'UNKNOWN'}, {...intro,periodNumberOfUnits:0}, {...intro,cycles:NaN}]) {
    assert.equal(eligibleFreeTrial(value,2),undefined);
  }
});

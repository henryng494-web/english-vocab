/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads transpiled application modules. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks, env = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(source, {
    module: loadedModule, exports: loadedModule.exports,
    require(id) { if (id in mocks) return mocks[id]; throw new Error(`Unexpected dependency ${id}`); },
    window: { setTimeout, clearTimeout, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} },
    Event: class {}, console, process: { env },
  }, { filename: file });
  return loadedModule.exports;
}

test('nickname synchronization stops after USER_UPDATED instead of writing forever', async () => {
  const user = { user_metadata: {} };
  let writes = 0;
  const lib = load('src/lib/learner-nickname.ts', {
    '@/lib/supabase/client': { createClientIfConfigured: () => ({ auth: {
      getSession: async () => ({ data: { session: { user } } }),
      updateUser: async ({ data }) => { writes++; user.user_metadata = data; },
    } }) },
    '@/lib/user-display-name': {},
  });
  await lib.syncLearnerNicknameToSupabase('Henry');
  // The auth provider synchronizes again on USER_UPDATED and on refocus.
  await lib.syncLearnerNicknameToSupabase('Henry');
  await lib.syncLearnerNicknameToSupabase('Henry');
  assert.equal(writes, 1);
});

test('persisted session is applied before auth becomes ready when INITIAL_SESSION was missed', async () => {
  const effects = [], state = [], transitions = [];
  let onAuth;
  const session = { user: { id: 'test-user', email: 'test@example.invalid' } };
  const react = {
    createContext: () => ({ Provider: {} }),
    useState(initial) { const i = state.length; state.push(typeof initial === 'function' ? initial() : initial); return [state[i], value => { state[i] = value; transitions.push([...state]); }]; },
    useEffect: fn => effects.push(fn), useCallback: fn => fn, useMemo: fn => fn(),
  };
  const provider = load('src/context/AuthSessionContext.tsx', {
    react, 'react/jsx-runtime': { jsx: () => null },
    '@/lib/supabase/client': { createClientIfConfigured: () => ({ auth: {
      onAuthStateChange: callback => { onAuth = callback; return { data: { subscription: { unsubscribe() {} } } }; },
      getSession: async () => ({ data: { session } }),
    } }) },
    '@/lib/supabase/env': { isSupabaseConfigured: () => true },
    '@/lib/supabase/wait-auth-initialized': { waitForSupabaseAuthInitialized: async () => {} },
    '@/lib/user-display-name': { readLearnerDisplayName: () => '', displayNameFromUser: () => 'Henry', persistLearnerDisplayName() {} },
    '@/lib/learner-nickname': { syncLearnerNicknameToSupabase: async () => {} },
    '@/lib/auth-session': { persistAuthSignedInFlag() {} },
    '@/lib/pro-access': { writeProCache() {} },
    '@/lib/review-session': { loadReviewSessionFast: async () => {} },
  });
  provider.AuthSessionProvider({ children: null });
  const cleanup = effects.map(fn => fn());
  try {
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(state[1], session);
    assert.ok(transitions.every(s => !s[0] || s[1] === session), 'must not release signed-out UI before stored session is applied');
    onAuth('SIGNED_OUT', null);
    assert.equal(state[1], session, 'auth event side effects must be deferred outside the callback');
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(state[1], null, 'sign-out must still clear the session');
  } finally { cleanup.forEach(fn => fn?.()); }
});

for (const configuredEntitlement of [undefined, 'pro', 'jungle_jokers_pro']) {
  test(`iOS purchase unlocks existing dashboard entitlement (env=${configuredEntitlement})`, async () => {
    const lib = load('src/lib/revenuecat.ts', {
      '@capacitor/core': { Capacitor: { isNativePlatform: () => true, getPlatform: () => 'ios' } },
      '@revenuecat/purchases-capacitor': { Purchases: {
        configure: async () => {},
        getCustomerInfo: async () => ({ customerInfo: { entitlements: { active: {
          jungle_jokers_pro: { expirationDate: null, willRenew: false },
        } } } }),
      } },
    }, { NEXT_PUBLIC_REVENUECAT_API_KEY_IOS: 'appl_test_fixture', NEXT_PUBLIC_REVENUECAT_ENTITLEMENT: configuredEntitlement });
    assert.equal((await lib.getProStatus()).isPro, true);
  });
}

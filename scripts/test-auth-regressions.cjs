/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads transpiled application modules. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks, env = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(source, {
    module: loadedModule, exports: loadedModule.exports,
    require(id) { if (id in mocks) return mocks[id]; throw new Error(`Unexpected dependency ${id}`); },
    window: { setTimeout, clearTimeout, addEventListener() {}, removeEventListener() {}, dispatchEvent() {} },
    Event: class {}, console, process: { env }, ...globals,
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

function loadAccess({ mobile = false, native = false, host = 'localhost', pro = true, signedIn = true, env = {} } = {}) {
  const window = { location: { hostname: host }, dispatchEvent() {} };
  const localStorage = { getItem: key => key === 'jj-pro-status-v1' ? (pro ? '1' : '0') : null };
  const file = 'src/lib/pro-access.ts';
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const result = { exports: {} };
  const mocks = {
    '@/lib/auth-session': { isGuestUser: () => !signedIn, isAuthSignedInSync: () => signedIn },
    '@/lib/supabase/env': { isSupabaseConfigured: () => true },
    '@/lib/api-base': { IS_MOBILE_BUILD: mobile },
    '@/lib/revenuecat': { isNativePlatform: () => native, isRevenueCatAvailable: () => native, REVENUECAT_MOCK_MODE: false },
  };
  vm.runInNewContext(source, { module: result, exports: result.exports, require: id => mocks[id], process: { env: { NODE_ENV: 'production', ...env } }, window, localStorage });
  return result.exports;
}

for (const platform of [{ mobile: true, native: true }, { mobile: true, native: false }, { mobile: false, native: true }]) {
  test(`native localhost honors Pro entitlement instead of web QA limits (${JSON.stringify(platform)})`, () => {
    const access = loadAccess({ ...platform, env: { NEXT_PUBLIC_FORCE_FREE_GATING: '1' } });
    assert.equal(access.isWebFreeLimitQaMode(), false);
    assert.equal(access.isUsageLimited(), false);
    assert.equal(access.isGatingActive(), true);
  });
}

test('browser localhost still has QA limits; native Free and guests remain limited', () => {
  assert.equal(loadAccess().isWebFreeLimitQaMode(), true);
  assert.equal(loadAccess({ mobile: true, pro: false }).isUsageLimited(), true);
  assert.equal(loadAccess({ mobile: true, signedIn: false }).isUsageLimited(), true);
});

test('post-login navigation keeps the native document and its auth provider alive', () => {
  const calls = [];
  const nav = load('src/lib/auth-navigation.ts', {
    '@/lib/api-base': { IS_MOBILE_BUILD: true },
    '@/lib/auth-redirect': { isMobileAuthContext: () => true },
  });
  nav.navigateAfterAuth('/account', { replace: path => calls.push(path) });
  assert.deepEqual(calls, ['/account/']);
});

function paywallHarness(initialPro) {
  const state = [], refs = [], effects = [], listeners = new Map();
  let stateIndex = 0, refIndex = 0, mounted = false, cached = initialPro, resolveCheck;
  const check = new Promise(resolve => { resolveCheck = resolve; });
  const browser = {
    setTimeout, clearTimeout,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
    history: { length: 1 },
  };
  const react = {
    createContext: () => ({ Provider: 'Provider' }),
    useState(initial) { const i = stateIndex++; if (!(i in state)) state[i] = initial; return [state[i], value => { state[i] = value; }]; },
    useRef(initial) { const i = refIndex++; return refs[i] ??= { current: initial }; },
    useEffect(fn) { if (!mounted) effects.push(fn); },
    useCallback: fn => fn, useMemo: fn => fn(),
  };
  const provider = load('src/context/PaywallContext.tsx', {
    react, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    '@/components/paywall/PaywallContent': { PaywallContent: 'PaywallContent' },
    '@/hooks/use-i18n': { useI18n: () => ({ t: key => key }) },
    '@/context/AuthSessionContext': { useAuthSession: () => ({ ready: true, isSignedIn: true }), AUTH_SESSION_EVENT: 'auth' },
    '@/lib/auth-session': { isGuestUser: () => false },
    '@/lib/pro-access': {
      isGatingActive: () => true, isUsageLimited: () => !cached,
      readProCache: () => cached,
      writeProCache(value) { cached = value; listeners.get('pro')?.(); },
      PRO_STATUS_EVENT: 'pro',
    },
    '@/lib/supabase/env': { isSupabaseConfigured: () => true },
    '@/lib/revenuecat': { getProStatus: () => check },
    'next/navigation': { useRouter: () => ({}), usePathname: () => '/account' },
  }, {}, { window: browser, document: { body: { classList: { add() {}, remove() {} } } } });
  const render = () => { stateIndex = 0; refIndex = 0; const tree = provider.PaywallProvider({ children: null }); mounted = true; return tree; };
  const tree = render();
  const cleanups = effects.map(fn => fn());
  return { render, tree, resolveCheck, cache: () => cached, cleanup: () => cleanups.forEach(fn => fn?.()) };
}

function findPaywall(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.type === 'PaywallContent') return node;
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findPaywall(child);
    if (found) return found;
  }
  return null;
}

test('purchase immediately updates Account Pro; older pre-purchase check cannot revoke it', async () => {
  const harness = paywallHarness(false);
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    harness.render().props.value.openPaywall();
    const paywall = findPaywall(harness.render());
    assert.ok(paywall);
    paywall.props.onProChange({ isPro: true, checked: true });
    assert.equal(harness.render().props.value.isPro, true);
    assert.equal(harness.render().props.value.isFree, false);
    harness.resolveCheck({ isPro: false, checked: true });
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(harness.render().props.value.isPro, true);
    assert.equal(harness.cache(), true);
  } finally { harness.cleanup(); }
});

test('unavailable entitlement check preserves confirmed cached Pro access', async () => {
  const harness = paywallHarness(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    harness.resolveCheck({ isPro: false, checked: false });
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(harness.render().props.value.isPro, true);
    assert.equal(harness.cache(), true);
  } finally { harness.cleanup(); }
});

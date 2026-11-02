/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness loads transpiled application modules. */
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

for (const scenario of ['verified', 'expired', 'unconfirmed', 'unavailable', 'missing token']) {
  test(`email confirmation result: ${scenario}`, async () => {
    let verified = 0;
    const route = load('src/app/auth/callback/route.ts', {
      '@/lib/supabase/server': { createClient: async () => ({ auth: {
        verifyOtp: async input => {
          verified++;
          assert.equal(input.type, 'email');
          assert.equal(input.token_hash, 'fixture-token');
          if (scenario === 'unavailable') throw new Error('network unavailable');
          return { data: { user: scenario === 'unconfirmed' ? null : { email_confirmed_at: '2026-11-02' } }, error: scenario === 'expired' ? { message: 'expired' } : null };
        },
        exchangeCodeForSession() { throw new Error('PKCE must not be needed for email confirmation'); },
      } }) },
      'next/server': { NextResponse: { redirect() { throw new Error('Confirmation must stay on result page'); } } },
    }, {}, { URL, Response });
    const response = await route.GET(new Request(`https://example.invalid/auth/callback?type=email${scenario === 'missing token' ? '' : '&token_hash=fixture-token'}&next=https://untrusted.invalid`));
    const html = await response.text();
    assert.equal(response.status, scenario === 'verified' ? 200 : 400);
    assert.equal(html.includes('Email verified successfully'), scenario === 'verified');
    assert.equal(verified, scenario === 'missing token' ? 0 : 1);
    assert.ok(!html.includes('fixture-token') && !html.includes('untrusted.invalid'));
    assert.equal(response.headers.get('cache-control'), 'no-store, private');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  });
}

test('existing password recovery callback still redirects to isolated reset page', async () => {
  const route = load('src/app/auth/callback/route.ts', {
    '@/lib/supabase/server': { createClient() { throw new Error('Recovery must not exchange a code'); } },
    'next/server': { NextResponse: { redirect: url => url } },
  }, {}, { URL, Response });
  assert.equal(await route.GET(new Request('https://example.invalid/auth/callback?next=/auth/reset-password')), 'https://example.invalid/auth/reset-password');
});

for (const scenario of ['missing session', 'server rejects deletion']) {
  test(`account deletion preserves local data when ${scenario}`, async () => {
    let cleared = false, navigated = false, requested = false;
    const lib = load('src/lib/delete-account.ts', {
      '@/lib/api-base': { apiUrl: path => path },
      '@/lib/supabase/client': { createClientIfConfigured: () => ({ auth: {
        getSession: async () => ({ data: { session: scenario === 'missing session' ? null : { access_token: 'fixture' } } }),
      } }) },
    }, {}, {
      localStorage: { clear() { cleared = true; } },
      sessionStorage: { clear() { cleared = true; } },
      window: { location: { replace() { navigated = true; } } },
      fetch: async () => { requested = true; return { ok: false }; },
    });
    await assert.rejects(lib.deleteAccountAndData());
    assert.equal(cleared, false);
    assert.equal(navigated, false);
    assert.equal(requested, scenario !== 'missing session');
  });
}

for (const delivered of [false, true]) {
  test(`feedback reports delivery ${delivered ? 'success' : 'failure'} from webhook`, async () => {
    const route = load('src/app/api/feedback/route.ts', {
      'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    }, { FEEDBACK_WEBHOOK_URL: 'https://example.invalid/feedback' }, {
      File: class {}, FormData,
      fetch: async () => ({ ok: delivered }),
    });
    const result = await route.POST({
      formData: async () => new Map([['message', 'Example report']]),
      headers: { get: () => null },
    });
    assert.equal(result.status, delivered ? 200 : 502);
    assert.equal(result.body.ok, delivered ? true : undefined);
  });
}

function load(file, mocks, env = {}, globals = {}) {
  const scopeFixture = {
    learnerScope: () => 'fixture:0', isLearnerScopeCurrent: () => true,
    learnerUserId: () => 'fixture-user', activateLearnerScope() {}, clearCurrentLearnerData() {},
    learnerStorage: globals.localStorage ?? { getItem: () => null, setItem() {}, removeItem() {} },
  };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(source, {
    module: loadedModule, exports: loadedModule.exports,
    require(id) { if (id === '@/lib/subscription-trial') return load('src/lib/subscription-trial.ts', {}); if (id === '@/lib/learner-storage' && !(id in mocks)) return scopeFixture; if (id in mocks) return mocks[id]; throw new Error(`Unexpected dependency ${id}`); },
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
    '@/lib/learner-storage': { learnerStorage: localStorage },
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

function scopedHarness(seed = {}) {
  const values = new Map(Object.entries(seed));
  const localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
  return { ...load('src/lib/learner-storage.ts', {}, {}, { localStorage }), values, localStorage };
}

test('upgrade migrates progress once; A → guest → B → A isolates every personal key', () => {
  const scope = scopedHarness({ 'english-vocab-learning': 'legacy progress', 'jj-pro-status-v1': '1' });
  scope.activateLearnerScope('A');
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), 'legacy progress');
  assert.equal(scope.learnerStorage.getItem('jj-pro-status-v1'), null, 'legacy Pro must be rechecked');
  for (const key of scope.PERSONAL_STORAGE_KEYS) scope.learnerStorage.setItem(key, `A:${key}`);
  const oldRun = scope.learnerScope();
  scope.activateLearnerScope(null);
  for (const key of scope.PERSONAL_STORAGE_KEYS) assert.equal(scope.learnerStorage.getItem(key), null);
  scope.learnerStorage.setItem('english-vocab-learning', 'guest progress');
  scope.activateLearnerScope('B');
  for (const key of scope.PERSONAL_STORAGE_KEYS) {
    assert.equal(scope.learnerStorage.getItem(key), null);
    scope.learnerStorage.setItem(key, `B:${key}`);
  }
  scope.activateLearnerScope('A');
  assert.equal(scope.isLearnerScopeCurrent(oldRun), false, 'old A requests must remain stale after returning to A');
  for (const key of scope.PERSONAL_STORAGE_KEYS) assert.equal(scope.learnerStorage.getItem(key), `A:${key}`);
  scope.clearCurrentLearnerData();
  scope.activateLearnerScope('B');
  for (const key of scope.PERSONAL_STORAGE_KEYS) assert.equal(scope.learnerStorage.getItem(key), `B:${key}`);
  scope.activateLearnerScope(null);
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), 'guest progress');
});

test('guest upgrade preserves guest progress without assigning it to a later account', () => {
  const scope = scopedHarness({ 'english-vocab-learning': 'guest progress' });
  scope.activateLearnerScope(null);
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), 'guest progress');
  scope.activateLearnerScope('B');
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), null);
  scope.activateLearnerScope(null);
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), 'guest progress');
});

test('unattributed legacy signed-in records stay backed up and cannot leak into the next account', () => {
  const scope = scopedHarness({ 'english-vocab-learning': 'private progress', 'jj-auth-signed-in-v1': '1' });
  scope.activateLearnerScope(null);
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), null);
  scope.activateLearnerScope('B');
  assert.equal(scope.learnerStorage.getItem('english-vocab-learning'), null);
  assert.equal(scope.values.get('english-vocab-learning'), 'private progress');
});

test('review summary ignores a response from a previous account, including after A → B → A', async () => {
  const scope = scopedHarness();
  scope.activateLearnerScope('A');
  let resolve;
  const store = load('src/lib/review-due-store.ts', {
    '@/lib/learner-storage': scope,
    '@/lib/review-schedule': { getReviewBadgeDueCount: rows => rows.length, countDueReviewWordKeys: rows => rows.length },
    '@/lib/review-session': { fetchLearningSummary: () => new Promise(done => { resolve = done; }) },
  });
  const pending = store.refreshReviewDueSummary();
  scope.activateLearnerScope('B');
  scope.activateLearnerScope('A');
  resolve([{ word: 'private' }]);
  assert.equal(await pending, 0);
  assert.equal(store.getCachedLearningSummary().length, 0);
});

test('RevenueCat serializes account switches, configures once and rejects a stale entitlement response', async () => {
  const scope = scopedHarness();
  scope.activateLearnerScope('A');
  let configured = 0, sdkUser, resolveInfo;
  const rc = load('src/lib/revenuecat.ts', {
    '@/lib/learner-storage': scope,
    '@capacitor/core': { Capacitor: { isNativePlatform: () => true, getPlatform: () => 'ios' } },
    '@revenuecat/purchases-capacitor': { Purchases: {
      configure: async options => { configured++; sdkUser = options.appUserID; },
      logIn: async options => { sdkUser = options.appUserID; },
      logOut: async () => { sdkUser = null; },
      getCustomerInfo: () => new Promise(done => { resolveInfo = done; }),
    } },
  }, { NEXT_PUBLIC_REVENUECAT_API_KEY_IOS: 'appl_fixture' });
  await Promise.all([rc.ensureRevenueCatUser('A'), rc.ensureRevenueCatUser('A')]);
  assert.equal(configured, 1);
  const pending = rc.getProStatus();
  await new Promise(resolve => setTimeout(resolve, 0));
  scope.activateLearnerScope('B');
  await rc.ensureRevenueCatUser('B');
  resolveInfo({ customerInfo: { entitlements: { active: { jungle_jokers_pro: {} } } } });
  assert.equal((await pending).checked, false);
  assert.equal(sdkUser, 'B');
  await rc.ensureRevenueCatUser(null);
  assert.equal(sdkUser, null);
});

test('password recovery rejects ordinary sessions, expired links and mismatched passwords', async () => {
  const recovery = load('src/lib/password-recovery.ts', {}, {}, { URLSearchParams, URL });
  let sessionSets = 0;
  const client = { auth: { setSession: async () => { sessionSets++; return { data: { session: {} }, error: null }; } } };
  await assert.rejects(recovery.initializePasswordRecovery(client, 'https://example.invalid/auth/reset-password'));
  await assert.rejects(recovery.initializePasswordRecovery(client, 'https://example.invalid/#type=signup&access_token=a&refresh_token=r'));
  await recovery.initializePasswordRecovery(client, 'https://example.invalid/#type=recovery&access_token=a&refresh_token=r');
  assert.equal(sessionSets, 1);
  client.auth.setSession = async () => ({ data: { session: null }, error: { message: 'expired' } });
  await assert.rejects(recovery.initializePasswordRecovery(client, 'https://example.invalid/#type=recovery&access_token=a&refresh_token=r'));
  assert.equal(recovery.validRecoveryPassword('abcdefgh', 'abcdefgh'), true);
  assert.equal(recovery.validRecoveryPassword('short', 'short'), false);
  assert.equal(recovery.validRecoveryPassword('abcdefgh', 'different'), false);
});

test('email recovery callback reaches the public password page without a PKCE exchange', async () => {
  const callback = load('src/app/auth/callback/route.ts', {
    '@/lib/supabase/server': { createClient: () => { throw new Error('must not exchange an implicit recovery link'); } },
    'next/server': { NextResponse: { redirect: location => ({ location }) } },
  }, {}, { URL });
  const response = await callback.GET({ url: 'https://www.junglejokers.com/auth/callback?next=/auth/reset-password' });
  assert.equal(response.location, 'https://www.junglejokers.com/auth/reset-password');
});

test('feedback without a configured receiver reports email fallback instead of false delivery', async () => {
  const route = load('src/app/api/feedback/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
  }, {}, { File: class {} });
  const result = await route.POST({ formData: async () => new Map([['message', 'Example report']]), headers: { get: () => null } });
  assert.equal(result.status, 503);
  assert.match(result.body.error, /support@junglejokers.com/);
});

test('cold-start guest clears a persisted identified RevenueCat user instead of trusting an anonymous assumption', async () => {
  let loggedOut = 0;
  const rc = load('src/lib/revenuecat.ts', {
    '@capacitor/core': { Capacitor: { isNativePlatform: () => true, getPlatform: () => 'ios' } },
    '@revenuecat/purchases-capacitor': { Purchases: {
      configure: async () => {},
      getAppUserID: async () => ({ appUserID: 'previous-account' }),
      logOut: async () => { loggedOut++; },
    } },
  }, { NEXT_PUBLIC_REVENUECAT_API_KEY_IOS: 'appl_fixture' });
  assert.equal(await rc.ensureRevenueCatUser(null), true);
  assert.equal(loggedOut, 1);
  assert.equal(await rc.ensureRevenueCatUser(null), true);
  assert.equal(loggedOut, 1);
});

test('actual Supabase recovery email request uses implicit flow without a WebView PKCE verifier', async () => {
  const requests = [];
  const lib = load('src/lib/supabase/client.ts', {
    '@supabase/ssr': {},
    '@supabase/supabase-js': require('@supabase/supabase-js'),
    '@/lib/auth-errors': { logSupabaseAuthError() {} },
    '@/lib/supabase/auth-storage-mode': {},
    '@/lib/supabase/capacitor-auth-storage': {},
    '@/lib/network-status': { isBrowserOfflineSignal: () => false, isUnreliableNavigatorOnLine: () => false },
    '@/lib/supabase/env': { getSupabaseConfigOptional: () => ({ url: 'https://fixture.supabase.co', anonKey: 'fixture-key' }) },
    '@/lib/supabase/mobile-auth-proxy': { shouldProxySupabaseAuthFetch: () => false },
  }, {}, {
    URL, Request,
    fetch: async (url, init) => { requests.push({ url, body: JSON.parse(init.body) }); return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); },
  });
  const recovery = lib.createPasswordRecoveryClient();
  const redirectTo = 'https://www.junglejokers.com/auth/callback?next=/auth/reset-password';
  const result = await recovery.auth.resetPasswordForEmail('test@example.invalid', { redirectTo });
  assert.equal(result.error, null);
  assert.equal(requests.length, 1);
  assert.equal(new URL(requests[0].url).searchParams.get('redirect_to'), redirectTo);
  assert.ok(requests[0].body.code_challenge == null, 'recovery must not require a stored verifier');
  assert.equal(requests[0].body.email, 'test@example.invalid');
});

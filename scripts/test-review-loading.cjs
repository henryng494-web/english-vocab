/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
function load(path,mocks,globals={}){
 const m={exports:{}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
  module:m,exports:m.exports,require(id){if(id in mocks)return mocks[id];throw new Error('Unexpected dependency '+id);},console,Map,Set,Promise,...globals,
 });return m.exports;
}
function hydrateFixture(cache,standard=null){
 return load('src/lib/review-word-hydrate.ts',{
  '@/data/preset-word-details-static':{getStaticWordDetail:()=>null},
  '@/data/preset-rank-map':{getPresetRankLite:()=>1},
  '@/data/standard-vocab':{hasQualityStandardVocab:()=>!!standard},
  '@/lib/app-settings':{readAppSettings:()=>({learnerLocale:'vi'})},
  '@/lib/discover-word-cache':{getDiscoverWordCacheMemory:()=>cache},
  '@/lib/multilang-record':{mergeLegacyViIntoMeanings:()=>({}),hasStoredLocaleMeaning:()=>false},
  '@/lib/standard-discover-fields':{standardToDiscoverFieldsWithRank:()=>standard},
  '@/lib/image-keyword':{resolveImageSearchKeyword:()=> 'pay'},
  '@/lib/card-content-prefetch':{prefetchCardContent(){}},
  '@/lib/parse-examples':{serializeExamples:JSON.stringify},
  '@/lib/unsplash':{isPlaceholderIllustrationUrl:()=>false,isRealCardImageUrl:()=>true},
 },{fetch(){throw new Error('Local hydrate must not use the network');}});
}
test('a meaning-only review card reuses cached examples, IPA and Family immediately',()=>{
 const cache=new Map([['pay',{word:'pay',vietnamese_meaning:'cache meaning',examples:'I pay the bill.',phonetic:'/peɪ/',word_type:'verb',word_family:[{word:'payment'}]}]]);
 const word={word:'pay',vietnamese_meaning:'Trả tiền',examples:'',phonetic:'',word_type:'',learning_status:'review'};
 const result=hydrateFixture(cache).hydrateReviewWordLocal(word);
 assert.equal(result.examples,'I pay the bill.');assert.equal(result.phonetic,'/peɪ/');assert.equal(result.word_family[0].word,'payment');
 assert.equal(result.vietnamese_meaning,'Trả tiền');assert.equal(result.learning_status,'review');assert.equal(word.examples,'');
});
test('curated meanings keep priority while missing examples come from cache',()=>{
 const cache=new Map([['pay',{word:'pay',vietnamese_meaning:'stale',examples:'I pay the bill.',phonetic:'/peɪ/',word_type:'verb'}]]);
 const result=hydrateFixture(cache,{vietnamese_meaning:'Trả tiền',english_definition:'give money',examples:''}).hydrateReviewWordLocal({word:'pay'});
 assert.equal(result.vietnamese_meaning,'Trả tiền');assert.equal(result.examples,'I pay the bill.');
});
test('cached text does not replace existing examples',()=>{
 const lib=hydrateFixture(new Map([['pay',{word:'pay',vietnamese_meaning:'Trả',examples:'Old example'}]]));
 assert.equal(lib.hydrateReviewWordLocal({word:'pay',vietnamese_meaning:'Trả',examples:'Current example'}).examples,'Current example');
});
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
const tick=()=>new Promise(r=>setImmediate(r));
function hookFixture(){
 let state;const refs=[],summary=[],details=[];
 const word={word:'pay',vietnamese_meaning:'Trả tiền'};
 const lib=load('src/hooks/useReviewSession.ts',{
  react:{useCallback:fn=>fn,useEffect(){},useRef:v=>{const r={current:v};refs.push(r);return r;},useState:initial=>{state=initial;return [state,next=>{state=typeof next==='function'?next(state):next;}];}},
  '@/lib/review-due-store':{getCachedLearningSummary:()=>[],refreshReviewDueSummary:()=>{const d=deferred();summary.push(d);return d.promise;}},
  '@/lib/review-session':{resolveReviewSession:()=>({dueCount:1,queue:[word],pool:[word]}),enrichDueReviewWords:()=>{const d=deferred();details.push(d);return d.promise;},enrichReviewSession:async()=>({dueCount:1,queue:[word],pool:[word]})},
  '@/lib/review-learner-locale-cache':{},
  '@/lib/review-word-hydrate':{hasReviewClueFields:w=>!!w.vietnamese_meaning,hydrateReviewWordLocal:w=>w},
 });return {hook:lib.useReviewSession(),state:()=>state,refs,summary,details};
}
test('ready card details render while the learning-summary request is still pending',async()=>{
 const f=hookFixture(),loading=f.hook.reload();
 const word={word:'pay',vietnamese_meaning:'Trả tiền',examples:'Ready before summary'};
 f.details[0].resolve({dueCount:1,queue:[word],pool:[word]});await tick();
 assert.equal(f.state().queue[0].examples,'Ready before summary');assert.equal(f.state().loading,false);
 f.summary[0].resolve();await loading;
});
test('a superseded reload cannot publish old card details',async()=>{
 const f=hookFixture(),first=f.hook.reload(),second=f.hook.reload();
 f.details[0].resolve({dueCount:1,queue:[{word:'pay',examples:'stale'}],pool:[]});await tick();
 assert.notEqual(f.state().queue[0].examples,'stale');
 const current={word:'pay',vietnamese_meaning:'Trả',examples:'current'};
 f.details[1].resolve({dueCount:1,queue:[current],pool:[current]});await tick();assert.equal(f.state().queue[0].examples,'current');
 f.summary.forEach(d=>d.resolve());await Promise.all([first,second]);
});
test('a long due queue fetches only the first screenful for initial card content',async()=>{
 const words=Array.from({length:250},(_,i)=>({word:'word'+i,learning_status:'review'}));
 const requests=[];
 const lib=load('src/lib/review-session.ts',{
  '@/lib/learner-storage':{learnerScope:()=> 'fixture',isLearnerScopeCurrent:()=>true},
  '@/data/preset-rank-map':{getPresetRankLite:()=>1},
  '@/data/vocab-abbreviations':{resolveLearnableWordKey:w=>w},
  '@/lib/learning-storage':{mergeLocalLearning:w=>w,readLocalLearning:()=>({}),hydrateLocalLearningFromApi(){}},
  '@/lib/proper-noun':{isExcludedVocabWord:()=>false},
  '@/lib/review-image-preload':{prefetchReviewQuestionRange:async()=>{}},
  '@/lib/review-schedule':{getReviewBadgeDueCount:()=>250},
  '@/lib/review-session-storage':{readReviewSessionSnapshot:()=>null,applyReviewSessionSnapshot:q=>q},
  '@/lib/image-keyword':{resolveImageSearchKeyword:w=>w},
  '@/lib/app-settings':{readAppSettings:()=>({learnerLocale:'vi'})},
  '@/lib/word-rank':{getImportanceTier:()=>1},
 },{fetch:async url=>{
  requests.push(url);const keys=new URL(url,'https://example.invalid').searchParams.get('words').split(',');
  return {ok:true,json:async()=>({words:keys.map(word=>({word,vietnamese_meaning:'Meaning',examples:'Ready'}))})};
 }});
 const result=await lib.enrichDueReviewWords(words,words);
 assert.equal(requests.length,1);assert.equal(new URL(requests[0],'https://example.invalid').searchParams.get('words').split(',').length,8);
 assert.equal(result.queue.length,250);assert.equal(result.queue[0].examples,'Ready');assert.equal(result.queue[249].word,'word249');
});

/* eslint-disable @typescript-eslint/no-require-imports -- Node regression harness for card gesture behavior. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(path, mocks, globals = {}) {
 const loadedModule = {exports:{}};
 const code = ts.transpileModule(fs.readFileSync(path,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 vm.runInNewContext(code,{module:loadedModule,exports:loadedModule.exports,require:id=>{if(id in mocks)return mocks[id];throw new Error('Unexpected import '+id);},...globals},{filename:path});
 return loadedModule.exports;
}
function find(node, predicate) {
 if(!node || typeof node!=='object')return null;
 if(predicate(node))return node;
 const children=node.props?.children;
 for(const child of Array.isArray(children)?children:[children]){const found=find(child,predicate);if(found)return found;}
 return null;
}
function harness({free=false,grace=0}={}) {
 const states=[],refs=[],dependencies=[],timers=new Map();
 let si=0,ri=0,ei=0,timerId=0;
 let pendingEffects=[],upgrades=0,stops=0;
 const react={
  useState(initial){const i=si++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return[states[i],value=>{states[i]=typeof value==='function'?value(states[i]):value;}];},
  useRef(initial){const i=ri++;return refs[i]??={current:initial};},
  useMemo:fn=>fn(),
  useEffect(fn,deps){const i=ei++;if(!dependencies[i]||!deps||deps.some((d,j)=>!Object.is(d,dependencies[i][j]))){dependencies[i]=deps;pendingEffects.push(fn);}},
 };
 const jsx=(type,props)=>({type,props});
 const component=load('src/components/flashcard/WordCardDetails.tsx',{
  react,'react/jsx-runtime':{jsx,jsxs:jsx},
  '@/components/flashcard/VocabExampleList':{VocabExampleList:'examples'},
  '@/components/flashcard/WordLearningChunks':{WordLearningChunks:'chunks'},
  '@/context/PaywallContext':{usePaywall:()=>({isFree:free,showUpgradePrompt:()=>upgrades++})},
  '@/hooks/use-i18n':{useI18n:()=>({t:key=>key})},
  '@/hooks/use-card-similar-words':{useCardSimilarWords:()=>[]},
  '@/lib/format-text':{capitalizeFirst:s=>s},
  '@/lib/learning-chunks':{resolveLearningChunks:()=>null},
  '@/lib/parse-examples':{parseExamples:()=>[]},
 },{window:{setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id)}});
 function render(){si=0;ri=0;ei=0;const tree=component.WordCardDetails({word:'learn',family:[{word:'learn',pos:'verb'},{word:'learner',pos:'noun'}],hintGraceMs:grace});const effects=pendingEffects;pendingEffects=[];effects.forEach(fn=>fn());return tree;}
 render();
 const tree=()=>render();
 const button=()=>find(tree(),n=>n.type==='button');
 const isFamily=()=>Boolean(find(tree(),n=>n.props?.className==='card-details__flip is-family'));
 const event=(extra={})=>({clientX:10,clientY:10,stopPropagation(){stops++;},...extra});
 return{tree,button,isFamily,event,upgrades:()=>upgrades,stops:()=>stops,flushTimers(){const all=[...timers.values()];timers.clear();all.forEach(fn=>fn());}};
}
test('iOS click-only activation opens Family and returns to Examples on the same word',()=>{
 const h=harness();assert.equal(h.isFamily(),false);
 h.button().props.onClick(h.event());assert.equal(h.isFamily(),true);
 h.button().props.onClick(h.event());assert.equal(h.isFamily(),false);assert.equal(h.stops(),2);
});
test('pointer-up followed by click switches once, with no bubbling into parent card actions',()=>{
 const h=harness();const props=h.button().props;
 props.onPointerDown(h.event());props.onPointerUp(h.event());assert.equal(h.isFamily(),false);
 props.onClick(h.event());assert.equal(h.isFamily(),true);assert.equal(h.stops(),3);
});
test('dragging and cancelled taps do not activate Family; a later clean tap still works',()=>{
 const h=harness();let p=h.button().props;
 p.onPointerDown(h.event());p.onPointerUp(h.event({clientY:40}));p.onClick(h.event());assert.equal(h.isFamily(),false);
 p.onPointerDown(h.event());p.onPointerCancel(h.event());p.onClick(h.event());assert.equal(h.isFamily(),false);
 p.onPointerDown(h.event());p.onPointerUp(h.event());p.onClick(h.event());assert.equal(h.isFamily(),true);
});
test('scrolling and review grace suppress accidental activation, then allow a new tap',()=>{
 const h=harness({grace:450});assert.equal(h.button().props.disabled,true);
 h.button().props.onClick(h.event());assert.equal(h.isFamily(),false);
 h.flushTimers();assert.equal(h.button().props.disabled,false);
 const examples=find(h.tree(),n=>Boolean(n.props?.onTouchMove));examples.props.onTouchMove();
 let p=h.button().props;p.onPointerDown(h.event());p.onPointerUp(h.event());p.onClick(h.event());assert.equal(h.isFamily(),false);
 h.flushTimers();p=h.button().props;p.onPointerDown(h.event());p.onPointerUp(h.event());p.onClick(h.event());assert.equal(h.isFamily(),true);
});
test('keyboard activation stays inside Family and Free gating still shows upgrade',()=>{
 const h=harness();h.button().props.onKeyDown(h.event({key:'Enter'}));h.button().props.onClick(h.event());assert.equal(h.isFamily(),true);
 const free=harness({free:true});free.button().props.onClick(free.event());assert.equal(free.isFamily(),false);assert.equal(free.upgrades(),1);
});
test('Journey capture ignores Family/button descendants while plain card taps can unlock current-word audio',()=>{
 const spoken=[];
 class Element{constructor(control){this.control=control;}closest(){return this.control?{}:null;}}
 const lib=load('src/lib/journey-card-gesture.ts',{'@/lib/speak-word':{consumeGestureAutoSpeak:word=>spoken.push(word)}},{Element});
 lib.handleJourneyCardPointerDown(new Element(true),'learn');assert.equal(spoken.length,0);
 lib.handleJourneyCardPointerDown(new Element(false),'learn');assert.deepEqual(spoken,['learn']);
 lib.handleJourneyCardPointerDown(null,'next');assert.deepEqual(spoken,['learn']);
});
test('a queued pronunciation for another card is discarded rather than spoken on this card',()=>{
 const lib=load('src/lib/speak-word.ts',{
  '@/lib/pronounce-text':{},'@/lib/speech-voice':{},'@/lib/pronunciation-log':{},'@/lib/word-pronunciation-audio':{},
 });
 lib.queueGestureAutoSpeak('next');assert.equal(lib.consumeGestureAutoSpeak('current'),false);
 assert.equal(lib.consumeGestureAutoSpeak(),false,'stale word must also be cleared');
});
test('document-level audio warmup also leaves Family/Examples touch gestures alone',()=>{
 const handlers=new Map();let unlocks=0,primes=0,pending=true;
 class Element{constructor(family){this.family=family;}closest(selector){return selector==='.card-details__hint'&&this.family?{}:null;}}
 const component=load('src/components/layout/SpeechVoiceWarmup.tsx',{
  react:{useEffect:fn=>fn()},
  '@/lib/speak-word':{hasPendingAutoSpeak:()=>pending,preloadSpeechVoices(){},unlockSpeechFromUserGesture(){unlocks++;pending=false;}},
  '@/lib/word-pronunciation-audio':{primeSharedAudioInUserGesture(){primes++;}},
 },{Element,document:{addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener(){}}});
 component.SpeechVoiceWarmup();
 handlers.get('touchstart')({target:new Element(true)});
 handlers.get('pointerdown')({target:new Element(true)});
 assert.equal(unlocks,0);assert.equal(primes,0);assert.equal(pending,true);
 handlers.get('pointerdown')({target:new Element(false)});
 assert.equal(unlocks,1);assert.equal(primes,1);
});

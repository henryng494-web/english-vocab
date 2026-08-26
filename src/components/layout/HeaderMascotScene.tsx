/**
 * Header scene — branch + one mascot in a shared SVG coordinate system (idea 4).
 * Branch top rim is fixed at y≈48; each mascot is drawn to grip / sit / lie on it.
 */
import { MASCOT_BRAND_COLORS } from "@/data/jungle-cast-brand";

export type HeaderSceneCharacter = "monkey" | "elephant" | "crocodile" | "tiger";

const C = MASCOT_BRAND_COLORS;
const STROKE = "#1e293b";

/** Branch body path — single ribbon; top edge ~y=46–50, bottom ~y=58–62. */
const BRANCH_BODY =
  "M0,48 C45,40 95,40 145,47 C195,53 245,53 295,45 C345,37 400,42 400,42 L400,60 C345,64 295,56 245,62 C195,68 145,60 95,64 C45,68 0,62 Z";

const BRANCH_TOP =
  "M0,47.5 C45,39.5 95,39.5 145,46.5 C195,52.5 245,52.5 295,44.5 C345,36.5 400,41.5";

type HeaderMascotSceneProps = {
  character: HeaderSceneCharacter;
};

export function HeaderMascotScene({ character }: HeaderMascotSceneProps) {
  return (
    <svg
      className="app-header__scene"
      viewBox="0 0 400 72"
      preserveAspectRatio="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="headerBranchWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--header-branch-light, #d98f4e)" />
          <stop offset="55%" stopColor="var(--header-branch, #b3672b)" />
          <stop offset="100%" stopColor="var(--header-branch-dark, #7a431a)" />
        </linearGradient>
      </defs>

      {/* ── Layer 1: dangling parts (below branch) ── */}
      {character === "monkey" && <MonkeyDangle />}
      {character === "elephant" && <ElephantDangle />}
      {character === "crocodile" && <CrocodileDangle />}
      {character === "tiger" && <TigerDangle />}

      {/* ── Layer 2: branch ── */}
      <path d={BRANCH_BODY} fill="url(#headerBranchWood)" />
      <path
        d={BRANCH_TOP}
        fill="none"
        stroke="var(--header-branch-light, #d98f4e)"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* ── Layer 3: mascot upper body (on / over branch) ── */}
      {character === "monkey" && <MonkeyUpper />}
      {character === "elephant" && <ElephantUpper />}
      {character === "crocodile" && <CrocodileUpper />}
      {character === "tiger" && <TigerUpper />}

      {/* ── Layer 4: leaf sprigs ── */}
      <LeafSprig x={290} y={38} rotate={-20} />
      <LeafSprig x={358} y={36} rotate={16} />
    </svg>
  );
}

function LeafSprig({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      <path
        d="M0,0 C3,-5 10,-5 13,0 C10,2.5 3,2.5 0,0 Z"
        fill="var(--header-leaf, #84cc16)"
        stroke="var(--header-leaf-dark, #4d7c0f)"
        strokeWidth="0.5"
      />
    </g>
  );
}

/* ═══ MONKEY — hanging by both arms, legs & tail swing below branch ═══ */
function MonkeyDangle() {
  return (
    <g transform="translate(44, 0)">
      {/* tail */}
      <path
        d="M58,52 C72,58 78,66 70,70 C62,72 56,66 58,52"
        fill={C.monkey}
        stroke="#6D28D9"
        strokeWidth="1.2"
      />
      {/* legs */}
      <path
        d="M18,52 L16,68 M30,52 L32,68"
        stroke={C.monkey}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="69" rx="3.5" ry="2" fill={C.monkeyLight} />
      <ellipse cx="32" cy="69" rx="3.5" ry="2" fill={C.monkeyLight} />
    </g>
  );
}

function MonkeyUpper() {
  return (
    <g transform="translate(44, 0)">
      {/* torso */}
      <ellipse cx="24" cy="40" rx="13" ry="11" fill={C.monkey} />
      <ellipse cx="24" cy="42" rx="8" ry="7" fill={C.monkeyLight} opacity="0.9" />
      {/* head */}
      <circle cx="24" cy="24" r="15" fill={C.monkey} stroke="#6D28D9" strokeWidth="1" />
      <ellipse cx="24" cy="26" rx="10" ry="9" fill={C.monkeyLight} />
      {/* ears */}
      <circle cx="12" cy="16" r="5" fill={C.monkey} stroke="#6D28D9" strokeWidth="0.8" />
      <circle cx="36" cy="16" r="5" fill={C.monkey} stroke="#6D28D9" strokeWidth="0.8" />
      <circle cx="12" cy="16" r="2.5" fill={C.monkeyLight} />
      <circle cx="36" cy="16" r="2.5" fill={C.monkeyLight} />
      {/* face */}
      <circle cx="19" cy="24" r="3.2" fill={STROKE} />
      <circle cx="20" cy="23" r="1" fill="#fff" />
      <path d="M28,24 Q30,24 30,22" stroke={STROKE} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M21,30 Q24,32 27,30" stroke="#6D28D9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* arms gripping branch */}
      <path
        d="M14,34 Q10,44 12,48 Q14,50 18,48"
        fill="none"
        stroke={C.monkey}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M34,34 Q38,44 36,48 Q34,50 30,48"
        fill="none"
        stroke={C.monkey}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="48" r="3" fill={C.monkeyLight} />
      <circle cx="36" cy="48" r="3" fill={C.monkeyLight} />
    </g>
  );
}

/* ═══ ELEPHANT — giant circle head seated on branch, stick legs dangle ═══ */
function ElephantDangle() {
  return (
    <g transform="translate(38, 0)">
      <line x1="42" y1="50" x2="40" y2="70" stroke={C.elephant} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="54" y1="50" x2="56" y2="70" stroke={C.elephant} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="40" cy="70.5" r="2.5" fill="#FBCFE8" />
      <circle cx="56" cy="70.5" r="2.5" fill="#FBCFE8" />
    </g>
  );
}

function ElephantUpper() {
  return (
    <g transform="translate(38, 0)">
      {/* stick arms */}
      <line x1="30" y1="38" x2="22" y2="48" stroke={C.elephant} strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="38" x2="74" y2="48" stroke={C.elephant} strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="48" r="2.5" fill="#FBCFE8" />
      <circle cx="74" cy="48" r="2.5" fill="#FBCFE8" />
      {/* giant head — bottom rests on branch y≈48 */}
      <circle cx="48" cy="30" r="22" fill={C.elephant} stroke="#DB2777" strokeWidth="1" />
      {/* ears */}
      <ellipse cx="26" cy="28" rx="9" ry="11" fill={C.elephant} stroke="#DB2777" strokeWidth="0.8" />
      <ellipse cx="70" cy="28" rx="9" ry="11" fill={C.elephant} stroke="#DB2777" strokeWidth="0.8" />
      <ellipse cx="26" cy="28" rx="4" ry="5" fill="#FBCFE8" opacity="0.7" />
      <ellipse cx="70" cy="28" rx="4" ry="5" fill="#FBCFE8" opacity="0.7" />
      {/* trunk over branch */}
      <path
        d="M48,38 Q44,46 46,50 Q48,52 52,48 Q54,44 52,38"
        fill="none"
        stroke={C.elephant}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* face */}
      <circle cx="40" cy="28" r="3" fill={STROKE} />
      <circle cx="41" cy="27" r="0.9" fill="#fff" />
      <circle cx="56" cy="28" r="3" fill={STROKE} />
      <circle cx="57" cy="27" r="0.9" fill="#fff" />
    </g>
  );
}

/* ═══ CROCODILE — horizontal log body lying along branch ═══ */
function CrocodileDangle() {
  return (
    <g transform="translate(28, 0)">
      {/* stub legs below branch */}
      <rect x="36" y="54" width="3" height="8" rx="1.2" fill="#65A30D" />
      <rect x="48" y="54" width="3" height="8" rx="1.2" fill="#65A30D" />
      <rect x="68" y="54" width="3" height="8" rx="1.2" fill="#65A30D" />
      <rect x="80" y="54" width="3" height="8" rx="1.2" fill="#65A30D" />
      {/* tail taper */}
      <path d="M88,50 L98,52 L98,54 L88,52 Z" fill="#65A30D" />
    </g>
  );
}

function CrocodileUpper() {
  return (
    <g transform="translate(28, 0)">
      {/* log body — belly on branch */}
      <rect x="32" y="44" width="58" height="12" rx="6" fill={C.crocodile} stroke="#4D7C0F" strokeWidth="1" />
      {/* back scales */}
      <path
        d="M38,44 L42,40 L46,44 L50,40 L54,44 L58,40 L62,44 L66,40 L70,44 L74,40 L78,44 L82,40 L86,44"
        fill="none"
        stroke="#4D7C0F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* snout */}
      <ellipse cx="34" cy="50" rx="8" ry="5" fill="#65A30D" stroke="#4D7C0F" strokeWidth="0.8" />
      {/* eyes on top */}
      <circle cx="42" cy="42" r="3.5" fill="#fff" stroke="#4D7C0F" strokeWidth="0.6" />
      <circle cx="42" cy="42" r="1.8" fill={STROKE} />
      <circle cx="50" cy="41" r="3.5" fill="#fff" stroke="#4D7C0F" strokeWidth="0.6" />
      <circle cx="50" cy="41" r="1.8" fill={STROKE} />
      {/* smile tooth */}
      <path d="M30,51 Q32,53 34,51" stroke="#4D7C0F" strokeWidth="0.8" fill="none" />
      <rect x="31" y="51" width="1.5" height="2" rx="0.3" fill="#fff" />
    </g>
  );
}

/* ═══ TIGER — orange sphere perched on branch, stub limbs ═══ */
function TigerDangle() {
  return (
    <g transform="translate(42, 0)">
      <line x1="18" y1="50" x2="16" y2="62" stroke={C.tiger} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="50" x2="32" y2="62" stroke={C.tiger} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="62.5" r="2" fill={C.tigerCream} />
      <circle cx="32" cy="62.5" r="2" fill={C.tigerCream} />
    </g>
  );
}

function TigerUpper() {
  return (
    <g transform="translate(42, 0)">
      {/* sphere body+head */}
      <circle cx="24" cy="32" r="18" fill={C.tiger} stroke="#C2410C" strokeWidth="1" />
      {/* stripes */}
      <path d="M14,28 L18,30 M30,28 L34,30 M12,36 L16,38 M32,36 L36,38" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" />
      {/* cream muzzle */}
      <ellipse cx="24" cy="36" rx="10" ry="8" fill={C.tigerCream} />
      {/* ears */}
      <circle cx="12" cy="18" r="4" fill={C.tiger} stroke="#C2410C" strokeWidth="0.6" />
      <circle cx="36" cy="18" r="4" fill={C.tiger} stroke="#C2410C" strokeWidth="0.6" />
      <circle cx="12" cy="18" r="2" fill={C.tigerCream} />
      <circle cx="36" cy="18" r="2" fill={C.tigerCream} />
      {/* face — wink + smile */}
      <circle cx="18" cy="32" r="2.8" fill={STROKE} />
      <circle cx="19" cy="31" r="0.8" fill="#fff" />
      <path d="M28,32 Q30,32 30,30" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M20,40 Q24,44 28,40" stroke="#C2410C" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="26" cy="39" rx="2" ry="1.2" fill="#FB7185" opacity="0.6" />
      {/* tiny arms on branch */}
      <ellipse cx="10" cy="46" rx="3" ry="2" fill={C.tiger} />
      <ellipse cx="38" cy="46" rx="3" ry="2" fill={C.tiger} />
    </g>
  );
}

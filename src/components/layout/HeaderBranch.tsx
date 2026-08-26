/**
 * Organic curved jungle branch — the wavy bottom border of the app header.
 * Left plateau (x≈0–95) is the gentle "landing zone" where mascots perch;
 * the rest flows into a pronounced curvy vine shape for visual flair.
 */
export function HeaderBranch() {
  return (
    <svg
      className="app-header__branch"
      viewBox="0 0 400 48"
      preserveAspectRatio="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="branchWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0b429" />
          <stop offset="28%" stopColor="#c2760f" />
          <stop offset="62%" stopColor="#8a4513" />
          <stop offset="100%" stopColor="#4a230a" />
        </linearGradient>
        <linearGradient id="branchGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="branchKnot" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6b3410" />
          <stop offset="100%" stopColor="#3a1a06" />
        </radialGradient>
        <linearGradient id="branchShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Branch body — curvy vine silhouette (flatter landing zone on the left) */}
      <path
        d="
          M0,20
          C18,17 34,17 50,19
          C64,21 78,18 95,15
          C118,11 138,9 155,11
          C175,14 192,21 212,27
          C228,31 246,30 262,23
          C278,15 292,9 308,9
          C328,9 346,15 362,19
          C378,22 392,18 400,15
          L400,29
          C392,32 378,36 362,33
          C346,29 328,23 308,23
          C292,23 278,29 262,37
          C246,44 228,45 212,41
          C192,35 175,28 155,25
          C138,23 118,25 95,29
          C78,32 64,35 50,33
          C34,31 18,31 0,34
          Z
        "
        fill="url(#branchWood)"
      />

      {/* Underside shading for a rounded 3D log feel */}
      <path
        d="
          M0,20
          C18,17 34,17 50,19
          C64,21 78,18 95,15
          C118,11 138,9 155,11
          C175,14 192,21 212,27
          C228,31 246,30 262,23
          C278,15 292,9 308,9
          C328,9 346,15 362,19
          C378,22 392,18 400,15
        "
        fill="none"
        stroke="#3a1a06"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Glossy highlight along the sunlit top curve */}
      <path
        d="
          M0,19.5
          C18,16.5 34,16.5 50,18.5
          C64,20.5 78,17.5 95,14.5
          C118,10.5 138,8.5 155,10.5
          C175,13.5 192,20.5 212,26.5
          C228,30.5 246,29.5 262,22.5
          C278,14.5 292,8.5 308,8.5
          C328,8.5 346,14.5 362,18.5
          C378,21.5 392,17.5 400,14.5
        "
        fill="none"
        stroke="url(#branchGloss)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Bark grain ridges for texture */}
      <path
        d="M8,26 C40,29 70,27 100,25 C130,23 158,26 186,31"
        fill="none"
        stroke="#3a1a06"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.32"
      />
      <path
        d="M215,32 C240,36 258,32 275,25 C295,17 318,15 340,17"
        fill="none"
        stroke="#3a1a06"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.32"
      />

      {/* Wood knots */}
      <ellipse cx="150" cy="18" rx="4.5" ry="5.5" fill="url(#branchKnot)" opacity="0.8" />
      <ellipse cx="304" cy="16" rx="4" ry="5" fill="url(#branchKnot)" opacity="0.75" />

      {/* Small jungle leaf sprigs for flair */}
      <g transform="translate(198,10) rotate(-18)">
        <path d="M0,0 C4,-6 12,-6 16,0 C12,3 4,3 0,0 Z" fill="#84cc16" opacity="0.9" />
        <path d="M0,0 C4,-6 12,-6 16,0" fill="none" stroke="#4d7c0f" strokeWidth="0.6" opacity="0.6" />
      </g>
      <g transform="translate(356,10) rotate(22)">
        <path d="M0,0 C4,-6 12,-6 16,0 C12,3 4,3 0,0 Z" fill="#65a30d" opacity="0.9" />
        <path d="M0,0 C4,-6 12,-6 16,0" fill="none" stroke="#3f6212" strokeWidth="0.6" opacity="0.6" />
      </g>

      {/* Contact-zone soft shadow (subtle sag where mascots rest) */}
      <path
        d="M28,17 C48,22 66,22 86,17"
        fill="none"
        stroke="#3a1a06"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.28"
      />

      {/* Depth shadow beneath the branch */}
      <rect x="0" y="34" width="400" height="14" fill="url(#branchShade)" />
    </svg>
  );
}

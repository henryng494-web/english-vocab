/**
 * Jungle branch — a simple, flat-cartoon branch that decorates the bottom
 * edge of the header, echoing the branch drawn in the welcome-splash artwork
 * (solid color + soft outline, a few leaf sprigs, no photoreal wood texture).
 * The four mascots perch, hang, or lie along it via translateY/rotate set on
 * `.app-header__mascot-figure` in AppHeader.
 */
export function HeaderBranch() {
  return (
    <svg
      className="app-header__branch"
      viewBox="0 0 400 32"
      preserveAspectRatio="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="branchFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--header-branch-light)" }} />
          <stop offset="55%" style={{ stopColor: "var(--header-branch)" }} />
          <stop offset="100%" style={{ stopColor: "var(--header-branch-dark)" }} />
        </linearGradient>
      </defs>

      {/* Single gentle wave — a flat, cartoon-style branch (no wood texture) */}
      <path
        d="
          M0,14
          C40,6 90,6 130,13
          C170,20 210,20 250,13
          C290,6 330,4 370,9
          C382,10.5 392,12 400,13.5
          L400,23.5
          C392,22 382,20.5 370,19
          C330,14 290,16 250,23
          C210,30 170,30 130,23
          C90,16 40,16 0,24
          Z
        "
        fill="url(#branchFace)"
        style={{ stroke: "var(--header-branch-dark)" }}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Top-edge highlight for a soft, rounded cartoon feel */}
      <path
        d="
          M0,14.5
          C40,6.5 90,6.5 130,13.5
          C170,20.5 210,20.5 250,13.5
          C290,6.5 330,4.5 370,9.5
          C382,11 392,12.5 400,14
        "
        fill="none"
        style={{ stroke: "var(--header-branch-light)" }}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Leaf sprigs — flat two-tone shapes, matching the splash artwork */}
      <g transform="translate(112,7) rotate(-24)">
        <path d="M0,0 C3,-5.5 10,-5.5 13,0 C10,2.6 3,2.6 0,0 Z" style={{ fill: "var(--header-leaf)" }} />
        <path d="M0,0 C3,-5.5 10,-5.5 13,0" fill="none" style={{ stroke: "var(--header-leaf-dark)" }} strokeWidth="0.6" opacity="0.7" />
      </g>
      <g transform="translate(232,6) rotate(18)">
        <path d="M0,0 C3,-5.5 10,-5.5 13,0 C10,2.6 3,2.6 0,0 Z" style={{ fill: "var(--header-leaf-dark)" }} />
        <path d="M0,0 C3,-5.5 10,-5.5 13,0" fill="none" style={{ stroke: "var(--header-leaf-dark)" }} strokeWidth="0.6" opacity="0.5" />
      </g>
      <g transform="translate(346,4) rotate(-12)">
        <path d="M0,0 C3,-5.5 10,-5.5 13,0 C10,2.6 3,2.6 0,0 Z" style={{ fill: "var(--header-leaf)" }} />
        <path d="M0,0 C3,-5.5 10,-5.5 13,0" fill="none" style={{ stroke: "var(--header-leaf-dark)" }} strokeWidth="0.6" opacity="0.7" />
      </g>
    </svg>
  );
}

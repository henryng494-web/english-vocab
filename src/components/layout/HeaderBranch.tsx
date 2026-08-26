/** Organic curved tree branch — wavy bottom border of the app header. */
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
        <linearGradient id="headerBranchWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="30%" stopColor="#b45309" />
          <stop offset="68%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#3f1a07" />
        </linearGradient>
        <linearGradient id="headerBranchHighlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="headerBranchShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Branch body — pronounced wavy top edge */}
      <path
        d="
          M0 18
          C14 10, 28 8, 44 14
          C52 17, 58 18, 66 16
          C82 10, 98 20, 118 13
          C138 6, 158 17, 182 11
          C206 5, 228 16, 252 10
          C276 4, 298 15, 324 9
          C346 4, 372 14, 400 12
          L400 32
          L0 32
          Z
        "
        fill="url(#headerBranchWood)"
      />

      {/* Dark bark crevice along ridges */}
      <path
        d="
          M0 18
          C14 10, 28 8, 44 14
          C52 17, 58 18, 66 16
          C82 10, 98 20, 118 13
          C138 6, 158 17, 182 11
          C206 5, 228 16, 252 10
          C276 4, 298 15, 324 9
          C346 4, 372 14, 400 12
        "
        fill="none"
        stroke="#451a03"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Sunlit highlight on the curved top surface */}
      <path
        d="
          M0 16.5
          C14 8.5, 28 6.5, 44 12.5
          C52 15.5, 58 16.5, 66 14.5
          C82 8.5, 98 18.5, 118 11.5
          C138 4.5, 158 15.5, 182 9.5
          C206 3.5, 228 14.5, 252 8.5
          C276 2.5, 298 13.5, 324 7.5
          C346 2.5, 372 12.5, 400 10.5
        "
        fill="none"
        stroke="url(#headerBranchHighlight)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Mascot perch — branch sags under weight on the left */}
      <path
        d="M28 15 C48 21, 68 21, 88 15"
        fill="none"
        stroke="#451a03"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.4"
      />

      {/* Small side twig bump */}
      <path
        d="M72 16 C78 13, 84 18, 90 15"
        fill="none"
        stroke="#92400e"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Depth shadow under the branch */}
      <rect x="0" y="25" width="400" height="7" fill="url(#headerBranchShadow)" />
    </svg>
  );
}

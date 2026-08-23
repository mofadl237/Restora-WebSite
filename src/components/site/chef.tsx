import { cn } from "@/src/lib/utils";

/**
 * RESTORA chef narrator — hand-built vector character.
 * Black/white uniform with brand-accent details. Fills reference the runtime
 * brand CSS variables so the character always matches DB branding.
 *
 * Groups tagged `data-chef` are animated externally (GSAP):
 *   data-chef="arm-wave"  – waving forearm (rotate origin at shoulder)
 *   data-chef="head"      – head (subtle tilt/bob)
 *   data-chef="body"      – whole body (float bob)
 */
export function Chef({
  className,
  pose = "wave",
}: {
  className?: string;
  pose?: "wave" | "present" | "thumbs";
}) {
  const waveAngle =
    pose === "wave" ? -8 : pose === "present" ? -28 : -2;

  return (
    <svg
      viewBox="0 0 340 420"
      role="img"
      aria-label="RESTORA chef"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <linearGradient id="chef-jacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e3e1d8" />
        </linearGradient>
        <linearGradient id="chef-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddd9cd" />
        </linearGradient>
        <linearGradient id="chef-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6cfa9" />
          <stop offset="100%" stopColor="#e0a97b" />
        </linearGradient>
        <linearGradient id="chef-apron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26262b" />
          <stop offset="100%" stopColor="#101013" />
        </linearGradient>
        <linearGradient id="chef-tablet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#20262b" />
          <stop offset="100%" stopColor="#0d1117" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="170" cy="398" rx="110" ry="16" fill="currentColor" opacity="0.10" />

      <g data-chef="body">
        {/* legs */}
        <path d="M128 330 L124 386 Q124 392 130 392 L152 392 Q158 392 158 386 L156 330 Z" fill="#23232a" />
        <path d="M212 330 L216 386 Q216 392 210 392 L188 392 Q182 392 182 386 L184 330 Z" fill="#2b2b33" />
        {/* shoes */}
        <rect x="118" y="386" width="44" height="14" rx="7" fill="#17171b" />
        <rect x="178" y="386" width="44" height="14" rx="7" fill="#17171b" />

        {/* torso — double-breasted jacket */}
        <path
          d="M112 208 Q108 196 122 190 L248 190 Q262 196 258 208 L250 330 Q248 342 236 342 L134 342 Q122 342 120 330 Z"
          fill="url(#chef-jacket)"
        />
        {/* jacket center overlap line */}
        <path d="M186 192 L182 340" stroke="#cfccc0" strokeWidth="3" strokeLinecap="round" />
        {/* buttons */}
        <circle cx="166" cy="222" r="5" fill="#b9b6aa" />
        <circle cx="166" cy="252" r="5" fill="#b9b6aa" />
        <circle cx="166" cy="282" r="5" fill="#b9b6aa" />
        <circle cx="200" cy="222" r="5" fill="#b9b6aa" />
        <circle cx="200" cy="252" r="5" fill="#b9b6aa" />
        {/* saffron neckerchief */}
        <path d="M142 192 L228 192 L218 224 Q185 238 152 224 Z" fill="var(--brand-accent)" />
        <path d="M176 220 L194 220 L190 262 L180 262 Z" fill="color-mix(in srgb, var(--brand-accent) 78%, black)" />

        {/* black waist apron */}
        <path
          d="M132 268 L238 268 L244 352 Q244 362 232 362 L138 362 Q126 362 126 352 Z"
          fill="url(#chef-apron)"
        />
        <rect x="150" y="292" width="70" height="40" rx="8" fill="#1c1c21" stroke="#33333b" strokeWidth="2" />
        {/* brand mark on apron pocket */}
        <text
          x="185"
          y="318"
          textAnchor="middle"
          fontSize="15"
          fontWeight="700"
          fontFamily="var(--font-display)"
          fill="var(--brand-accent)"
        >
          R
        </text>

        {/* left arm (viewer-left) — holds tablet */}
        <g>
          <path d="M118 206 Q96 214 92 240 L100 300 Q102 310 112 308 L124 304 Q116 260 126 224 Z" fill="url(#chef-jacket)" />
          <circle cx="106" cy="306" r="12" fill="url(#chef-skin)" />
          {/* tablet */}
          <g transform="rotate(-14 84 268)">
            <rect x="52" y="230" width="64" height="86" rx="8" fill="url(#chef-tablet)" />
            <rect x="58" y="238" width="52" height="70" rx="4" fill="#12161c" />
            <polyline
              points="62,296 74,280 84,288 104,256"
              fill="none"
              stroke="var(--brand-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="104" cy="256" r="4" fill="var(--brand-accent)" />
          </g>
        </g>

        {/* right arm (viewer-right) — raised, waving/presenting */}
        <g transform={`rotate(${waveAngle} 252 212)`}>
          {/* inner group is animated by GSAP (no baked transform conflicts) */}
          <g data-chef="arm-wave">
            <path d="M252 206 Q276 214 280 244 L272 302 Q270 312 260 310 L248 306 Q256 262 246 226 Z" fill="url(#chef-jacket)" />
            {pose === "thumbs" ? (
              <>
                <circle cx="264" cy="308" r="12" fill="url(#chef-skin)" />
                <rect x="258" y="278" width="11" height="26" rx="5.5" fill="url(#chef-skin)" transform="rotate(-18 264 292)" />
              </>
            ) : (
              <g>
                <circle cx="272" cy="306" r="13" fill="url(#chef-skin)" />
                <path d="M262 300 Q258 288 264 280 M272 296 Q270 284 276 278 M281 299 Q281 288 287 283" stroke="url(#chef-skin)" strokeWidth="9" strokeLinecap="round" fill="none" />
              </g>
            )}
          </g>
        </g>
      </g>

      {/* neck */}
      <rect x="158" y="164" width="54" height="34" rx="14" fill="url(#chef-skin)" />

      {/* head */}
      <g data-chef="head">
        <circle cx="185" cy="118" r="56" fill="url(#chef-skin)" />
        {/* ears */}
        <circle cx="131" cy="122" r="10" fill="url(#chef-skin)" />
        <circle cx="239" cy="122" r="10" fill="url(#chef-skin)" />

        {/* face */}
        <g>
          {/* eyebrows */}
          <path d="M156 104 Q166 98 176 103" stroke="#4a3323" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M196 103 Q206 98 216 104" stroke="#4a3323" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* eyes */}
          <circle cx="167" cy="120" r="6.5" fill="#2b2018" />
          <circle cx="207" cy="120" r="6.5" fill="#2b2018" />
          <circle cx="169.5" cy="117.5" r="2" fill="#ffffff" />
          <circle cx="209.5" cy="117.5" r="2" fill="#ffffff" />
          {/* smile */}
          <path d="M172 140 Q187 154 204 139" stroke="#7c4a2d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* cheeks */}
          <circle cx="152" cy="134" r="7" fill="#ee9d72" opacity="0.45" />
          <circle cx="222" cy="133" r="7" fill="#ee9d72" opacity="0.45" />
        </g>

        {/* toque */}
        <g>
          <ellipse cx="185" cy="66" rx="52" ry="18" fill="url(#chef-hat)" />
          <path
            d="M141 62 Q132 34 156 32 Q160 10 185 12 Q210 10 214 32 Q238 34 229 62 Z"
            fill="url(#chef-hat)"
          />
          <path d="M141 60 Q163 68 185 62 Q207 68 229 60 L229 76 Q185 88 141 76 Z" fill="#efece2" />
          <path
            d="M141 74 L229 74 L229 82 Q185 94 141 82 Z"
            fill="color-mix(in srgb, var(--brand-accent) 85%, white)"
          />
        </g>
      </g>
    </svg>
  );
}

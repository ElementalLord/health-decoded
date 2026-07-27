"use client";

type PersonPalette = "blue" | "sage" | "warm";

type PersonAction =
  | "carry-left"
  | "carry-right"
  | "celebrate"
  | "hold-left"
  | "hold-right"
  | "hug-left"
  | "hug-right"
  | "listen"
  | "reach-left"
  | "reach-right"
  | "rest"
  | "wave-left"
  | "wave-right";

type PersonMotion = "breathe" | "dance" | "nod" | "still" | "walk";

const palettes: Record<
  PersonPalette,
  { clothing: string; hair: string; outline: string; skin: string }
> = {
  blue: {
    clothing: "#7f9fa8",
    hair: "#5f7480",
    outline: "#58737b",
    skin: "#e8bea2",
  },
  sage: {
    clothing: "#759d8a",
    hair: "#5a6f66",
    outline: "#55796a",
    skin: "#dda77f",
  },
  warm: {
    clothing: "#cf7b61",
    hair: "#805944",
    outline: "#a7614e",
    skin: "#e5a878",
  },
};

function armPaths(action: PersonAction) {
  switch (action) {
    case "carry-left":
      return ["M-26-73Q-42-66-43-60", "M26-73Q34-51 28-34"] as const;
    case "carry-right":
      return ["M-26-73Q-34-51-28-34", "M26-73Q42-66 43-60"] as const;
    case "celebrate":
      return ["M-26-73Q-48-94-43-120", "M26-73Q48-94 43-120"] as const;
    case "hold-left":
      return ["M-26-73Q-42-55-39-37", "M26-73Q7-48-9-40"] as const;
    case "hold-right":
      return ["M-26-73Q-7-48 9-40", "M26-73Q42-55 39-37"] as const;
    case "hug-left":
      return ["M-26-73Q-54-64-62-43", "M26-73Q3-49-20-46"] as const;
    case "hug-right":
      return ["M-26-73Q-3-49 20-46", "M26-73Q54-64 62-43"] as const;
    case "listen":
      return ["M-26-73Q-38-54-34-37", "M26-73Q37-83 33-104"] as const;
    case "reach-left":
      return ["M-26-73Q-52-65-70-45", "M26-73Q35-57 32-40"] as const;
    case "reach-right":
      return ["M-26-73Q-35-57-32-40", "M26-73Q52-65 70-45"] as const;
    case "wave-left":
      return ["M-26-73Q-49-92-42-120", "M26-73Q38-55 34-38"] as const;
    case "wave-right":
      return ["M-26-73Q-38-55-34-38", "M26-73Q49-92 42-120"] as const;
    default:
      return ["M-26-73Q-37-53-32-34", "M26-73Q37-53 32-34"] as const;
  }
}

export function LessonMotionPerson({
  action = "rest",
  facing = "right",
  motion = "breathe",
  palette = "sage",
  scale = 1,
  seated = false,
  x,
  y,
}: {
  action?: PersonAction;
  facing?: "left" | "right";
  motion?: PersonMotion;
  palette?: PersonPalette;
  scale?: number;
  seated?: boolean;
  x: number;
  y: number;
}) {
  const colors = palettes[palette];
  const [leftArm, rightArm] = armPaths(action);
  const flip = facing === "left" ? -1 : 1;
  const torsoBottom = seated ? -34 : -18;

  return (
    <g
      data-motion-person={palette}
      transform={`translate(${x} ${y}) scale(${scale * flip} ${scale})`}
    >
      <g>
        {motion === "breathe" ? (
          <animateTransform
            attributeName="transform"
            dur="4.8s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 -2;0 0"
          />
        ) : null}
        {motion === "dance" ? (
          <animateTransform
            attributeName="transform"
            dur="1.8s"
            repeatCount="indefinite"
            type="rotate"
            values="-3 0 0;3 0 0;-3 0 0"
          />
        ) : null}
        {motion === "nod" ? (
          <animateTransform
            attributeName="transform"
            dur="3.4s"
            repeatCount="indefinite"
            type="rotate"
            values="0 0 -91;0 0 -91;3 0 -91;0 0 -91"
          />
        ) : null}
        {motion === "walk" ? (
          <animateTransform
            attributeName="transform"
            dur="1.2s"
            repeatCount="indefinite"
            type="translate"
            values="0 0;0 -3;0 0"
          />
        ) : null}

        <ellipse cy="-116" fill={colors.hair} rx="27" ry="28" />
        <circle cy="-112" fill={colors.skin} r="23" stroke={colors.outline} strokeWidth="2.5" />
        <path d="M-23-116Q0-143 23-116Q10-123 0-122Q-10-123-23-116Z" fill={colors.hair} />
        <circle cx="-7" cy="-110" fill={colors.outline} r="1.7" />
        <circle cx="7" cy="-110" fill={colors.outline} r="1.7" />
        <path
          d="M-7-101Q0-96 7-101"
          fill="none"
          stroke={colors.outline}
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d={`M-31-81Q-27-91 0-91Q27-91 31-81L35${torsoBottom}H-35Z`}
          fill={colors.clothing}
          stroke={colors.outline}
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        <path
          d={leftArm}
          fill="none"
          stroke={colors.outline}
          strokeLinecap="round"
          strokeWidth="9"
        />
        <path
          d={rightArm}
          fill="none"
          stroke={colors.outline}
          strokeLinecap="round"
          strokeWidth="9"
        />
        {seated ? (
          <>
            <path
              d="M-18-34Q-28-15-36 0"
              fill="none"
              stroke={colors.outline}
              strokeLinecap="round"
              strokeWidth="9"
            />
            <path
              d="M18-34Q28-15 36 0"
              fill="none"
              stroke={colors.outline}
              strokeLinecap="round"
              strokeWidth="9"
            />
          </>
        ) : (
          <>
            <path
              d="M-17-18L-20 0"
              fill="none"
              stroke={colors.outline}
              strokeLinecap="round"
              strokeWidth="10"
            >
              {motion === "walk" ? (
                <animate
                  attributeName="d"
                  dur="1.2s"
                  repeatCount="indefinite"
                  values="M-17-18L-27 0;M-17-18L-8 0;M-17-18L-27 0"
                />
              ) : null}
            </path>
            <path
              d="M17-18L20 0"
              fill="none"
              stroke={colors.outline}
              strokeLinecap="round"
              strokeWidth="10"
            >
              {motion === "walk" ? (
                <animate
                  attributeName="d"
                  dur="1.2s"
                  repeatCount="indefinite"
                  values="M17-18L8 0;M17-18L27 0;M17-18L8 0"
                />
              ) : null}
            </path>
          </>
        )}
      </g>
    </g>
  );
}

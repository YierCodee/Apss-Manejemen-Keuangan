/* ─── NevBank Shared Landing Theme ─── */
export const DS = {
  colors: {
    surface: "#faf8ff",
    surfaceDim: "#d2d9f4",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f2f3ff",
    surfaceContainer: "#eaedff",
    surfaceContainerHigh: "#e2e7ff",
    surfaceContainerHighest: "#dae2fd",
    onSurface: "#131b2e",
    onSurfaceVariant: "#404944",
    outline: "#707974",
    outlineVariant: "#bfc9c3",
    primary: "#003527",
    primaryContainer: "#064e3b",
    onPrimary: "#ffffff",
    onPrimaryContainer: "#80bea6",
    secondary: "#006c49",
    secondaryContainer: "#6cf8bb",
    onSecondaryContainer: "#00714d",
    tertiary: "#003625",
    tertiaryContainer: "#004f38",
    onTertiaryContainer: "#66c49d",
    error: "#ba1a1a",
    errorContainer: "#ffdad6",
    border: "#e5e7eb",
    positive: "#047857",
    positiveBg: "#ecfdf5",
    positiveBorder: "#a7f3d0",
    neutralBg: "#f1f5f9",
    neutralText: "#475569",
    neutralBorder: "#e2e8f0",
  },
  shadow: {
    level1: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.02)",
    level2: "0 4px 6px -1px rgba(6,78,59,0.04), 0 2px 4px -2px rgba(0,0,0,0.03)",
    level3: "0 20px 25px -5px rgba(15,23,42,0.08), 0 8px 10px -6px rgba(15,23,42,0.04)",
  },
} as const;

/* ─── Reusable Style Helpers ─── */
export const cardBase = {
  backgroundColor: DS.colors.surfaceContainerLowest,
  border: `1px solid ${DS.colors.border}`,
  borderRadius: "1.5rem",
  boxShadow: DS.shadow.level1,
} as const;

export const btnPrimary = {
  backgroundColor: DS.colors.primaryContainer,
  color: DS.colors.onPrimary,
  borderRadius: "1rem",
  fontWeight: 600,
  fontSize: "0.875rem",
  lineHeight: "20px",
  boxShadow: "0 4px 14px 0 rgba(6,78,59,0.25)",
  transition: "background-color 0.2s, box-shadow 0.2s, transform 0.15s",
} as const;

export const btnSecondary = {
  backgroundColor: DS.colors.surfaceContainerLowest,
  color: DS.colors.onSurface,
  border: `1px solid ${DS.colors.border}`,
  borderRadius: "1rem",
  fontWeight: 600,
  fontSize: "0.875rem",
  lineHeight: "20px",
  boxShadow: DS.shadow.level1,
  transition: "box-shadow 0.2s, border-color 0.2s",
} as const;

export const sectionLabel = {
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: DS.colors.surfaceContainer,
  borderRadius: "9999px",
  padding: "4px 12px",
} as const;

/* ─── Animations ─── */
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
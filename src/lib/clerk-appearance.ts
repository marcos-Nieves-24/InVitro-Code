export const clerkAppearance = {
  variables: {
    colorPrimary: "#00b2b2",
    colorText: "#111439",
    borderRadius: "10px",
    fontFamily: "var(--font-body)",
  },
  elements: {
    card: "bg-transparent shadow-none border-none",
    formButtonPrimary:
      "bg-mint text-ink hover:brightness-95 rounded-btn font-medium",
    formButtonSecondary:
      "border border-surface-raised bg-surface-card text-ink hover:bg-surface-raised",
    formFieldInput:
      "bg-white border border-surface-raised rounded-btn focus:border-mint focus:ring-2 focus:ring-mint/20",
    headerTitle: "text-ink font-display font-semibold",
    headerSubtitle: "text-storm",
    socialButtonsBlockButton:
      "border border-surface-raised bg-surface-card text-ink hover:bg-surface-raised",
    footerActionLink: "text-mint hover:text-mint/80",
  },
} as const;

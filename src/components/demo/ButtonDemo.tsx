import { type ReactNode } from "react";
import { ComponentCard } from "../ComponentCard";
import { MailIcon, ArrowRightIcon } from "../icons";
import {
  Button,
  type ButtonRadius,
  type ButtonSize,
  type ButtonVariant,
  type ButtonEffect,
} from "../ui/Button";

const VARIANTS: { type: ButtonVariant; label: string }[] = [
  { type: "default", label: "Default" },
  { type: "secondary", label: "Secondary" },
  { type: "outline", label: "Outline" },
  { type: "destructive", label: "Destructive" },
  { type: "ghost", label: "Ghost" },
  { type: "link", label: "Link" },
];

const SIZES: { type: ButtonSize; label: string }[] = [
  { type: "sm", label: "Small" },
  { type: "default", label: "Default" },
  { type: "lg", label: "Large" },
];

const RADIUS: { type: ButtonRadius; label: string }[] = [
  { type: "none", label: "Square" },
  { type: "md", label: "Rounded MD" },
  { type: "full", label: "Pill Shape" },
];

const BUTTON_STATES: {
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  ariaLabel?: string;
}[] = [
  { label: "Save Changes", isLoading: true },
  { label: "Loading", variant: "outline", isLoading: true },
  { label: "Disabled", disabled: true },
  { size: "icon", isLoading: true, ariaLabel: "Loading icon" },
];

const ICON_EXAMPLES: {
  label: string;
  icon: ReactNode;
  iconPlacement: "left" | "right";
  variant?: ButtonVariant;
}[] = [
  { label: "Email Me", icon: <MailIcon />, iconPlacement: "left" },
  {
    label: "Continue",
    icon: <ArrowRightIcon />,
    iconPlacement: "right",
    variant: "outline",
  },
];

const SPECIAL_EFFECTS: ({
  label: string;
  effect: ButtonEffect;
  variant?: ButtonVariant;
} & (
  | { icon: ReactNode; iconPlacement: "left" | "right" }
  | { icon?: never; iconPlacement?: never }
))[] = [
  {
    label: "Expand Icon",
    effect: "expandIcon",
    icon: <ArrowRightIcon />,
    iconPlacement: "right",
  },
  { label: "Ring Hover", effect: "ringHover", variant: "outline" },
  { label: "Shine Hover", effect: "shineHover" },
  { label: "Gooey Right", effect: "gooeyRight", variant: "outline" },
  { label: "Underline", effect: "underline", variant: "ghost" },
  { label: "Hover Underline", effect: "hoverUnderline", variant: "ghost" },
];

export function ButtonDemo() {
  return (
    <div className="w-full flex flex-col gap-8">
      <ComponentCard
        title="Variants"
        description="The base visual styles for the button."
        code={`
          import { Button } from "@/components/ui/Button";

          const VARIANTS = [
            { type: "default", label: "Default" },
            { type: "secondary", label: "Secondary" },
            { type: "outline", label: "Outline" },
            { type: "destructive", label: "Destructive" },
            { type: "ghost", label: "Ghost" },
            { type: "link", label: "Link" },
          ];

          export default function App() {
            return (
              <div className="flex flex-wrap gap-4">
                {VARIANTS.map((v) => (
                  <Button key={v.type} variant={v.type}>
                    {v.label}
                  </Button>
                ))}
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          {VARIANTS.map((v) => (
            <Button key={v.type} variant={v.type}>
              {v.label}
            </Button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Sizes & Radius"
        description="Different sizes, icon-only variants, and border-radius options."
        code={`
          import { Button } from "@/components/ui/Button";
          import { MailIcon } from "@/components/icons";

          const SIZES = [
            { type: "sm", label: "Small" },
            { type: "default", label: "Default" },
            { type: "lg", label: "Large" },
          ];

          const RADIUS = [
            { type: "none", label: "Square" },
            { type: "md", label: "Rounded MD" },
            { type: "full", label: "Pill Shape" },
          ];

          export default function App() {
            return (
              <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-wrap gap-4">
                  {SIZES.map((s) => (
                    <Button key={s.type} size={s.type}>{s.label}</Button>
                  ))}
                  <Button size="icon" aria-label="Icon only"><MailIcon /></Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  {RADIUS.map((r) => (
                    <Button key={r.type} radius={r.type}>{r.label}</Button>
                  ))}
                </div>
              </div>
            )
          }
        `}
      >
        <div className="flex flex-col gap-6 w-full items-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {SIZES.map((s) => (
              <Button key={s.type} size={s.type}>
                {s.label}
              </Button>
            ))}
            <Button size="icon" aria-label="Icon only">
              <MailIcon />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {RADIUS.map((r) => (
              <Button key={r.type} radius={r.type}>
                {r.label}
              </Button>
            ))}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="States"
        description="Built-in loading spinners and disabled states."
        code={`
          import { Button } from "@/components/ui/Button";

          const BUTTON_STATES = [
            { label: "Save Changes", isLoading: true },
            { label: "Loading", variant: "outline", isLoading: true },
            { label: "Disabled", disabled: true },
            { size: "icon", isLoading: true, ariaLabel: "Loading" },
          ];

          export default function App() {
            return (
              <div className="flex flex-wrap gap-4">
                {BUTTON_STATES.map((state, idx) => (
                  <Button
                    key={idx}
                    variant={state.variant}
                    size={state.size}
                    isLoading={state.isLoading}
                    disabled={state.disabled}
                    aria-label={state.ariaLabel}
                  >
                    {state.label}
                  </Button>
                ))}
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          {BUTTON_STATES.map((state, idx) => (
            <Button
              key={idx}
              variant={state.variant}
              size={state.size}
              isLoading={state.isLoading}
              disabled={state.disabled}
              aria-label={state.ariaLabel}
            >
              {state.label}
            </Button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Icons"
        description="Adding icons to the left or right of the text."
        code={`
          import { Button } from "@/components/ui/Button";
          import { MailIcon, ArrowRightIcon } from "@/components/icons";

          const ICON_EXAMPLES = [
            { label: "Email Me", icon: <MailIcon />, iconPlacement: "left" },
            { label: "Continue", icon: <ArrowRightIcon />, iconPlacement: "right", variant: "outline" },
          ];

          export default function App() {
            return (
              <div className="flex flex-wrap gap-4">
                {ICON_EXAMPLES.map((ex, i) => (
                  <Button
                    key={i}
                    variant={ex.variant}
                    icon={ex.icon}
                    iconPlacement={ex.iconPlacement}
                  >
                    {ex.label}
                  </Button>
                ))}
              </div>
            )
          }
        `}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          {ICON_EXAMPLES.map((ex, i) => (
            <Button
              key={i}
              variant={ex.variant}
              icon={ex.icon}
              iconPlacement={ex.iconPlacement}
            >
              {ex.label}
            </Button>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard
        title="Special Effects"
        description="Advanced CSS-only hover and interaction effects."
        code={`
          import { Button } from "@/components/ui/Button";
          import { ArrowRightIcon } from "@/components/icons";

          const SPECIAL_EFFECTS = [
            { label: "Expand Icon", effect: "expandIcon", icon: <ArrowRightIcon />, iconPlacement: "right" },
            { label: "Ring Hover", effect: "ringHover", variant: "outline" },
            { label: "Shine Hover", effect: "shineHover" },
            { label: "Gooey Right", effect: "gooeyRight", variant: "outline" },
            { label: "Underline", effect: "underline", variant: "ghost" },
            { label: "Hover Underline", effect: "hoverUnderline", variant: "ghost" },
          ];

          export default function App() {
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SPECIAL_EFFECTS.map((eff, i) => {
                  const iconProps = eff.icon
                    ? { icon: eff.icon, iconPlacement: eff.iconPlacement }
                    : {};

                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-muted-foreground">{eff.label}</span>
                      <Button
                        effect={eff.effect}
                        variant={eff.variant}
                        {...(iconProps as any)}
                      >
                        {eff.label}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )
          }
        `}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
          {SPECIAL_EFFECTS.map((eff, i) => {
            const iconProps = eff.icon
              ? { icon: eff.icon, iconPlacement: eff.iconPlacement }
              : {};

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {eff.label}
                </span>
                <Button
                  effect={eff.effect}
                  variant={eff.variant}
                  {...(iconProps as any)}
                >
                  {eff.label}
                </Button>
              </div>
            );
          })}
        </div>
      </ComponentCard>
    </div>
  );
}

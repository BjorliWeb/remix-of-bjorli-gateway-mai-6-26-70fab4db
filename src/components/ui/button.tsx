import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Pill shape everywhere: matches the circular Bjorli mark and the header
  // CTA, so every call-to-action on the site shares one silhouette.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out-expo active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_1px_2px_hsl(var(--foreground)/0.12)] hover:shadow-[0_10px_24px_-12px_hsl(var(--primary)/0.6)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-foreground/15 bg-transparent text-foreground hover:border-foreground/35 hover:bg-foreground/[0.04]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Seasonal accent — the primary action over photography and dark
        // surfaces (hero, campaign). Same fill as the header CTA.
        season:
          "bg-season text-season-foreground font-semibold shadow-[0_10px_30px_-10px_hsl(var(--season-accent)/0.75)] ring-1 ring-inset ring-white/20 hover:brightness-[1.06] hover:shadow-[0_14px_36px_-10px_hsl(var(--season-accent)/0.85)]",
        // Primary call to action (winter: warm red, summer: deep green).
        cta: "bg-cta text-cta-foreground font-semibold hover:bg-cta-hover shadow-[0_1px_2px_hsl(var(--foreground)/0.15)]",
        // Clear secondary action on light surfaces.
        "outline-strong": "border-2 border-primary bg-transparent text-primary font-semibold hover:bg-primary hover:text-primary-foreground",
        // Quiet secondary action over photography.
        glass:
          "border border-white/40 bg-[hsl(var(--hero-overlay)/0.28)] text-white backdrop-blur-md hover:bg-[hsl(var(--hero-overlay)/0.42)] hover:border-white/60",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-11 px-7",
        xl: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

interface BrandIconProps {
  icon: { path: string };
  className?: string;
}

export function BrandIcon({ icon, className }: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className={className} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

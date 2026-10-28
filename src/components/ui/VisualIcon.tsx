import type { SVGProps } from 'react'

export type IconName =
  | 'overview'
  | 'people'
  | 'contracts'
  | 'arrow-up-right'
  | 'arrow-right'
  | 'arrow-left'
  | 'plus'
  | 'close'
  | 'menu'
  | 'edit'
  | 'trash'
  | 'search'
  | 'chevron-left'
  | 'chevron-right'
  | 'check'
  | 'shield'
  | 'clock'
  | 'spark'
  | 'filter'
  | 'lock'

interface VisualIconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export default function VisualIcon({ name, size = 20, ...props }: VisualIconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    people: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5v1"/></>,
    contracts: <><path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h5M9 13h6M9 17h6"/></>,
    'arrow-up-right': <><path d="M5 19 19 5M8 5h11v11"/></>,
    'arrow-right': <><path d="M4 12h16M13 5l7 7-7 7"/></>,
    'arrow-left': <><path d="M20 12H4m7 7-7-7 7-7"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="M5 5l14 14M19 5 5 19"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4M14 5l2-2 5 5-2 2"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6M14 11v6"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    'chevron-left': <><path d="m15 18-6-6 6-6"/></>,
    'chevron-right': <><path d="m9 18 6-6-6-6"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></>,
    spark: <><path d="m12 2 1.8 7 7.2 3-7.2 2.9L12 22l-2-7.1L3 12l7-3 2-7ZM19 2v5M16.5 4.5h5"/></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}

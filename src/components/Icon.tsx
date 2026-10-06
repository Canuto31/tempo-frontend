interface IconProps {
  name:
    | 'activity'
    | 'check'
    | 'folder'
    | 'grid'
    | 'refresh'
    | 'tag'
    | 'terminal'
    | 'users'
  size?: number
}

const paths = {
  activity: <><path d="M4 12h3l2-7 4 14 2-7h5" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
  tag: <><path d="M20 13 13 20l-9-9V4h7z" /><circle cx="8.5" cy="8.5" r="1" /></>,
  terminal: <><path d="m6 8 4 4-4 4" /><path d="M12 16h6" /><rect x="3" y="4" width="18" height="16" rx="2" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
} as const

export function Icon({ name, size = 20 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  )
}

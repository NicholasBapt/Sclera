import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'primary' | 'secondary' | 'tertiary'
  title?: string
  children: ReactNode
}

export default function CardComponent({ variant = 'tertiary', title, children, className = '', ...props }: CardProps) {
  return (
    <section className={`surface-card surface-${variant} ${className}`} {...props}>
      {title && <div className="surface-card-heading">{title}</div>}
      {children}
    </section>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import VisualIcon, { type IconName } from './ui/VisualIcon'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'pagination' | 'sidebar'
  size?: 'md' | 'sm' | 'xsm'
  border?: boolean
  icon?: IconName
  disabled?: boolean
  children?: ReactNode
}

export default function Button({ variant = 'primary', size = 'md', border, icon, disabled, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`action-button action-${variant} action-${size} ${border ? 'action-outlined' : ''} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {icon && <VisualIcon name={icon} size={size === 'xsm' ? 14 : 17} />}
      {children}
    </button>
  )
}

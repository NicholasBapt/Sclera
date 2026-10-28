import type { InputHTMLAttributes } from 'react'

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: 'md' | 'sm'
  variant?: 'primary'
}

export default function TextInput({ size = 'md', className = '', ...props }: TextInputProps) {
  return <input className={`form-input input-${size} ${className}`} {...props} />
}

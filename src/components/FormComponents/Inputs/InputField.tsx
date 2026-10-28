import type { ComponentProps } from 'react'
import TextInput from './TextInput'

type InputFieldProps = Omit<ComponentProps<typeof TextInput>, 'variant'> & { label: string }

export default function InputField({ label, id, className = '', ...inputProps }: InputFieldProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <label className={`field-group ${className}`} htmlFor={inputId}>
      <span className="field-label">{label}</span>
      <TextInput id={inputId} {...inputProps} />
    </label>
  )
}

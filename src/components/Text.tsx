import React from 'react'

type TextProps = {
  as?: keyof React.JSX.IntrinsicElements
  variant?: 'heading-lg' | 'heading-lg-regular' | 'heading-sm' | 'body-md' | 'body-md-bold' | 'body-sm' | 'body-sm-bold'
  textColor?: 'primary' | 'secondary'
  className?: string
  children?: React.ReactNode
}

export default function Text({ as = 'span', variant = 'body-md', textColor = 'primary', className = '', children }: TextProps) {
  return React.createElement(as, { className: `text-component text-${variant} text-${textColor} ${className}` }, children)
}

import React from 'react'
import * as Icons from 'react-icons/fi'

interface IconRendererProps {
  icon: string
  className?: string
  size?: number
}

export const IconRenderer: React.FC<IconRendererProps> = ({ 
  icon, 
  className = "w-5 h-5", 
  size 
}) => {
  // Check if it's a React Icon (starts with Fi)
  if (icon.startsWith('Fi') && icon in Icons) {
    const IconComponent = Icons[icon as keyof typeof Icons]
    return <IconComponent className={className} size={size} />
  }
  
  // Otherwise, treat it as an emoji or text
  return <span className={className}>{icon}</span>
} 
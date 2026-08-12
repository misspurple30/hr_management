type Size = 'sm' | 'md' | 'lg';

interface AvatarProps {
  firstName: string;
  lastName: string;
  color?: string | null;
  size?: Size;
  className?: string;
}

const sizeStyles: Record<Size, string> = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export default function Avatar({ firstName, lastName, color, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 rounded-full font-semibold text-white ${
        color ? '' : 'bg-gradient-to-br from-primary-500 to-primary-700'
      } ${sizeStyles[size]} ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}

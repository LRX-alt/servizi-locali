'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4'
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6'
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8'
  }
};

export default function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const { container, icon } = sizeMap[size];
  const containerClasses = `${container} relative rounded-full overflow-hidden flex items-center justify-center ${className}`;

  if (!src) {
    return (
      <div className={`${containerClasses} bg-blue-100`}>
        <User className={`${icon} text-blue-600`} />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`(max-width: 768px) ${container.split(' ')[0]}, ${container.split(' ')[0]}`}
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}
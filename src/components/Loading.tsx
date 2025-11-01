'use client';

import { ReactNode } from 'react';

interface LoadingProps {
  children?: ReactNode;
  show?: boolean;
}

export default function Loading({ children, show = false }: LoadingProps) {
  const content = children || 'Loading';

  return (
    <div className={`loading ${show ? 'show' : ''}`}>
      <div className="loading-inner">
        <h2 className="loader">{content}</h2>
      </div>
    </div>
  );
}


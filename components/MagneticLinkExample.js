'use client';

import React from 'react';
import Link from 'next/link';
import MagneticWrapper from './MagneticWrapper';

export default function MagneticLinkExample() {
  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <MagneticWrapper radius={150} strength={0.4}>
        <Link
          href="#"
          style={{
            display: 'inline-block',
            padding: '16px 32px',
            backgroundColor: '#ccf200',
            color: '#000',
            fontWeight: 'bold',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #000'
          }}
        >
          Hover over me
        </Link>
      </MagneticWrapper>
    </div>
  );
}

import Experience3DPreview from '@/components/Experience3DPreview';

export const metadata = {
  title: '3D Timeline Preview | Hazem Hassine',
  description: 'Experimental 3D wireframe interactions for the About timeline.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThreeDPreviewPage() {
  return <Experience3DPreview />;
}

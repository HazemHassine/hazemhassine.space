import MagneticLinkExample from '@/components/MagneticLinkExample';

export default function MagneticDemoPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>
      <h1 style={{ marginBottom: '2rem', fontFamily: 'monospace' }}>Magnetic Wrapper Demo</h1>
      <MagneticLinkExample />
    </div>
  );
}

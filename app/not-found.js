import NotFoundGridGame from '@/components/NotFoundGridGame';

export const metadata = {
  title: '404 // VOID GRID — Mohamed Hazem Hassine',
  description: '404 Route Not Found. Pilot the cyber glider across the vaporwave noise grid.',
};

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-[#050505] overflow-hidden">
      <NotFoundGridGame />
    </main>
  );
}

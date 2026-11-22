import LandingThemeProvider from '@/components/public/LandingThemeProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programa de afiliados | cardap.io',
  description: 'Indique restaurantes, acompanhe suas indicações e comissões no cardap.io.',
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return <LandingThemeProvider>{children}</LandingThemeProvider>;
}

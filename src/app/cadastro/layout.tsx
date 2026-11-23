import LandingThemeProvider from '@/components/public/LandingThemeProvider';

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return <LandingThemeProvider>{children}</LandingThemeProvider>;
}

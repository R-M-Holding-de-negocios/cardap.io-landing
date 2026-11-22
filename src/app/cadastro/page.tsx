import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegistrationForm from './RegistrationForm';

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function CadastroPage(){
  return <Suspense fallback={<main className="min-h-screen bg-cream p-8">Carregando cadastro...</main>}><RegistrationForm/></Suspense>;
}

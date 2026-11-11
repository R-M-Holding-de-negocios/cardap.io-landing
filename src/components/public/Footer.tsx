import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/public/BrandLogo';
import { productUrl } from '@/lib/product-url';

export default function Footer() {
  return (
    <footer className="bg-peach text-muted pt-16 pb-12 border-t border-outline">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-outline">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo size={52} />
            <p className="text-sm text-muted leading-relaxed">
              Atendimento inteligente e gestão de salão por aproximação NFC e QR Code dinâmico. Seu cliente chama em 1 clique, sua equipe atende com máxima velocidade.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-peach border border-outline text-sm text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>100% em conformidade com a LGPD</span>
            </div>
          </div>

          {/* Links Operação */}
          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href={productUrl('/recursos')} className="hover:text-ink transition-colors">
                  Recursos & Funcionalidades
                </Link>
              </li>
              <li>
                <Link href="/#simulador" className="hover:text-ink transition-colors">
                  Demonstração Interativa
                </Link>
              </li>
              <li>
                <Link href="/#calculadora" className="hover:text-ink transition-colors">
                  Calculadora de Giro de Mesa
                </Link>
              </li>
              <li>
                <Link href={productUrl('/dashboard')} className="hover:text-ink transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Dashboard ao Vivo
                </Link>
              </li>
              <li>
                <Link href={productUrl('/tv/est-anfc-001')} className="hover:text-ink transition-colors">
                  Modo TV / Painel KDS
                </Link>
              </li>
              <li>
                <Link href={productUrl('/waiter')} className="hover:text-ink transition-colors">
                  Mobile do Garçom
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Comerciais */}
          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Planos & Negócios</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href={productUrl('/cadastro')} className="hover:text-ink transition-colors text-action font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Trial Grátis 10 Dias (Pro)
                </Link>
              </li>
              <li>
                <Link href={productUrl('/recursos#planos')} className="hover:text-ink transition-colors">
                  Tabela Comparativa de Planos
                </Link>
              </li>
              <li>
                <Link href={productUrl('/parceiros')} className="hover:text-ink transition-colors">
                  Programa de Afiliados (25% Recorrente)
                </Link>
              </li>
              <li>
                <Link href={productUrl('/partner/login')} className="hover:text-ink transition-colors">
                  Portal do Parceiro
                </Link>
              </li>
              <li>
                <Link href={productUrl('/atendimento')} className="hover:text-ink transition-colors">
                  Central de Suporte & Chamados
                </Link>
              </li>
            </ul>
          </div>

          {/* Segurança & Contato */}
          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Sobre a plataforma</h4>
            <div className="space-y-2 text-sm text-muted leading-relaxed">
              <p className="font-semibold text-muted">
                Anfc Cardapios Tecnologia
              </p>
              <p>Tecnologia 100% Brasileira • Servidores de Baixa Latência</p>
              <div className="pt-2">
                <p className="text-muted text-sm">
                  Tecnologia desenvolvida para eliminar filas, aumentar o giro das mesas e fidelizar clientes em bares e restaurantes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted gap-4">
          <p>© {new Date().getFullYear()} Anfc Cardapios. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Escaneou. Chamou. Chegou.</span>
            <span>•</span>
            <span>Seu cliente chama. Sua equipe atende.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

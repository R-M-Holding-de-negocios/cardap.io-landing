import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';
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
              Com o cardap.io, seus clientes consultam o menu pelo celular e sua equipe acompanha pedidos, chamadas e solicitações de atendimento em um só lugar.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-peach border border-outline text-sm text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Cardápio, pedidos e atendimento</span>
            </div>
          </div>

          {/* Links Operação */}
          <div>
            <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-4">Plataforma</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href={productUrl('/recursos')} className="hover:text-ink transition-colors">
                  Cardápio digital
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="hover:text-ink transition-colors">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/#sistema" className="hover:text-ink transition-colors">
                  Prévia do sistema
                </Link>
              </li>
              <li>
                <Link href="/#planos" className="hover:text-ink transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/#atendimento" className="hover:text-ink transition-colors">
                  Gestão do restaurante
                </Link>
              </li>
              <li>
                <Link href="/#atendimento" className="hover:text-ink transition-colors">
                  Atendimento do salão
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
                  Criar conta e escolher plano
                </Link>
              </li>
              <li>
                <Link href={productUrl('/recursos')} className="hover:text-ink transition-colors">
                  Ver planos e recursos
                </Link>
              </li>
              <li>
                <Link href={productUrl('/parceiros')} className="hover:text-ink transition-colors">
                  Programa de parceiros
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
                cardap.io
              </p>
              <p>Cardápio digital, pedidos e ferramentas de gestão para restaurantes.</p>
              <div className="pt-2">
                <p className="text-muted text-sm">
                  Ferramentas reunidas para apoiar a rotina da equipe do restaurante.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted gap-4">
          <p>© {new Date().getFullYear()} cardap.io. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Cardápio digital e atendimento</span>
            <span>•</span>
            <span>cardap.io</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

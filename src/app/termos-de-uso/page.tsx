import type { Metadata } from 'next';
import LegalPage from '@/components/public/LegalPage';

export const metadata: Metadata = { title: 'Termos de Uso | cardap.io', robots: { index: false, follow: true } };

export default function TermsPage() {
  return <LegalPage title="Termos de Uso">
    <section><h2 className="text-2xl font-black">1. Responsável e alcance</h2><p>Responsável pelo serviço: <strong>[PREENCHER: razão social ou nome, CNPJ/CPF, endereço e canal de contato]</strong>. Estes termos descrevem o uso público desta página de apresentação. A contratação e o uso do sistema de cardápios ocorrem em outra aplicação e dependem de termos próprios, a serem confirmados pelo responsável.</p></section>
    <section><h2 className="text-2xl font-black">2. Funcionalidades</h2><p>Esta página apresenta o cardápio digital, a gestão de pedidos e atendimento e uma prévia interativa sem envio de pedidos reais. Os links de cadastro, login, suporte e parceiros levam ao sistema principal. A disponibilidade, condições comerciais e recursos efetivos devem ser verificados na contratação.</p></section>
    <section><h2 className="text-2xl font-black">3. Uso adequado</h2><p>O visitante pode consultar o conteúdo e acessar os links disponibilizados. É vedado interferir no funcionamento da página, tentar acessar áreas ou dados sem autorização, explorar falhas ou usar conteúdo de terceiros em violação de direitos. O uso de contas, permissões e suspensão de acesso no sistema principal requer regras contratuais próprias.</p></section>
    <section><h2 className="text-2xl font-black">4. Conteúdo e propriedade intelectual</h2><p>Textos, identidade visual e materiais desta página são protegidos pela legislação aplicável, ressalvados direitos de terceiros. O acesso à página não concede licença para reproduzir marcas ou conteúdo fora dos limites legais.</p></section>
    <section><h2 className="text-2xl font-black">5. Disponibilidade e responsabilidade</h2><p>Podem ocorrer interrupções técnicas. Isso não afasta direitos assegurados por lei nem a responsabilidade legal do fornecedor. Informações sobre planos e recursos devem ser confirmadas no sistema de contratação; esta página não efetua pagamentos.</p></section>
    <section><h2 className="text-2xl font-black">6. Cadastro, pagamento e cancelamento</h2><p>Esta landing não cria contas nem processa pagamentos. Antes de disponibilizar a contratação, o responsável deve publicar no sistema principal as condições de preço, cobrança, renovação, cancelamento, suporte, direito de arrependimento quando aplicável e o mecanismo de aceite dos termos contratuais. <strong>[PREENCHER: condições comerciais verificadas]</strong>.</p></section>
    <section><h2 className="text-2xl font-black">7. Alterações e contato</h2><p>Alterações serão publicadas nesta página com nova data de atualização; mudanças contratuais relevantes do sistema principal exigem comunicação adequada. Para dúvidas: <strong>[PREENCHER: canal de contato]</strong>.</p><p>Última atualização: 14/11/2026. Versão da landing: 1.0.</p></section>
  </LegalPage>;
}

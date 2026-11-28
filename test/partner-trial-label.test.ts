// F3-T1 do repositório Anfc-Cardapios: no portal do afiliado, "em teste" é o teste grátis da promoção.
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('o portal chama a contagem pelo nome da promoção', () => {
  expect(readFileSync('src/components/partner/PartnerTrafficSummary.tsx', 'utf8')).toContain('Restaurantes em teste grátis');
});

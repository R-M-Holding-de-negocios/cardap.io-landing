export interface LandingAsset {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: 'dish' | 'service' | 'device';
}

export const LANDING_ICONS: Record<string, LandingAsset> = {
  burger: {
    id: 'burger',
    src: '/images/landing/hamburguer-artesanal.png',
    alt: 'Hambúrguer artesanal suculento em tons pastel',
    title: 'Burgers & Sanduíches',
    description: 'Apresentação irresistível de hambúrgueres artesanais com fotos em alta definição.',
    category: 'dish',
  },
  bell: {
    id: 'bell',
    src: '/images/landing/campainha-pastel.png',
    alt: 'Campainha de atendimento de salão em tons pastel',
    title: 'Chamado em 1 Toque',
    description: 'Chame o garçom instantaneamente sem precisar levantar a mão ou assobiar.',
    category: 'service',
  },
  smartphone: {
    id: 'smartphone',
    src: '/images/landing/smartphone-cardapio.png',
    alt: 'Smartphone com prato de massa ilustrado em tons pastel',
    title: 'Mesa Conectada NFC & QR',
    description: 'Aproximação NFC ou leitura de QR Code direto no navegador sem instalar apps.',
    category: 'device',
  },
  pizza: {
    id: 'pizza',
    src: '/images/landing/fatia-pizza.png',
    alt: 'Fatia de pizza apetitosa em tons de pêssego',
    title: 'Pizzas & Porções',
    description: 'Perfeito para pizzarias e chopperias com alta rotatividade de mesas.',
    category: 'dish',
  },
  menu: {
    id: 'menu',
    src: '/images/landing/menu-aberto.png',
    alt: 'Menu aberto de restaurante em tons pastel',
    title: 'Cardápio Interativo',
    description: 'Cardápio digital com categorias, fotos, preços e vídeos curtos dos pratos.',
    category: 'service',
  },
  dishPlate: {
    id: 'dishPlate',
    src: '/images/landing/prato-talheres.png',
    alt: 'Prato e talheres elegantes em pêssego e creme',
    title: 'Pratos Principais',
    description: 'Valorize pratos executivos e gastronomia refinada com apresentação impecável.',
    category: 'dish',
  },
  drink: {
    id: 'drink',
    src: '/images/landing/copo-citrico.png',
    alt: 'Copo listrado com rodela cítrica refrescante',
    title: 'Drinks & Bebidas',
    description: 'Carta de coquetéis, chopes e bebidas geladas pedidas em segundos.',
    category: 'dish',
  },
  chef: {
    id: 'chef',
    src: '/images/landing/toque-chef.png',
    alt: 'Toque de chef em tons pastel representando a cozinha',
    title: 'Cozinha & KDS',
    description: 'Sincronização imediata com garçons e equipe da cozinha para agilizar pedidos.',
    category: 'service',
  },
};

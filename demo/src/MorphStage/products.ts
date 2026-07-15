import type { Product } from './types'

/** 6 demo products shared across all MorphStage templates */
export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Quantum Headphones',
    price: 299,
    currency: '€',
    description:
      'Noise-cancelling com áudio espacial. Bateria de 30 horas, Bluetooth 5.3.',
    category: 'Audio',
    rating: 4.7,
    colors: ['#1a1a2e', '#e8e8e8', '#c0392b'],
    imageGradient: 'linear-gradient(135deg, #1a1a3e, #2d2d6b)',
    imageIcon: '🎧',
    features: {
      bluetooth: true,
      noiseCancelling: true,
      waterproof: false,
      wireless: true,
      rgb: false,
      '4k': false,
    },
    learnSteps: [
      {
        title: 'Spatial Audio Engine',
        body: 'Os Quantum Headphones usam um processador de áudio espacial dedicado que cria uma paisagem sonora 3D imersiva. Cada driver de 40mm é calibrado individualmente para resposta de frequência plana.',
      },
      {
        title: 'Adaptive Noise Cancelling',
        body: 'Seis microfones analisam o ambiente 200 vezes por segundo. O algoritmo ANC adapta-se em tempo real — reduz o ruído do motor no avião mas deixa passar anúncios importantes.',
      },
      {
        title: 'Battery & Connectivity',
        body: '30 horas com ANC ativo, 45 sem. Carregamento rápido: 10 minutos = 4 horas. Bluetooth 5.3 com Multipoint — liga ao telefone e laptop simultaneamente.',
      },
      {
        title: 'Comfort Engineering',
        body: 'Espuma viscoelástica com memória revestida a proteína. Peso de apenas 250g. Testados em mais de 500 formatos de cabeça diferentes para garantir conforto durante uso prolongado.',
      },
    ],
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 449,
    currency: '€',
    description:
      'Monitor de saúde com GPS integrado. Ecrã AMOLED always-on.',
    category: 'Wearables',
    rating: 4.5,
    colors: ['#1a1a2e', '#c0c0c0', '#d4a574'],
    imageGradient: 'linear-gradient(135deg, #1e1e3a, #3a2a5c)',
    imageIcon: '⌚',
    features: {
      bluetooth: true,
      noiseCancelling: false,
      waterproof: true,
      wireless: true,
      rgb: false,
      '4k': false,
    },
    learnSteps: [
      {
        title: 'Health Sensor Array',
        body: 'O Smart Watch Pro integra sensor de ritmo cardíaco PPG, SpO2, temperatura da pele e ECG. Todos os dados são processados no dispositivo com machine learning on-device.',
      },
      {
        title: 'GPS & Navigation',
        body: 'GPS de dupla frequência (L1+L5) com precisão de 1 metro. Mapas offline para 150 países. Bússola e altímetro barométrico para tracking de elevação.',
      },
      {
        title: 'Battery & Display',
        body: 'Ecrã AMOLED LTPO de 1.9" com always-on. Brilho máximo de 2000 nits. Bateria de 14 dias em modo smartwatch, 40 horas com GPS contínuo.',
      },
      {
        title: 'Ecosystem Integration',
        body: 'Compatível com iOS e Android. Sincronização com Apple Health, Google Fit e Strava. Notificações inteligentes que só interrompem quando é realmente importante.',
      },
    ],
  },
  {
    id: 3,
    name: 'UltraWide Monitor',
    price: 899,
    currency: '€',
    description: '34" curved, 144Hz, 1ms. HDR600, USB-C 90W.',
    category: 'Displays',
    rating: 4.8,
    colors: ['#1a1a2e', '#f5f5f5'],
    imageGradient: 'linear-gradient(135deg, #0f0f2a, #1a3a4a)',
    imageIcon: '🖥️',
    features: {
      bluetooth: false,
      noiseCancelling: false,
      waterproof: false,
      wireless: false,
      rgb: true,
      '4k': true,
    },
    learnSteps: [
      {
        title: 'Panel Technology',
        body: 'Painel VA curvo 1500R de 34 polegadas com resolução UWQHD (3440×1440). Relação de contraste nativa de 3000:1 com certificação VESA DisplayHDR 600.',
      },
      {
        title: 'Gaming Performance',
        body: '144Hz refresh rate com Adaptive-Sync (FreeSync Premium Pro + G-Sync Compatible). Tempo de resposta de 1ms (MPRT). Low Framerate Compensation para jogos abaixo de 48fps.',
      },
      {
        title: 'Connectivity Hub',
        body: 'USB-C com Power Delivery 90W — carrega o laptop enquanto transmite vídeo. 2× HDMI 2.1, 1× DisplayPort 1.4, hub USB 3.2 com 4 portas. KVM switch integrado.',
      },
      {
        title: 'Ergonomics',
        body: 'Ajuste de altura (130mm), tilt (-5° a +20°), swivel (±30°). Modo Picture-by-Picture para duas fontes lado a lado. Low Blue Light certificado pela TÜV Rheinland.',
      },
    ],
  },
  {
    id: 4,
    name: 'Mech Keyboard RGB',
    price: 159,
    currency: '€',
    description:
      'Switches Cherry MX, hot-swappable. Layout 75%, alumínio CNC.',
    category: 'Peripherals',
    rating: 4.6,
    colors: ['#1a1a2e', '#e8e8e8', '#8B6DFF'],
    imageGradient: 'linear-gradient(135deg, #1a1a35, #3a1a5e)',
    imageIcon: '⌨️',
    features: {
      bluetooth: true,
      noiseCancelling: false,
      waterproof: false,
      wireless: true,
      rgb: true,
      '4k': false,
    },
    learnSteps: [
      {
        title: 'Switch Ecosystem',
        body: 'Vem com Cherry MX Red (linear, 45g). PCB hot-swappable compatível com switches de 3 e 5 pinos — Cherry, Gateron, Kailh, Outemu. Troca todos os switches sem soldar.',
      },
      {
        title: 'Build Quality',
        body: 'Case em alumínio 6063 CNC com weight bar de latão. Plate em policarbonato para som "thock" profundo. Gasket mount com 6 pontos de isolamento de vibração.',
      },
      {
        title: 'Lighting & Software',
        body: 'RGB por tecla com 16.8M cores. 22 efeitos de iluminação pré-programados. Software QMK/VIA open-source — programa macros, layers e iluminação sem instalar nada.',
      },
      {
        title: 'Connectivity',
        body: 'Bluetooth 5.1 (até 3 dispositivos) + USB-C com polling rate de 1000Hz. Bateria de 4000mAh para 40 horas com RGB ligado. Cabo USB-C em espiral incluído.',
      },
    ],
  },
  {
    id: 5,
    name: 'Wireless Mouse',
    price: 89,
    currency: '€',
    description: 'Ergonomic, 8 buttons, 70h battery. Sensor 26K DPI.',
    category: 'Peripherals',
    rating: 4.4,
    colors: ['#1a1a2e', '#f0f0f0', '#FF5C9D'],
    imageGradient: 'linear-gradient(135deg, #1a1a35, #2a1a45)',
    imageIcon: '🖱️',
    features: {
      bluetooth: true,
      noiseCancelling: false,
      waterproof: false,
      wireless: true,
      rgb: true,
      '4k': false,
    },
    learnSteps: [
      {
        title: 'Sensor Precision',
        body: 'Sensor ótico Hero 26K com DPI ajustável de 100 a 26.000. Tracking a 400 IPS com aceleração de 40G. Zero smoothing, filtering ou acceleration — movimento 1:1 puro.',
      },
      {
        title: 'Ergonomic Design',
        body: 'Forma assimétrica para mão direita com thumb rest. 8 botões programáveis incluindo scroll wheel com tilt. Peso de 78g com estrutura interna em honeycomb.',
      },
      {
        title: 'Battery & Charging',
        body: '70 horas de autonomia contínua. Carregamento USB-C — 5 minutos de carga dá 3 horas de uso. Indicador LED de bateria com 3 níveis.',
      },
      {
        title: 'Wireless Performance',
        body: 'Lightspeed wireless com latência de 1ms. Frequência de 2.4GHz com channel hopping anti-interferência. Também funciona via Bluetooth para portáteis e tablets.',
      },
    ],
  },
  {
    id: 6,
    name: 'Webcam 4K',
    price: 199,
    currency: '€',
    description: 'Auto-focus, ring light integrado. Microfone stereo, 60fps.',
    category: 'Streaming',
    rating: 4.3,
    colors: ['#1a1a2e', '#ffffff'],
    imageGradient: 'linear-gradient(135deg, #1a1a35, #1a3040)',
    imageIcon: '📷',
    features: {
      bluetooth: false,
      noiseCancelling: true,
      waterproof: false,
      wireless: false,
      rgb: false,
      '4k': true,
    },
    learnSteps: [
      {
        title: 'Image Quality',
        body: 'Sensor Sony STARVIS de 1/2.5" com resolução 4K a 60fps. Lente de 5 elementos com abertura f/1.8. Auto-focus por deteção de fase em 0.15 segundos.',
      },
      {
        title: 'Integrated Ring Light',
        body: 'Anel de LED com 3 níveis de intensidade e temperatura de cor ajustável (2700K-6500K). Iluminação difusa sem shadows duras — parece um softbox profissional.',
      },
      {
        title: 'Audio System',
        body: 'Dois microfones omnidirecionais com beamforming e noise cancellation. Captura áudio stereo 48kHz/24-bit. Modo "solo" isola a voz do apresentador do ruído ambiente.',
      },
      {
        title: 'Software & Compatibility',
        body: 'Plug-and-play UVC/UAC — funciona com Zoom, Teams, OBS, StreamYard. Software companion com ajuste de FOV (65°/78°/90°), PTZ digital e filtros de beleza.',
      },
    ],
  },
]

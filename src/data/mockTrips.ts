import { Trip, CuratedTemplate } from '../types/travel';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-rio',
    title: 'Fim de Semana no Rio de Janeiro',
    destination: 'Rio de Janeiro, RJ',
    country: 'Brasil',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    coverImage: '/src/assets/images/travel_dest_rio_1793143466827.jpg',
    tripStyle: 'Casal',
    totalBudget: 2800,
    hotelNotes: 'Hotel Fasano ou Ipanema Inn - Check-in a partir das 14h.',
    flightOrBusNotes: 'Voo G3 1450 (CGH -> SDU) - Desembarque às 08h20.',
    emergencyContacts: [
      { label: 'Polícia Turística (BPTur)', number: '(21) 2332-2924' },
      { label: 'SAMU / Emergência', number: '192' },
      { label: 'Recepção do Hotel', number: '(21) 3202-4000' }
    ],
    packingList: [
      { id: 'p1', name: 'Documento oficial com foto (RG / CNH)', category: 'docs', isPacked: true },
      { id: 'p2', name: 'Cartões e dinheiro trocado', category: 'docs', isPacked: true },
      { id: 'p3', name: 'Protetor solar FPS 50+', category: 'health', isPacked: true },
      { id: 'p4', name: 'Óculos de sol e boné', category: 'clothes', isPacked: true },
      { id: 'p5', name: 'Roupas de banho (2 peças)', category: 'clothes', isPacked: false },
      { id: 'p6', name: 'Tênis confortável para caminhadas', category: 'clothes', isPacked: true },
      { id: 'p7', name: 'Power bank e cabos USB-C', category: 'electronics', isPacked: false },
      { id: 'p8', name: 'Repelente para trilha', category: 'health', isPacked: false }
    ],
    days: [
      {
        id: 'rio-d1',
        dayNumber: 1,
        date: '2026-11-14',
        themeOrTitle: 'Chegada, Pão de Açúcar e Pôr do Sol no Arpoador',
        notes: 'Comprar ingressos antecipados para o bondinho para evitar fila na bilheteria.',
        activities: [
          {
            id: 'act-1',
            time: '09:00',
            title: 'Desembarque no Santos Dumont e Check-in',
            category: 'hotel',
            location: 'Aeroporto Santos Dumont / Ipanema',
            cost: 85,
            isPaid: true,
            notes: 'Uber Black do aeroporto até a hospedagem em Ipanema.',
            completed: true
          },
          {
            id: 'act-2',
            time: '11:00',
            title: 'Café da Manhã e Passeio na Praia de Ipanema',
            category: 'food',
            location: 'Posto 9 - Ipanema',
            cost: 65,
            isPaid: true,
            notes: 'Água de coco gelada e biscoito Globo à beira-mar.',
            completed: true
          },
          {
            id: 'act-3',
            time: '14:30',
            title: 'Subida ao Bondinho do Pão de Açúcar',
            category: 'attraction',
            location: 'Urca, Rio de Janeiro',
            cost: 160,
            isPaid: true,
            notes: 'Ingresso Fast Pass comprado pelo site oficial.',
            completed: false
          },
          {
            id: 'act-4',
            time: '17:30',
            title: 'Aplaudir o Pôr do Sol na Pedra do Arpoador',
            category: 'leisure',
            location: 'Pedra do Arpoador',
            cost: 0,
            isPaid: true,
            notes: 'Chegar 40 minutos antes do sol se pôr para pegar um bom lugar.',
            completed: false
          },
          {
            id: 'act-5',
            time: '20:30',
            title: 'Jantar no Bar Garota de Ipanema',
            category: 'food',
            location: 'Rua Vinícius de Moraes, 49',
            cost: 210,
            isPaid: false,
            notes: 'Pedir a clássica picanha na chapa.',
            completed: false
          }
        ]
      },
      {
        id: 'rio-d2',
        dayNumber: 2,
        date: '2026-11-15',
        themeOrTitle: 'Cristo Redentor, Parque Lage e Santa Teresa',
        notes: 'Subida ao Corcovado pela manhã bem cedo tem menos nuvens.',
        activities: [
          {
            id: 'act-6',
            time: '08:00',
            title: 'Trem do Corcovado & Cristo Redentor',
            category: 'attraction',
            location: 'Parque Nacional da Tijuca',
            cost: 115,
            isPaid: true,
            notes: 'Primeiro horário do dia para vista panorâmica aberta.',
            completed: false
          },
          {
            id: 'act-7',
            time: '11:30',
            title: 'Visita e Brunch no Parque Lage',
            category: 'food',
            location: 'Jardim Botânico',
            cost: 120,
            isPaid: false,
            notes: 'Tirar foto no famoso pátio com reflexo da piscina e Cristo ao fundo.',
            completed: false
          },
          {
            id: 'act-8',
            time: '15:00',
            title: 'Bairro Histórico de Santa Teresa & Bonde',
            category: 'cultural',
            location: 'Santa Teresa',
            cost: 40,
            isPaid: false,
            notes: 'Visita ao Parque das Ruínas e ateliês locais.',
            completed: false
          },
          {
            id: 'act-9',
            time: '19:30',
            title: 'Petiscos e Chope no Bar do Mineiro',
            category: 'food',
            location: 'Largo dos Guimarães - Santa Teresa',
            cost: 140,
            isPaid: false,
            notes: 'Famoso pastel de feijão e cachaças artesanais.',
            completed: false
          }
        ]
      },
      {
        id: 'rio-d3',
        dayNumber: 3,
        date: '2026-11-16',
        themeOrTitle: 'Museu do Amanhã, Confeitaria Colombo e Retorno',
        notes: 'Deixar malas no guarda-volumes do hotel até a hora do aeroporto.',
        activities: [
          {
            id: 'act-10',
            time: '09:30',
            title: 'Museu do Amanhã & Boulevard Olímpico',
            category: 'cultural',
            location: 'Praça Mauá, Centro',
            cost: 30,
            isPaid: false,
            notes: 'Fotografar o mural Etnias do Kobra.',
            completed: false
          },
          {
            id: 'act-11',
            time: '12:30',
            title: 'Almoço na Histórica Confeitaria Colombo',
            category: 'food',
            location: 'Rua Gonçalves Dias, 32 - Centro',
            cost: 180,
            isPaid: false,
            notes: 'Salão clássico da belle époque com espelhos belgas.',
            completed: false
          },
          {
            id: 'act-12',
            time: '16:00',
            title: 'Transfer e Embarque de Retorno',
            category: 'transport',
            location: 'Aeroporto Santos Dumont',
            cost: 60,
            isPaid: false,
            notes: 'Chegar 1h30 antes do voo das 18h15.',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'trip-paris',
    title: 'Paris Encantadora: Cultura & Charme',
    destination: 'Paris, Île-de-France',
    country: 'França',
    startDate: '2027-04-10',
    endDate: '2027-04-15',
    coverImage: '/src/assets/images/travel_dest_paris_1793143467802.jpg',
    tripStyle: 'Cultural',
    totalBudget: 12500,
    hotelNotes: 'Hôtel Le Relais Saint-Germain (6ème Arrondissement)',
    flightOrBusNotes: 'Voo AF 443 (GIG -> CDG) direto.',
    emergencyContacts: [
      { label: 'SAMU França', number: '15' },
      { label: 'Consulado-Geral do Brasil em Paris', number: '+33 1 45 61 63 00' },
      { label: 'Emergência Europeia Geral', number: '112' }
    ],
    packingList: [
      { id: 'pp1', name: 'Passaporte válido (mínimo 6 meses)', category: 'docs', isPacked: true },
      { id: 'pp2', name: 'Seguro Viagem Obrigatório Schengen', category: 'docs', isPacked: true },
      { id: 'pp3', name: 'Adaptador de tomada padrão europeu', category: 'electronics', isPacked: true },
      { id: 'pp4', name: 'Casaco sobretudo impermeável', category: 'clothes', isPacked: false }
    ],
    days: [
      {
        id: 'par-d1',
        dayNumber: 1,
        date: '2027-04-10',
        themeOrTitle: 'Chegada, Saint-Germain-des-Prés e Torre Eiffel Iluminada',
        activities: [
          {
            id: 'pact-1',
            time: '11:00',
            title: 'Check-in e Almoço no Café de Flore',
            category: 'food',
            location: 'Boulevard Saint-Germain',
            cost: 320,
            isPaid: false,
            notes: 'Croque Monsieur clássico e café au lait.',
            completed: false
          },
          {
            id: 'pact-2',
            time: '16:00',
            title: 'Passeio nos Jardins de Luxemburgo',
            category: 'leisure',
            location: 'Jardin du Luxembourg',
            cost: 0,
            isPaid: true,
            notes: 'Caminhada tranquila para bater o jet-lag.',
            completed: false
          },
          {
            id: 'pact-3',
            time: '20:30',
            title: 'Mirante do Trocadéro e Torre Eiffel Piscando',
            category: 'attraction',
            location: 'Place du Trocadéro',
            cost: 0,
            isPaid: true,
            notes: 'A torre pisca a cada hora cheia após o anoitecer.',
            completed: false
          }
        ]
      },
      {
        id: 'par-d2',
        dayNumber: 2,
        date: '2027-04-11',
        themeOrTitle: 'Museu do Louvre & Bairro Le Marais',
        activities: [
          {
            id: 'pact-4',
            time: '09:00',
            title: 'Museu do Louvre (Ala Denon & Mona Lisa)',
            category: 'attraction',
            location: 'Rue de Rivoli',
            cost: 140,
            isPaid: true,
            notes: 'Horário marcado na pirâmide principal.',
            completed: false
          },
          {
            id: 'pact-5',
            time: '13:30',
            title: 'Falafel e doces no Bairro Judeu de Marais',
            category: 'food',
            location: 'Rue des Rosiers (L\'As du Fallafel)',
            cost: 95,
            isPaid: false,
            notes: 'Melhor pita e falafel de Paris.',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'trip-gramado',
    title: 'Serra Gaúcha: Gramado & Canela Romântico',
    destination: 'Gramado, RS',
    country: 'Brasil',
    startDate: '2026-12-05',
    endDate: '2026-12-08',
    coverImage: '/src/assets/images/travel_dest_gramado_1793143467014.jpg',
    tripStyle: 'Gastronômica',
    totalBudget: 4200,
    hotelNotes: 'Pousada Villa Bella no Vale do Quilombo',
    flightOrBusNotes: 'Voo até Porto Alegre + Transfer Brocker até Gramado (2h de serra).',
    emergencyContacts: [
      { label: 'Hospital São Miguel Gramado', number: '(54) 3295-8600' },
      { label: 'Polícia Rodoviária Estadual', number: '198' }
    ],
    packingList: [
      { id: 'gp1', name: 'Blusas térmicas e cachecóis', category: 'clothes', isPacked: true },
      { id: 'gp2', name: 'Bota confortável', category: 'clothes', isPacked: true },
      { id: 'gp3', name: 'Carregador portátil', category: 'electronics', isPacked: false }
    ],
    days: [
      {
        id: 'gra-d1',
        dayNumber: 1,
        date: '2026-12-05',
        themeOrTitle: 'Chegada, Rua Coberta e Sequência de Fondue',
        activities: [
          {
            id: 'gact-1',
            time: '14:00',
            title: 'Check-in e Caminhada pela Av. Borges de Medeiros',
            category: 'leisure',
            location: 'Centro de Gramado',
            cost: 0,
            isPaid: true,
            notes: 'Apreciar a iluminação do Natal Luz e lojas de chocolate artesanal.',
            completed: false
          },
          {
            id: 'gact-2',
            time: '19:30',
            title: 'Tradicional Sequência de Fondue Suíço',
            category: 'food',
            location: 'Restaurante Chateau de La Fondue',
            cost: 310,
            isPaid: false,
            notes: 'Queijo alpino, carnes na pedra e chocolate de Gramado.',
            completed: false
          }
        ]
      }
    ]
  }
];

export const CURATED_TEMPLATES: CuratedTemplate[] = [
  {
    id: 'curated-noronha',
    title: 'Fernando de Noronha: Paraíso Ecológico',
    destination: 'Fernando de Noronha, PE',
    country: 'Brasil',
    durationDays: 5,
    suggestedBudget: 7500,
    coverImage: '/src/assets/images/travel_dest_rio_1793143466827.jpg',
    highlights: ['Baía do Sancho (melhor praia do mundo)', 'Mergulho com tartarugas', 'Trilha do Atalaia', 'Pôr do Sol no Boldró'],
    description: 'Roteiro dia a dia completo com taxas ambientais, agendamento de trilhas no ICMBio e melhores pontos de snorkel.',
    days: [
      {
        id: 'nor-1',
        dayNumber: 1,
        date: 'Dia 1',
        themeOrTitle: 'Chegada, Palestra no Tamar e Pôr do Sol no Boldró',
        activities: [
          { id: 'n1', time: '13:00', title: 'Check-in na Pousada & Retirada de Taxa TPA', category: 'hotel', cost: 95, isPaid: true, completed: false, notes: 'Pagar taxa antes pelo site oficial do Governo de PE.' },
          { id: 'n2', time: '17:00', title: 'Pôr do sol com música ao vivo no Forte do Boldró', category: 'leisure', cost: 45, isPaid: false, completed: false, notes: 'Chegar às 16h45 para garantir mesa.' },
          { id: 'n3', time: '20:00', title: 'Palestra de Conservação no Projeto Tamar', category: 'cultural', cost: 0, isPaid: true, completed: false }
        ]
      },
      {
        id: 'nor-2',
        dayNumber: 2,
        date: 'Dia 2',
        themeOrTitle: 'Ilhatur Completo: De Ponta a Ponta',
        activities: [
          { id: 'n4', time: '08:30', title: 'Embarque no Buggy Ilhatur Privativo', category: 'transport', cost: 450, isPaid: false, completed: false },
          { id: 'n5', time: '10:00', title: 'Mirante dos Golfinhos & Mirante dos Dois Irmãos', category: 'attraction', cost: 0, isPaid: true, completed: false },
          { id: 'n6', time: '14:30', title: 'Descida na Famosa Baía do Sancho', category: 'attraction', cost: 0, isPaid: true, completed: false, notes: 'Atenção aos horários de descida e subida da escadaria nas fendas.' }
        ]
      }
    ]
  },
  {
    id: 'curated-buenosaires',
    title: 'Buenos Aires Boêmia: Tango, Malbec & Cafés',
    destination: 'Buenos Aires',
    country: 'Argentina',
    durationDays: 4,
    suggestedBudget: 3200,
    coverImage: '/src/assets/images/travel_dest_paris_1793143467802.jpg',
    highlights: ['Show de Tango no San Telmo', 'Parrilla tradicional Don Julio', 'Livraria El Ateneo Grand Splendid', 'Puerto Madero ao entardecer'],
    description: 'Planejamento financeiro para otimizar câmbio, cartões e os melhores points gastronômicos em Palermo e Recoleta.',
    days: [
      {
        id: 'ba-1',
        dayNumber: 1,
        date: 'Dia 1',
        themeOrTitle: 'Recoleta Elegante, Cemitério Histórico e El Ateneo',
        activities: [
          { id: 'b1', time: '10:00', title: 'Visita à Livraria El Ateneo no Antigo Teatro', category: 'cultural', cost: 0, isPaid: true, completed: false, notes: 'Tomar café no palco do antigo teatro.' },
          { id: 'b2', time: '14:00', title: 'Cemitério da Recoleta & Túmulo de Eva Perón', category: 'attraction', cost: 45, isPaid: false, completed: false },
          { id: 'b3', time: '20:30', title: 'Jantar em Parrilla Tradicional', category: 'food', cost: 180, isPaid: false, completed: false, notes: 'Ojo de bife com vinho Malbec.' }
        ]
      }
    ]
  },
  {
    id: 'curated-roma',
    title: 'Roma Imperial & Vaticano',
    destination: 'Roma, Lazio',
    country: 'Itália',
    durationDays: 5,
    suggestedBudget: 8900,
    coverImage: '/src/assets/images/travel_dest_gramado_1793143467014.jpg',
    highlights: ['Coliseu e Fórum Romano', 'Basílica de São Pedro & Capela Sistina', 'Fontana di Trevi à noite', 'Jantar em Trastevere'],
    description: 'Guia de horários ideais sem multidões, ingressos combinados e como evitar armadilhas para turistas.',
    days: [
      {
        id: 'ro-1',
        dayNumber: 1,
        date: 'Dia 1',
        themeOrTitle: 'Coliseu, Monte Palatino e Centro Histórico',
        activities: [
          { id: 'r1', time: '08:30', title: 'Coliseu com Acesso à Arena dos Gladiadores', category: 'attraction', cost: 120, isPaid: true, completed: false },
          { id: 'r2', time: '13:00', title: 'Almoço: Cacio e Pepe autêntico', category: 'food', cost: 95, isPaid: false, completed: false },
          { id: 'r3', time: '16:30', title: 'Pantheon & Gelato na Giolitti', category: 'food', cost: 35, isPaid: false, completed: false },
          { id: 'r4', time: '20:00', title: 'Moeda na Fontana di Trevi iluminada', category: 'leisure', cost: 5, isPaid: true, completed: false }
        ]
      }
    ]
  }
];

export const CURRENCY_RATES = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$', rateBRL: 5.48, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateBRL: 5.95, flag: '🇪🇺' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', rateBRL: 0.0055, flag: '🇦🇷' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', rateBRL: 7.08, flag: '🇬🇧' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', rateBRL: 0.0058, flag: '🇨🇱' }
];

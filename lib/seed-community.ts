import type {Builder, ProductNeed, Story} from './types';

export const seedBuilders: Builder[] = [
  {
    id: 'seed-builder-desk',
    slug: 'arewa-is-building-desk',
    name: 'Arewa Is Building editorial desk',
    headline: 'The team curating an early view of Northern Nigeria’s product ecosystem.',
    bioEn: 'This seed profile is an editorial placeholder for the people maintaining the directory. It intentionally makes no claim about an individual founder while the platform begins collecting maker-approved profiles.',
    bioHa: 'Wannan bayanin farko na ƙungiyar masu gyara ne da ke kula da kundin. Ba ya yin ikirari game da wani mutum yayin da dandali ke fara tattara bayanan da masu gina kaya suka tabbatar.',
    stateCode: 'FC',
    links: {website: 'https://arewaisbuilding.com'},
    storyId: 'seed-story-making-room',
    isSeed: true,
    createdAt: '2026-10-21T08:00:00.000Z'
  },
  {
    id: 'seed-builder-zipa',
    slug: 'zipa-team',
    name: 'Zipa team',
    headline: 'A seed team profile attached to Zipa’s opening directory listing.',
    bioEn: 'This seed profile keeps the directory’s opening listing connected to a team without inventing personal founder details. It will be replaced with maker-approved information when the team claims the listing.',
    bioHa: 'Wannan bayanin farko yana haɗa jerin farko da ƙungiya ba tare da ƙirƙirar bayanan mutum ba. Za a maye gurbinsa da bayanin da masu gina shi suka tabbatar idan ƙungiyar ta karɓi jerin.',
    stateCode: 'KN',
    links: {},
    isSeed: true,
    createdAt: '2026-10-20T08:00:00.000Z'
  }
];

export const seedStories: Story[] = [
  {
    id: 'seed-story-making-room',
    slug: 'a-directory-starts-by-making-room',
    builderId: 'seed-builder-desk',
    titleEn: 'A directory starts by making room',
    titleHa: 'Kundi yana farawa ne da samar da wuri',
    excerptEn: 'An editorial seed story about why Arewa Is Building chooses verified details over assumptions.',
    excerptHa: 'Labarin farko na masu gyara game da dalilin da ya sa Arewa Is Building ke zaɓar bayanan da aka tabbatar fiye da zato.',
    bodyEn: `# A directory starts by making room

A good directory does more than collect links. It makes it easier for a useful piece of work to be found by the next person who needs it.

For an ecosystem as broad as Arewa, that also means being careful with the stories we tell. A founder name, a city and a product claim are not decoration. They are details that should come from the people who made the work.

## Verified before amplified

This seed editorial is intentionally clear about what it is: an early example of the story format. As makers submit and claim their listings, this space will carry their own words, short videos and the practical lessons behind their work.

The aim is simple: make room for Northern Nigerian builders to be discovered without filling that room with assumptions.`,
    bodyHa: `# Kundi yana farawa ne da samar da wuri

Kundi mai kyau bai tattara hanyoyin shiga kawai ba. Yana sauƙaƙa gano aiki mai amfani ga mutum na gaba da yake buƙatarsa.

Ga al’umma mai faɗi kamar Arewa, wannan yana nufin yin taka-tsantsan da labaran da muke bayarwa. Sunan mai ginawa, birni da bayanin samfur ba kayan ado ba ne. Bayanai ne da ya kamata su fito daga waɗanda suka yi aikin.

## Tabbatarwa kafin yaɗawa

Wannan labarin farko ya bayyana kansa: misali ne na farko na tsarin labari. Yayin da masu ginawa ke tura da karɓar jerinsu, wannan wuri zai ɗauki kalmominsu, gajerun bidiyo da darussan aikinsu.

Manufar mai sauƙi ce: samar da wuri ga masu gina kaya na Arewacin Najeriya ba tare da cika wannan wuri da zato ba.`,
    status: 'published',
    publishedAt: '2026-10-21T08:00:00.000Z',
    isSeed: true,
    createdAt: '2026-10-21T08:00:00.000Z',
    builder: seedBuilders[0]
  }
];

export const seedNeeds: ProductNeed[] = [
  {id: 'seed-need-zipa', needEn: 'I want to explore an early Arewa product listing', needHa: 'Ina son bincika bayanin farko na wata manhaja ta Arewa', productId: 'seed-zipa', sort: 1},
  {id: 'seed-need-arewa-life', needEn: 'I want to find a product shaped by life in Arewa', needHa: 'Ina son samun samfurin da rayuwar Arewa ta tsara', productId: 'seed-arewa-life', sort: 2}
];

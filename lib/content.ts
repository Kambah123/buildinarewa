import type {Locale} from './types';

export const aboutContent = {
  en: {
    eyebrow: 'Why Arewa Is Building',
    title: 'Useful work deserves to be easy to find.',
    intro: 'Arewa Is Building is a curated directory for digital products made in Northern Nigeria and by Arewa people everywhere.',
    sections: [
      ['A clearer picture of the North', 'Builders across the North are solving practical problems in commerce, learning, health, creative work and everyday life. This directory makes that work easier to discover.'],
      ['Curated, not crowded', 'Every public product is reviewed before it appears. We ask for clear information, a working destination and an honest description of what the product does.'],
      ['Open to early builders', 'A polished company is not the only kind of work worth seeing. We welcome useful ideas, beta products and small teams alongside established tools.'],
      ['Rooted, not limited', 'A product may be built in Kano, Kaduna, Abuja or anywhere else. If its makers are connected to Arewa, it belongs in the conversation.']
    ]
  },
  ha: {
    eyebrow: 'Dalilin Arewa Is Building',
    title: 'Aiki mai amfani ya dace a same shi cikin sauƙi.',
    intro: 'Arewa Is Building kundin bayanai ne da aka tsara don kayayyakin dijital da aka yi a Arewacin Najeriya da kuma na ’yan Arewa a ko’ina.',
    sections: [
      ['Kyakkyawan hoto na Arewa', 'Masu ginawa a ko’ina cikin Arewa suna warware matsaloli na kasuwanci, koyo, lafiya, kirkira da rayuwar yau da kullum. Wannan kundin yana sauƙaƙa gano aikinsu.'],
      ['Tsari ba cunkoso ba', 'Ana duba kowanne samfurin jama’a kafin ya bayyana. Muna neman bayani bayyananne, shafin da ke aiki da kuma gaskiyar abin da samfurin yake yi.'],
      ['A buɗe ga masu farawa', 'Kamfani da ya yi kyau ba shi ne kawai aikin da ya dace a gani ba. Muna maraba da ra’ayoyi masu amfani, abubuwan gwaji da ƙananan ƙungiyoyi tare da ingantattun kayan aiki.'],
      ['Mai tushe, ba mai iyaka ba', 'Ana iya gina samfur a Kano, Kaduna, Abuja ko wani wuri. Idan masu gina shi suna da alaƙa da Arewa, yana cikin tattaunawar.']
    ]
  }
} as const;

export const legalContent = {
  en: {
    terms: {
      title: 'Terms of use',
      intro: 'These terms explain how to use Arewa Is Building respectfully and safely.',
      sections: [
        ['Directory information', 'Product profiles are supplied by makers, public sources, or our editorial team. We aim for accuracy but do not guarantee that every detail, service or external website remains available.'],
        ['Submitting a product', 'Only submit work you are authorised to represent. Your submission must be truthful, lawful and respectful of the rights of other people. We may edit for clarity, request changes, or decline a listing.'],
        ['Editorial decisions', 'Approval is a curation decision, not an endorsement. We may remove or revise a listing when details become inaccurate, harmful, misleading or no longer meet the directory’s purpose.'],
        ['External links', 'Products link to independent services. Arewa Is Building is not responsible for their content, availability, payments or privacy practices.'],
        ['Contact', 'Questions about these terms can be sent to hello@arewaisbuilding.com.']
      ]
    },
    privacy: {
      title: 'Privacy',
      intro: 'We collect only what is needed to run a useful, reviewed directory.',
      sections: [
        ['What we collect', 'When you create an account or submit a product, Supabase processes your sign-in email and account identifier. Product submissions may include your name, role, product details and uploaded media.'],
        ['Why we use it', 'We use account information to authenticate you, connect you with your submissions, prevent abuse and send review updates. Published product information is used to operate the public directory.'],
        ['Service providers', 'Supabase provides authentication, database and media storage. Resend may deliver transactional review emails. These providers process data only to provide their services.'],
        ['Your choices', 'You can ask us to correct or remove a submission, or request deletion of your account data where we are not required to retain it. Email hello@arewaisbuilding.com from the account concerned.'],
        ['Changes and contact', 'We may update this page as the service grows. For privacy questions, contact hello@arewaisbuilding.com.']
      ]
    }
  },
  ha: {
    terms: {
      title: 'Sharuɗɗan amfani',
      intro: 'Waɗannan sharuɗɗa suna bayyana yadda za a yi amfani da Arewa Is Building cikin girmamawa da aminci.',
      sections: [
        ['Bayanan kundin', 'Masu gina kaya, hanyoyin jama’a ko ƙungiyar masu gyara ne ke ba da bayanan samfur. Muna ƙoƙarin tabbatar da daidaito amma ba mu tabbatar da cewa kowanne bayani, sabis ko shafin waje zai ci gaba da aiki ba.'],
        ['Tura samfur', 'Ka tura aikin da kake da izinin wakilta kawai. Abin da ka tura ya zama na gaskiya, halal kuma mai mutunta haƙƙin wasu. Za mu iya gyara shi don bayyana, neman canji ko ƙin amincewa da shi.'],
        ['Hukuncin masu gyara', 'Amincewa hukuncin tsarawa ne, ba amincewa da samfur ba. Za mu iya cire ko sabunta bayani idan ya zama ba daidai ba, mai illa, yaudarar jama’a ko bai dace da manufar kundin ba.'],
        ['Hanyoyin waje', 'Samfura suna da hanyoyin zuwa sabis masu zaman kansu. Arewa Is Building ba shi da alhakin abubuwansu, kasancewarsu, biyan kuɗi ko tsarin sirrinsu.'],
        ['Tuntuɓa', 'Za a iya aika tambayoyi game da waɗannan sharuɗɗa zuwa hello@arewaisbuilding.com.']
      ]
    },
    privacy: {
      title: 'Sirri',
      intro: 'Muna tattara abin da ake buƙata kawai don gudanar da kundin da aka duba mai amfani.',
      sections: [
        ['Abin da muke tattarawa', 'Idan ka ƙirƙiri asusu ko ka tura samfur, Supabase na sarrafa imel ɗin shiga da tantance asusunka. Bayanan samfur na iya ƙunsar suna, rawa, bayanin kaya da hotunan da aka tura.'],
        ['Dalilin amfani', 'Muna amfani da bayanan asusu don tabbatar da shiga, haɗa ka da abubuwan da ka tura, hana cin zarafi da aika sabuntawar bita. Ana amfani da bayanan samfurin da aka wallafa don gudanar da kundin jama’a.'],
        ['Masu ba da sabis', 'Supabase na samar da shiga, ma’ajiyar bayanai da hotuna. Resend na iya isar da imel na sabuntawar bita. Waɗannan masu ba da sabis suna sarrafa bayanai ne kawai don ayyukansu.'],
        ['Zaɓinka', 'Za ka iya neman a gyara ko a cire abin da ka tura, ko neman a goge bayanan asusunka idan babu wajibcin riƙe su. Aika imel zuwa hello@arewaisbuilding.com daga asusun da abin ya shafa.'],
        ['Canje-canje da tuntuɓa', 'Za mu iya sabunta wannan shafi yayin da sabis ke girma. Domin tambayoyin sirri, tuntuɓi hello@arewaisbuilding.com.']
      ]
    }
  }
} as const;

export function contentFor(locale: Locale) {
  return locale === 'ha' ? 'ha' : 'en';
}

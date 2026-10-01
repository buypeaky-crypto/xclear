import type { Metadata } from "next";
import { baseUrl } from "./config";

export const instagramLocales = ["en", "de", "id", "pt", "es", "it"] as const;
export type InstagramLocale = (typeof instagramLocales)[number];

export const instagramSlugs: Record<InstagramLocale, string> = {
  en: "instagram",
  de: "de/instagram-shadowban-test",
  id: "id/cek-shadowban-instagram",
  pt: "pt/teste-shadowban-instagram",
  es: "es/comprobar-shadowban-instagram",
  it: "it/test-shadowban-instagram",
};

export function getInstagramUrl(locale: InstagramLocale): string {
  return `${baseUrl}/${instagramSlugs[locale]}`;
}

export type InstagramCopy = {
  h1: string;
  subtitle: string;
  faqTitle: string;
  inputLabel: string;
  buttonLabel: string;
  loadingLabel: string;
  resultTitle: string;
  hashtagInputLabel: string;
  hashtagPlaceholder: string;
  visibilityLabel: string;
  engagementLabel: string;
  scoreLabel: string;
  reasonsLabel: string;
  fixTitle: string;
  fixDescription: string;
  visibilityStates: { ok: string; limited: string; hidden: string };
  engagementStates: { ok: string; drop: string; severe: string };
  reasonLabels: { banned: string; tooMany: string; duplicate: string; clean: string };
  resultNote: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

const instagramMetadata: Record<InstagramLocale, { title: string; description: string }> = {
  en: {
    title: "Instagram Shadowban Checker | ShadowbannChecker",
    description:
      "Check an Instagram username and submitted hashtags for visibility risk signals with a free, login-free heuristic checker.",
  },
  de: {
    title: "Instagram-Shadowban-Test | ShadowbannChecker",
    description:
      "Prüfe einen Instagram-Benutzernamen und eingegebene Hashtags kostenlos und ohne Anmeldung auf mögliche Hinweise zur Sichtbarkeit.",
  },
  id: {
    title: "Cek Shadowban Instagram | ShadowbannChecker",
    description:
      "Periksa nama pengguna dan hashtag Instagram secara gratis tanpa login untuk mengetahui kemungkinan sinyal masalah visibilitas.",
  },
  pt: {
    title: "Teste de Shadowban no Instagram | ShadowbannChecker",
    description:
      "Verifique um nome de usuário e hashtags do Instagram gratuitamente, sem login, em busca de possíveis sinais de visibilidade limitada.",
  },
  es: {
    title: "Comprobar Shadowban en Instagram | ShadowbannChecker",
    description:
      "Comprueba gratis y sin iniciar sesión un nombre de usuario y hashtags de Instagram para detectar posibles señales de visibilidad limitada.",
  },
  it: {
    title: "Test Shadowban Instagram | ShadowbannChecker",
    description:
      "Controlla gratuitamente e senza accesso un nome utente e gli hashtag di Instagram per individuare possibili segnali di visibilità limitata.",
  },
};

export const instagramCopies: Record<InstagramLocale, InstagramCopy> = {
  en: {
    h1: "Is your Instagram account shadowbanned?",
    subtitle:
      "Enter an Instagram username to assess hashtag visibility, Explore potential, and engagement patterns from public signals. Results are heuristic and not supplied directly by Instagram.",
    faqTitle: "Instagram shadowban FAQs",
    inputLabel: "Instagram username",
    buttonLabel: "CHECK NOW",
    loadingLabel: "CHECKING...",
    resultTitle: "Results for @{username}",
    hashtagInputLabel: "Paste your last 5 hashtags",
    hashtagPlaceholder: "#quran #islam #faith #community #dailyreminder",
    visibilityLabel: "Hashtag Visibility",
    engagementLabel: "Engagement",
    scoreLabel: "Score",
    reasonsLabel: "Reasons",
    fixTitle: "How to fix",
    fixDescription: "Remove banned hashtags, use 5-10 relevant hashtags, wait 48h",
    visibilityStates: { ok: "Good", limited: "Limited", hidden: "Hidden" },
    engagementStates: { ok: "Healthy", drop: "Possible drop", severe: "Severe drop" },
    reasonLabels: {
      banned: "Uses restricted or potentially broken hashtags",
      tooMany: "Uses {count} hashtags (Instagram limit is 30)",
      duplicate: "Repeats hashtags in this list",
      clean: "No spam signals detected, hashtags look clean",
    },
    resultNote:
      "Heuristic analysis of the hashtag signals you provide. Instagram does not provide an official shadowban status. For a manual cross-check, log out of IG, search your hashtag, and see if your post appears.",
    keywords: [
      "Instagram shadowban checker",
      "Instagram shadowban test",
      "check Instagram hashtag visibility",
      "Instagram reach drop",
    ],
    faqs: [
      {
        question: "What is an Instagram shadowban?",
        answer:
          "Shadowban is an informal term for a possible reduction in how widely content is recommended or discovered. Instagram does not provide one universal shadowban status, and lower reach alone does not prove a restriction.",
      },
      {
        question: "Does this checker really search Instagram hashtags?",
        answer:
          "It provides a heuristic assessment of discoverability based on public signals. Results are not supplied directly by Instagram and may not reflect actual hashtag, Explore, or Reels ranking.",
      },
      {
        question: "Can an engagement drop prove my account is restricted?",
        answer:
          "No. Engagement can change because of audience activity, content, timing, ranking, or other factors. Compare multiple posts and check Instagram's own account-status notices.",
      },
      {
        question: "Do I need to share my Instagram password?",
        answer:
          "No. Never provide your password to a shadowban checker. This checker only needs a username and does not ask you to log in.",
      },
      {
        question: "What should I do if my reach suddenly falls?",
        answer:
          "Review account status and recommendation eligibility in Instagram, compare several posts over time, and consult the platform's current guidance. A third-party checker cannot confirm Instagram's internal ranking decisions.",
      },
    ],
  },
  de: {
    h1: "Ist dein Instagram-Konto von einem Shadowban betroffen?",
    subtitle:
      "Gib einen Instagram-Benutzernamen ein, um Hashtag-Sichtbarkeit, Explore-Potenzial und Interaktionsmuster anhand öffentlicher Signale einzuschätzen. Die Ergebnisse sind heuristisch und stammen nicht direkt von Instagram.",
    faqTitle: "Häufige Fragen zum Instagram-Shadowban",
    inputLabel: "Instagram-Benutzername",
    buttonLabel: "JETZT PRÜFEN",
    loadingLabel: "WIRD GEPRÜFT...",
    resultTitle: "Ergebnisse für @{username}",
    hashtagInputLabel: "Deine letzten 5 Hashtags einfügen",
    hashtagPlaceholder: "#quran #islam #glaube #gemeinschaft #erinnerung",
    visibilityLabel: "Hashtag-Sichtbarkeit",
    engagementLabel: "Interaktionen",
    scoreLabel: "Punktzahl",
    reasonsLabel: "Gründe",
    fixTitle: "So kannst du es verbessern",
    fixDescription: "Eingeschränkte Hashtags entfernen, 5–10 passende Hashtags nutzen und 48 Stunden warten",
    visibilityStates: { ok: "Gut", limited: "Eingeschränkt", hidden: "Verborgen" },
    engagementStates: { ok: "Unauffällig", drop: "Möglicher Rückgang", severe: "Starker Rückgang" },
    reasonLabels: {
      banned: "Enthält eingeschränkte oder möglicherweise nicht verfügbare Hashtags",
      tooMany: "Verwendet {count} Hashtags (Instagram-Limit: 30)",
      duplicate: "Hashtags in dieser Liste wiederholen sich",
      clean: "Keine Spam-Signale erkannt; die Hashtags wirken unauffällig",
    },
    resultNote:
      "Heuristische Analyse der eingegebenen Hashtag-Signale. Instagram bietet keinen offiziellen Shadowban-Status. Zur manuellen Gegenprüfung: Melde dich ab, suche nach deinem Hashtag und prüfe, ob dein Beitrag erscheint.",
    keywords: ["Instagram Shadowban Checker", "Instagram Shadowban Test", "Instagram Hashtag-Sichtbarkeit prüfen", "Instagram Reichweite"],
    faqs: [
      {
        question: "Was ist ein Instagram-Shadowban?",
        answer:
          "Shadowban ist ein informeller Begriff für eine mögliche geringere Verbreitung oder Auffindbarkeit von Inhalten. Eine geringere Reichweite allein beweist keine Einschränkung.",
      },
      {
        question: "Sucht dieser Checker wirklich nach Instagram-Hashtags?",
        answer:
          "Sie liefert eine heuristische Einschätzung der Auffindbarkeit anhand öffentlicher Signale. Die Ergebnisse stammen nicht direkt von Instagram und bilden die tatsächliche Platzierung bei Hashtags, Explore oder Reels möglicherweise nicht ab.",
      },
      {
        question: "Beweist ein Rückgang der Interaktionen eine Einschränkung?",
        answer:
          "Nein. Interaktionen hängen auch von Publikum, Inhalt, Zeitpunkt und Ranking ab. Vergleiche mehrere Beiträge und prüfe die Kontostatusmeldungen in Instagram.",
      },
      {
        question: "Muss ich mein Instagram-Passwort eingeben?",
        answer:
          "Nein. Gib dein Passwort niemals an einen Shadowban-Checker weiter. Dieser Checker benötigt nur einen Benutzernamen und verlangt keine Anmeldung.",
      },
      {
        question: "Was kann ich bei plötzlich sinkender Reichweite tun?",
        answer:
          "Prüfe Kontostatus und Empfehlungseignung in Instagram, vergleiche mehrere Beiträge und beachte die aktuellen Hinweise der Plattform. Ein externer Checker kann interne Ranking-Entscheidungen nicht bestätigen.",
      },
    ],
  },
  id: {
    h1: "Apakah akun Instagram Anda terkena shadowban?",
    subtitle:
      "Masukkan nama pengguna Instagram untuk memperkirakan visibilitas tagar, potensi Explore, dan pola interaksi berdasarkan sinyal publik. Hasil bersifat heuristik dan tidak diberikan langsung oleh Instagram.",
    faqTitle: "Pertanyaan umum tentang shadowban Instagram",
    inputLabel: "Nama pengguna Instagram",
    buttonLabel: "CEK SEKARANG",
    loadingLabel: "MEMERIKSA...",
    resultTitle: "Hasil untuk @{username}",
    hashtagInputLabel: "Tempel 5 hashtag terakhir Anda",
    hashtagPlaceholder: "#quran #islam #iman #komunitas #pengingat",
    visibilityLabel: "Visibilitas Hashtag",
    engagementLabel: "Interaksi",
    scoreLabel: "Skor",
    reasonsLabel: "Alasan",
    fixTitle: "Cara memperbaiki",
    fixDescription: "Hapus hashtag yang dibatasi, gunakan 5-10 hashtag yang relevan, lalu tunggu 48 jam",
    visibilityStates: { ok: "Baik", limited: "Terbatas", hidden: "Tersembunyi" },
    engagementStates: { ok: "Sehat", drop: "Mungkin menurun", severe: "Turun tajam" },
    reasonLabels: {
      banned: "Menggunakan hashtag yang dibatasi atau mungkin tidak tersedia",
      tooMany: "Menggunakan {count} hashtag (batas Instagram adalah 30)",
      duplicate: "Hashtag berulang dalam daftar ini",
      clean: "Tidak ada sinyal spam; hashtag terlihat baik",
    },
    resultNote:
      "Analisis heuristik berdasarkan sinyal hashtag yang Anda masukkan. Instagram tidak menyediakan status shadowban resmi. Untuk pemeriksaan manual, logout dari IG, cari hashtag Anda, lalu lihat apakah postingan muncul.",
    keywords: ["cek shadowban Instagram", "tes shadowban Instagram", "visibilitas hashtag Instagram", "jangkauan Instagram turun"],
    faqs: [
      {
        question: "Apa itu shadowban Instagram?",
        answer:
          "Shadowban adalah istilah informal untuk kemungkinan berkurangnya distribusi atau penemuan konten. Jangkauan yang turun saja tidak membuktikan adanya pembatasan.",
      },
      {
        question: "Apakah alat ini benar-benar mencari hashtag Instagram?",
        answer:
          "Alat ini memberikan perkiraan heuristik berdasarkan sinyal publik. Hasil tidak diberikan langsung oleh Instagram dan mungkin tidak mencerminkan peringkat tagar, Explore, atau Reels yang sebenarnya.",
      },
      {
        question: "Apakah penurunan interaksi membuktikan akun dibatasi?",
        answer:
          "Tidak. Interaksi dapat berubah karena aktivitas audiens, konten, waktu, atau sistem peringkat. Bandingkan beberapa postingan dan periksa status akun di Instagram.",
      },
      {
        question: "Apakah saya perlu memberikan kata sandi Instagram?",
        answer:
          "Tidak. Jangan pernah memberikan kata sandi kepada alat pemeriksa shadowban. Alat ini hanya memerlukan nama pengguna dan tidak meminta Anda login.",
      },
      {
        question: "Apa yang harus dilakukan jika jangkauan turun tiba-tiba?",
        answer:
          "Periksa status akun dan kelayakan rekomendasi di Instagram, bandingkan beberapa postingan, dan ikuti panduan terbaru platform. Alat pihak ketiga tidak dapat memastikan keputusan sistem internal Instagram.",
      },
    ],
  },
  pt: {
    h1: "Sua conta do Instagram está com shadowban?",
    subtitle:
      "Digite um nome de usuário do Instagram para estimar a visibilidade por hashtags, o potencial no Explorar e padrões de engajamento com base em sinais públicos. Os resultados são heurísticos e não vêm diretamente do Instagram.",
    faqTitle: "Perguntas frequentes sobre shadowban no Instagram",
    inputLabel: "Nome de usuário do Instagram",
    buttonLabel: "VERIFICAR AGORA",
    loadingLabel: "VERIFICANDO...",
    resultTitle: "Resultados para @{username}",
    hashtagInputLabel: "Cole suas últimas 5 hashtags",
    hashtagPlaceholder: "#quran #islam #fé #comunidade #reflexão",
    visibilityLabel: "Visibilidade por hashtag",
    engagementLabel: "Engajamento",
    scoreLabel: "Pontuação",
    reasonsLabel: "Motivos",
    fixTitle: "Como corrigir",
    fixDescription: "Remova hashtags restritas, use de 5 a 10 hashtags relevantes e aguarde 48 horas",
    visibilityStates: { ok: "Boa", limited: "Limitada", hidden: "Oculta" },
    engagementStates: { ok: "Saudável", drop: "Possível queda", severe: "Queda acentuada" },
    reasonLabels: {
      banned: "Usa hashtags restritas ou possivelmente indisponíveis",
      tooMany: "Usa {count} hashtags (o limite do Instagram é 30)",
      duplicate: "Repete hashtags nesta lista",
      clean: "Nenhum sinal de spam detectado; as hashtags parecem adequadas",
    },
    resultNote:
      "Análise heurística dos sinais das hashtags informadas. O Instagram não oferece um status oficial de shadowban. Para conferir manualmente, saia do IG, pesquise sua hashtag e veja se a publicação aparece.",
    keywords: ["teste shadowban Instagram", "verificar shadowban Instagram", "visibilidade hashtag Instagram", "queda de alcance Instagram"],
    faqs: [
      {
        question: "O que é shadowban no Instagram?",
        answer:
          "Shadowban é um termo informal para uma possível redução na distribuição ou descoberta de conteúdo. Uma queda no alcance, por si só, não comprova uma restrição.",
      },
      {
        question: "Este verificador realmente pesquisa hashtags do Instagram?",
        answer:
          "A ferramenta oferece uma estimativa heurística com base em sinais públicos. Os resultados não vêm diretamente do Instagram e podem não refletir a classificação real em hashtags, Explorar ou Reels.",
      },
      {
        question: "Uma queda no engajamento prova que minha conta foi limitada?",
        answer:
          "Não. O engajamento pode variar conforme público, conteúdo, horário e classificação. Compare várias publicações e confira o status da conta no Instagram.",
      },
      {
        question: "Preciso informar minha senha do Instagram?",
        answer:
          "Não. Nunca compartilhe sua senha com um verificador de shadowban. Esta ferramenta precisa apenas de um nome de usuário e não solicita login.",
      },
      {
        question: "O que fazer se meu alcance cair de repente?",
        answer:
          "Confira o status da conta e a elegibilidade para recomendações no Instagram, compare várias publicações e consulte as orientações atuais da plataforma. Uma ferramenta externa não confirma decisões internas de distribuição.",
      },
    ],
  },
  es: {
    h1: "¿Tu cuenta de Instagram tiene shadowban?",
    subtitle:
      "Introduce un nombre de usuario de Instagram para estimar la visibilidad en hashtags, el potencial en Explorar y los patrones de interacción a partir de señales públicas. Los resultados son heurísticos y no proceden directamente de Instagram.",
    faqTitle: "Preguntas frecuentes sobre shadowban en Instagram",
    inputLabel: "Nombre de usuario de Instagram",
    buttonLabel: "COMPROBAR AHORA",
    loadingLabel: "COMPROBANDO...",
    resultTitle: "Resultados para @{username}",
    hashtagInputLabel: "Pega tus últimos 5 hashtags",
    hashtagPlaceholder: "#quran #islam #fe #comunidad #reflexión",
    visibilityLabel: "Visibilidad en hashtags",
    engagementLabel: "Interacción",
    scoreLabel: "Puntuación",
    reasonsLabel: "Motivos",
    fixTitle: "Cómo solucionarlo",
    fixDescription: "Elimina hashtags restringidos, usa de 5 a 10 hashtags relevantes y espera 48 horas",
    visibilityStates: { ok: "Buena", limited: "Limitada", hidden: "Oculta" },
    engagementStates: { ok: "Saludable", drop: "Posible caída", severe: "Caída grave" },
    reasonLabels: {
      banned: "Usa hashtags restringidos o posiblemente no disponibles",
      tooMany: "Usa {count} hashtags (el límite de Instagram es 30)",
      duplicate: "Repite hashtags en esta lista",
      clean: "No se detectaron señales de spam; los hashtags parecen adecuados",
    },
    resultNote:
      "Análisis heurístico de las señales de los hashtags que introduces. Instagram no ofrece un estado oficial de shadowban. Para comprobarlo manualmente, cierra sesión en IG, busca tu hashtag y mira si aparece tu publicación.",
    keywords: ["comprobar shadowban Instagram", "test shadowban Instagram", "visibilidad hashtags Instagram", "bajada de alcance Instagram"],
    faqs: [
      {
        question: "¿Qué es un shadowban en Instagram?",
        answer:
          "Shadowban es un término informal para una posible reducción en la distribución o el descubrimiento del contenido. Una caída del alcance por sí sola no demuestra una restricción.",
      },
      {
        question: "¿Este comprobador busca hashtags de Instagram de verdad?",
        answer:
          "La herramienta ofrece una estimación heurística basada en señales públicas. Los resultados no proceden directamente de Instagram y pueden no reflejar la clasificación real en hashtags, Explorar o Reels.",
      },
      {
        question: "¿Una caída de interacción demuestra que mi cuenta está limitada?",
        answer:
          "No. La interacción puede cambiar por la audiencia, el contenido, el horario o la clasificación. Compara varias publicaciones y revisa el estado de la cuenta en Instagram.",
      },
      {
        question: "¿Tengo que compartir mi contraseña de Instagram?",
        answer:
          "No. Nunca compartas tu contraseña con un comprobador de shadowban. Esta herramienta solo necesita un nombre de usuario y no solicita iniciar sesión.",
      },
      {
        question: "¿Qué hago si mi alcance baja de repente?",
        answer:
          "Revisa el estado de la cuenta y la elegibilidad para recomendaciones en Instagram, compara varias publicaciones y consulta las indicaciones actuales de la plataforma. Una herramienta externa no puede confirmar decisiones internas.",
      },
    ],
  },
  it: {
    h1: "Il tuo account Instagram è in shadowban?",
    subtitle:
      "Inserisci un nome utente Instagram per stimare la visibilità degli hashtag, il potenziale su Esplora e i modelli di engagement in base ai segnali pubblici. I risultati sono euristici e non provengono direttamente da Instagram.",
    faqTitle: "Domande frequenti sullo shadowban Instagram",
    inputLabel: "Nome utente Instagram",
    buttonLabel: "CONTROLLA ORA",
    loadingLabel: "CONTROLLO...",
    resultTitle: "Risultati per @{username}",
    hashtagInputLabel: "Incolla gli ultimi 5 hashtag",
    hashtagPlaceholder: "#quran #islam #fede #comunità #riflessione",
    visibilityLabel: "Visibilità degli hashtag",
    engagementLabel: "Engagement",
    scoreLabel: "Punteggio",
    reasonsLabel: "Motivi",
    fixTitle: "Come risolvere",
    fixDescription: "Rimuovi gli hashtag soggetti a restrizioni, usa 5-10 hashtag pertinenti e attendi 48 ore",
    visibilityStates: { ok: "Buona", limited: "Limitata", hidden: "Nascosta" },
    engagementStates: { ok: "Regolare", drop: "Possibile calo", severe: "Calo grave" },
    reasonLabels: {
      banned: "Usa hashtag soggetti a restrizioni o potenzialmente non disponibili",
      tooMany: "Usa {count} hashtag (il limite di Instagram è 30)",
      duplicate: "Ripete gli hashtag in questo elenco",
      clean: "Nessun segnale di spam rilevato; gli hashtag sembrano regolari",
    },
    resultNote:
      "Analisi euristica dei segnali degli hashtag inseriti. Instagram non fornisce uno stato ufficiale di shadowban. Per una verifica manuale, esci da IG, cerca il tuo hashtag e controlla se compare il post.",
    keywords: ["controllare shadowban Instagram", "test shadowban Instagram", "visibilità hashtag Instagram", "calo copertura Instagram"],
    faqs: [
      {
        question: "Che cos’è uno shadowban su Instagram?",
        answer:
          "Shadowban è un termine informale per una possibile riduzione della distribuzione o della reperibilità dei contenuti. Un calo della copertura, da solo, non dimostra una limitazione.",
      },
      {
        question: "Questo checker cerca davvero gli hashtag su Instagram?",
        answer:
          "Lo strumento fornisce una stima euristica basata su segnali pubblici. I risultati non provengono direttamente da Instagram e potrebbero non riflettere il posizionamento effettivo su hashtag, Esplora o Reels.",
      },
      {
        question: "Un calo dell’engagement prova che il mio account è limitato?",
        answer:
          "No. L’engagement può variare per pubblico, contenuti, orari o ranking. Confronta più post e controlla lo stato dell’account direttamente su Instagram.",
      },
      {
        question: "Devo comunicare la password di Instagram?",
        answer:
          "No. Non condividere mai la password con un checker di shadowban. Questo strumento richiede solo un nome utente e non chiede di accedere.",
      },
      {
        question: "Cosa fare se la copertura diminuisce all’improvviso?",
        answer:
          "Controlla lo stato dell’account e l’idoneità ai consigliati su Instagram, confronta più post e consulta le indicazioni aggiornate della piattaforma. Uno strumento esterno non può confermare le decisioni interne di ranking.",
      },
    ],
  },
};

export function getInstagramMetadata(locale: InstagramLocale): Metadata {
  const url = getInstagramUrl(locale);
  const copy = instagramCopies[locale];
  const { title, description } = instagramMetadata[locale];
  const languages = Object.fromEntries(
    instagramLocales.map((language) => [language, getInstagramUrl(language)]),
  );

  return {
    title,
    description,
    keywords: copy.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": getInstagramUrl("en") },
    },
    openGraph: { type: "website", url, title, description, siteName: "ShadowbannChecker" },
  };
}
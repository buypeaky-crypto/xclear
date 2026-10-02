import type { Metadata } from "next";
import { baseUrl } from "./config";

export const youtubeLocales = ["en", "de", "id", "es", "fr", "it", "nl", "pl"] as const;
export type YouTubeLocale = (typeof youtubeLocales)[number];

export const youtubeSlugs: Record<YouTubeLocale, string> = {
  en: "youtube-shadowban-checker",
  de: "de/youtube-shadowban-test",
  id: "id/cek-shadowban-youtube",
  es: "es/comprobar-shadowban-youtube",
  fr: "fr/test-shadowban-youtube",
  it: "it/test-shadowban-youtube",
  nl: "nl/youtube-shadowban-test",
  pl: "pl/test-shadowban-youtube",
};

export function getYouTubeUrl(locale: YouTubeLocale): string {
  return `${baseUrl}/${youtubeSlugs[locale].split("/").map(encodeURIComponent).join("/")}`;
}

type YouTubeCopy = {
  h1: string;
  subtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  buttonLabel: string;
  loadingLabel: string;
  resultTitle: string;
  scoreLabel: string;
  goodLabel: string;
  reviewLabel: string;
  healthyLabel: string;
  suggestedLabel: string;
  fixTitle: string;
  fixSteps: string[];
  resultNote: string;
  faqTitle: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

const metadata: Record<YouTubeLocale, { title: string; description: string }> = {
  en: {
    title: "YouTube Shadowban Checker | ShadowbanChecker",
    description: "Check a YouTube handle or channel URL for public visibility signals. Free, login-free heuristic review.",
  },
  de: {
    title: "YouTube-Shadowban-Test | ShadowbanChecker",
    description: "Prüfe einen YouTube-Handle oder Kanal-Link kostenlos und ohne Anmeldung auf öffentliche Sichtbarkeitssignale.",
  },
  id: {
    title: "Cek Shadowban YouTube | ShadowbanChecker",
    description: "Periksa handle atau URL channel YouTube secara gratis tanpa login untuk melihat sinyal visibilitas publik.",
  },
  es: {
    title: "Comprobar shadowban en YouTube | ShadowbanChecker",
    description: "Comprueba gratis y sin iniciar sesión las señales de visibilidad pública de un canal o usuario de YouTube.",
  },
  fr: {
    title: "Vérifier un shadowban YouTube | ShadowbanChecker",
    description: "Vérifiez gratuitement et sans connexion les signaux de visibilité publique d'une chaîne YouTube.",
  },
  it: {
    title: "Verifica shadowban YouTube | ShadowbanChecker",
    description: "Controlla gratis e senza accesso i segnali di visibilità pubblica di un canale YouTube.",
  },
  nl: {
    title: "YouTube-shadowbantest | ShadowbanChecker",
    description: "Controleer gratis en zonder inloggen openbare zichtbaarheidssignalen van een YouTube-kanaal.",
  },
  pl: {
    title: "Test shadowbana YouTube | ShadowbanChecker",
    description: "Sprawdź bezpłatnie i bez logowania publiczne sygnały widoczności kanału YouTube.",
  },
};

export function getYouTubeMetadata(locale: YouTubeLocale): Metadata {
  return {
    title: metadata[locale].title,
    description: metadata[locale].description,
    alternates: { canonical: getYouTubeUrl(locale) },
    openGraph: {
      type: "website",
      url: getYouTubeUrl(locale),
      title: metadata[locale].title,
      description: metadata[locale].description,
    },
  };
}

export const youtubeCopies: Record<YouTubeLocale, YouTubeCopy> = {
  en: {
    h1: "YouTube Shadowban Checker",
    subtitle: "Review the public visibility of a YouTube channel using logged-out page signals. No login or API key is needed.",
    inputLabel: "YouTube handle or channel URL",
    inputPlaceholder: "@MrBeast or youtube.com/@MrBeast",
    buttonLabel: "CHECK CHANNEL",
    loadingLabel: "CHECKING PUBLIC SIGNALS...",
    resultTitle: "Visibility results for",
    scoreLabel: "Visibility score",
    goodLabel: "Good",
    reviewLabel: "Needs review",
    healthyLabel: "Healthy",
    suggestedLabel: "Review suggested",
    fixTitle: "How to fix visibility issues",
    fixSteps: [
      "Open YouTube Studio and review Channel violations, video restrictions, and any appeal notices.",
      "Confirm that the channel and recent videos are public, and check that videos are not age-restricted or blocked in key regions.",
      "Use clear titles, descriptions, and thumbnails that accurately describe each video; avoid repetitive metadata and misleading tags.",
      "If YouTube shows a specific policy decision, follow its appeal process. Wait for changes to propagate before checking again.",
    ],
    resultNote: "This is a heuristic visibility review, not official YouTube status. YouTube does not publish shadowban status.",
    faqTitle: "YouTube shadowban FAQs",
    keywords: ["YouTube shadowban checker", "YouTube shadowban test", "check YouTube channel visibility", "YouTube channel not appearing in search"],
    faqs: [
      { question: "Can this checker confirm a YouTube shadowban?", answer: "No. YouTube does not publish an official shadowban status or expose its internal recommendation decisions. This tool checks a few public page signals only." },
      { question: "What channel formats can I enter?", answer: "Enter a handle such as @MrBeast, a youtube.com/@handle URL, a legacy /c/ URL, or a /channel/UC... ID URL." },
      { question: "Does a healthy result guarantee that my videos will appear in search?", answer: "No. A public channel page and visible videos do not guarantee search placement or recommendations. Ranking can vary by query, viewer, region, and time." },
      { question: "Do I need to sign in or provide an API key?", answer: "No. The checker requests the public channel page while logged out. Never share your password or access token with a checker." },
      { question: "What should I do if my channel is missing or reach falls?", answer: "Check YouTube Studio for restrictions and policy notices, then compare public channel and video URLs while signed out. A change in views alone does not prove a restriction." },
    ],
  },
  de: {
    h1: "YouTube-Shadowban-Checker",
    subtitle: "Prüfe öffentliche Sichtbarkeitssignale eines YouTube-Kanals ohne Anmeldung. Es wird kein API-Schlüssel benötigt.",
    inputLabel: "YouTube-Handle oder Kanal-URL",
    inputPlaceholder: "@MrBeast oder youtube.com/@MrBeast",
    buttonLabel: "KANAL PRÜFEN",
    loadingLabel: "ÖFFENTLICHE SIGNALE WERDEN GEPRÜFT...",
    resultTitle: "Sichtbarkeitsergebnisse für",
    scoreLabel: "Sichtbarkeitspunktzahl",
    goodLabel: "Gut",
    reviewLabel: "Prüfung empfohlen",
    healthyLabel: "Unauffällig",
    suggestedLabel: "Weitere Prüfung empfohlen",
    fixTitle: "So kannst du Sichtbarkeitsprobleme beheben",
    fixSteps: ["Prüfe in YouTube Studio Kanalverstöße, Videobeschränkungen und Hinweise zu Einsprüchen.", "Stelle sicher, dass Kanal und aktuelle Videos öffentlich sind und nicht altersbeschränkt oder regional blockiert werden.", "Verwende aussagekräftige Titel, Beschreibungen und Vorschaubilder und vermeide wiederholte Metadaten.", "Folge bei einer konkreten Richtlinienentscheidung dem Einspruchsverfahren und warte, bis Änderungen übernommen wurden."],
    resultNote: "Dies ist eine heuristische Sichtbarkeitsprüfung, kein offizieller YouTube-Status. YouTube veröffentlicht keinen Shadowban-Status.",
    faqTitle: "Häufige Fragen zum YouTube-Shadowban",
    keywords: ["YouTube Shadowban Checker", "YouTube Shadowban Test", "YouTube-Kanalsichtbarkeit prüfen"],
    faqs: [
      { question: "Kann dieser Checker einen YouTube-Shadowban bestätigen?", answer: "Nein. YouTube veröffentlicht weder einen offiziellen Shadowban-Status noch interne Empfehlungsentscheidungen. Das Tool prüft nur einige öffentliche Seitensignale." },
      { question: "Welche Kanalformate kann ich eingeben?", answer: "Gib ein Handle wie @MrBeast, eine youtube.com/@handle-URL, eine ältere /c/-URL oder eine /channel/UC...-ID-URL ein." },
      { question: "Garantiert ein unauffälliges Ergebnis, dass Videos in der Suche erscheinen?", answer: "Nein. Eine öffentliche Kanalseite und sichtbare Videos garantieren keine Platzierung in Suche oder Empfehlungen. Rankings unterscheiden sich nach Anfrage, Person, Region und Zeitpunkt." },
      { question: "Muss ich mich anmelden oder einen API-Schlüssel eingeben?", answer: "Nein. Der Checker ruft die öffentliche Kanalseite abgemeldet ab. Teile niemals Passwort oder Zugriffstoken mit einem Checker." },
      { question: "Was kann ich tun, wenn mein Kanal fehlt oder die Reichweite sinkt?", answer: "Prüfe YouTube Studio auf Einschränkungen und Hinweise und vergleiche Kanal- und Video-URLs abgemeldet. Sinkende Aufrufe allein beweisen keine Einschränkung." },
    ],
  },
  id: {
    h1: "Pemeriksa Shadowban YouTube",
    subtitle: "Periksa sinyal visibilitas publik channel YouTube tanpa login. Anda tidak memerlukan kunci API.",
    inputLabel: "Handle atau URL channel YouTube",
    inputPlaceholder: "@MrBeast atau youtube.com/@MrBeast",
    buttonLabel: "PERIKSA CHANNEL",
    loadingLabel: "MEMERIKSA SINYAL PUBLIK...",
    resultTitle: "Hasil visibilitas untuk",
    scoreLabel: "Skor visibilitas",
    goodLabel: "Baik",
    reviewLabel: "Perlu ditinjau",
    healthyLabel: "Sehat",
    suggestedLabel: "Disarankan untuk ditinjau",
    fixTitle: "Cara memperbaiki masalah visibilitas",
    fixSteps: ["Buka YouTube Studio dan periksa pelanggaran channel, pembatasan video, serta pemberitahuan banding.", "Pastikan channel dan video terbaru bersifat publik serta tidak dibatasi usia atau diblokir di wilayah penting.", "Gunakan judul, deskripsi, dan thumbnail yang jelas serta sesuai isi video; hindari metadata berulang.", "Jika YouTube menampilkan keputusan kebijakan tertentu, ikuti proses bandingnya dan tunggu perubahan diterapkan."],
    resultNote: "Ini adalah tinjauan visibilitas heuristik, bukan status resmi YouTube. YouTube tidak menerbitkan status shadowban.",
    faqTitle: "FAQ shadowban YouTube",
    keywords: ["pemeriksa shadowban YouTube", "tes shadowban YouTube", "periksa visibilitas channel YouTube"],
    faqs: [
      { question: "Bisakah pemeriksa ini memastikan shadowban YouTube?", answer: "Tidak. YouTube tidak menerbitkan status shadowban resmi atau keputusan rekomendasi internal. Alat ini hanya memeriksa beberapa sinyal halaman publik." },
      { question: "Format channel apa yang bisa saya masukkan?", answer: "Masukkan handle seperti @MrBeast, URL youtube.com/@handle, URL lama /c/, atau URL ID /channel/UC... ." },
      { question: "Apakah hasil sehat menjamin video muncul di pencarian?", answer: "Tidak. Halaman channel publik dan video yang terlihat tidak menjamin posisi pencarian atau rekomendasi. Peringkat dapat berbeda menurut kueri, penonton, wilayah, dan waktu." },
      { question: "Apakah saya perlu login atau memberikan kunci API?", answer: "Tidak. Pemeriksa membuka halaman channel publik saat logout. Jangan pernah membagikan kata sandi atau token akses." },
      { question: "Apa yang harus dilakukan jika channel tidak terlihat atau jangkauan turun?", answer: "Periksa pembatasan dan pemberitahuan kebijakan di YouTube Studio, lalu bandingkan URL channel dan video saat logout. Penurunan penayangan saja tidak membuktikan pembatasan." },
    ],
  },
  es: {
    h1: "Comprobador de shadowban de YouTube",
    subtitle: "Revisa señales públicas de visibilidad de un canal de YouTube sin iniciar sesión ni usar una clave API.",
    inputLabel: "Usuario o URL del canal de YouTube",
    inputPlaceholder: "@MrBeast o youtube.com/@MrBeast",
    buttonLabel: "COMPROBAR CANAL",
    loadingLabel: "COMPROBANDO SEÑALES PÚBLICAS...",
    resultTitle: "Resultados de visibilidad para",
    scoreLabel: "Puntuación de visibilidad",
    goodLabel: "Bien",
    reviewLabel: "Revisar",
    healthyLabel: "Saludable",
    suggestedLabel: "Conviene revisar",
    fixTitle: "Cómo solucionar problemas de visibilidad",
    fixSteps: ["Abre YouTube Studio y revisa las infracciones del canal, las restricciones de vídeos y los avisos de apelación.", "Confirma que el canal y los vídeos recientes sean públicos y no tengan restricción de edad ni bloqueo regional.", "Usa títulos, descripciones y miniaturas claros y fieles al contenido; evita repetir metadatos.", "Si YouTube muestra una decisión de política concreta, sigue su proceso de apelación y espera a que se apliquen los cambios."],
    resultNote: "Esta es una revisión heurística de visibilidad, no un estado oficial de YouTube. YouTube no publica el estado de shadowban.",
    faqTitle: "Preguntas frecuentes sobre shadowban en YouTube",
    keywords: ["comprobador de shadowban de YouTube", "test de shadowban YouTube", "comprobar visibilidad canal YouTube"],
    faqs: [
      { question: "¿Este comprobador puede confirmar un shadowban de YouTube?", answer: "No. YouTube no publica un estado oficial de shadowban ni sus decisiones internas de recomendación. Esta herramienta solo comprueba algunas señales públicas de la página." },
      { question: "¿Qué formatos de canal puedo introducir?", answer: "Escribe un usuario como @MrBeast, una URL youtube.com/@usuario, una URL antigua /c/ o una URL de ID /channel/UC... ." },
      { question: "¿Un resultado saludable garantiza que mis vídeos aparezcan en búsquedas?", answer: "No. Una página pública y vídeos visibles no garantizan su posición en búsquedas ni recomendaciones. La clasificación puede variar por consulta, espectador, región y momento." },
      { question: "¿Tengo que iniciar sesión o proporcionar una clave API?", answer: "No. El comprobador consulta la página pública del canal sin iniciar sesión. Nunca compartas contraseñas ni tokens de acceso." },
      { question: "¿Qué hago si mi canal no aparece o bajan las visitas?", answer: "Revisa las restricciones y avisos de políticas en YouTube Studio y compara las URL del canal y los vídeos sin iniciar sesión. Una bajada de visitas no demuestra una restricción." },
    ],
  },
  fr: {
    h1: "Vérificateur de shadowban YouTube",
    subtitle: "Examinez les signaux publics de visibilité d'une chaîne YouTube, sans connexion ni clé API.",
    inputLabel: "Identifiant ou URL de chaîne YouTube",
    inputPlaceholder: "@MrBeast ou youtube.com/@MrBeast",
    buttonLabel: "VÉRIFIER LA CHAÎNE",
    loadingLabel: "VÉRIFICATION DES SIGNAUX PUBLICS...",
    resultTitle: "Résultats de visibilité pour",
    scoreLabel: "Score de visibilité",
    goodLabel: "Bon",
    reviewLabel: "À vérifier",
    healthyLabel: "Sain",
    suggestedLabel: "Vérification conseillée",
    fixTitle: "Comment améliorer la visibilité",
    fixSteps: ["Ouvrez YouTube Studio et consultez les avertissements de chaîne, les restrictions vidéo et les avis d'appel.", "Vérifiez que la chaîne et les vidéos récentes sont publiques, sans restriction d'âge ni blocage régional.", "Choisissez des titres, descriptions et miniatures fidèles au contenu et évitez les métadonnées répétitives.", "Si YouTube indique une décision précise liée à une règle, suivez la procédure d'appel et attendez la prise en compte des changements."],
    resultNote: "Il s'agit d'un examen heuristique de visibilité, pas d'un statut officiel de YouTube. YouTube ne publie pas de statut de shadowban.",
    faqTitle: "Questions fréquentes sur le shadowban YouTube",
    keywords: ["vérificateur shadowban YouTube", "test shadowban YouTube", "vérifier visibilité chaîne YouTube"],
    faqs: [
      { question: "Cet outil peut-il confirmer un shadowban YouTube ?", answer: "Non. YouTube ne publie ni statut officiel de shadowban ni ses décisions internes de recommandation. Cet outil vérifie seulement quelques signaux publics." },
      { question: "Quels formats de chaîne puis-je saisir ?", answer: "Saisissez un identifiant comme @MrBeast, une URL youtube.com/@identifiant, une ancienne URL /c/ ou une URL d'identifiant /channel/UC... ." },
      { question: "Un résultat sain garantit-il que mes vidéos apparaîtront dans les recherches ?", answer: "Non. Une page publique et des vidéos visibles ne garantissent ni leur classement dans les recherches ni les recommandations. Le classement varie selon la requête, la personne, la région et le moment." },
      { question: "Dois-je me connecter ou fournir une clé API ?", answer: "Non. L'outil consulte la page publique de la chaîne sans connexion. Ne partagez jamais votre mot de passe ou un jeton d'accès." },
      { question: "Que faire si ma chaîne est introuvable ou si les vues baissent ?", answer: "Consultez les restrictions et avis dans YouTube Studio, puis comparez les URL publiques de la chaîne et des vidéos. Une baisse des vues ne prouve pas une restriction." },
    ],
  },
  it: {
    h1: "Verifica shadowban YouTube",
    subtitle: "Esamina i segnali pubblici di visibilità di un canale YouTube senza accesso e senza chiave API.",
    inputLabel: "Handle o URL del canale YouTube",
    inputPlaceholder: "@MrBeast oppure youtube.com/@MrBeast",
    buttonLabel: "VERIFICA CANALE",
    loadingLabel: "CONTROLLO DEI SEGNALI PUBBLICI...",
    resultTitle: "Risultati di visibilità per",
    scoreLabel: "Punteggio di visibilità",
    goodLabel: "Buono",
    reviewLabel: "Da verificare",
    healthyLabel: "Regolare",
    suggestedLabel: "Verifica consigliata",
    fixTitle: "Come risolvere i problemi di visibilità",
    fixSteps: ["Apri YouTube Studio e controlla violazioni del canale, limitazioni dei video e avvisi sui ricorsi.", "Verifica che il canale e i video recenti siano pubblici, senza limiti di età o blocchi regionali.", "Scegli titoli, descrizioni e miniature chiari e coerenti con i video; evita metadati ripetuti.", "Se YouTube indica una decisione specifica, segui la procedura di ricorso e attendi che le modifiche abbiano effetto."],
    resultNote: "Questa è una valutazione euristica della visibilità, non uno stato ufficiale di YouTube. YouTube non pubblica uno stato shadowban.",
    faqTitle: "FAQ sullo shadowban YouTube",
    keywords: ["verifica shadowban YouTube", "test shadowban YouTube", "controllo visibilità canale YouTube"],
    faqs: [
      { question: "Questo strumento può confermare uno shadowban YouTube?", answer: "No. YouTube non pubblica uno stato ufficiale di shadowban né le decisioni interne sui consigli. Lo strumento controlla solo alcuni segnali pubblici." },
      { question: "Quali formati di canale posso inserire?", answer: "Inserisci un handle come @MrBeast, un URL youtube.com/@handle, un vecchio URL /c/ o un URL ID /channel/UC... ." },
      { question: "Un risultato regolare garantisce che i video compaiano nelle ricerche?", answer: "No. Una pagina pubblica e i video visibili non garantiscono il posizionamento nella ricerca o nei consigli. L'ordine varia in base a query, spettatore, area e momento." },
      { question: "Devo accedere o fornire una chiave API?", answer: "No. Lo strumento richiede la pagina pubblica del canale senza accesso. Non condividere mai password o token." },
      { question: "Cosa faccio se il canale non si trova o le visualizzazioni calano?", answer: "Controlla avvisi e limitazioni in YouTube Studio, poi confronta gli URL pubblici di canale e video. Un calo delle visualizzazioni non dimostra una limitazione." },
    ],
  },
  nl: {
    h1: "YouTube-shadowbanchecker",
    subtitle: "Controleer openbare zichtbaarheidssignalen van een YouTube-kanaal zonder in te loggen of API-sleutel.",
    inputLabel: "YouTube-handle of kanaal-URL",
    inputPlaceholder: "@MrBeast of youtube.com/@MrBeast",
    buttonLabel: "KANAAL CONTROLEREN",
    loadingLabel: "OPENBARE SIGNALEN CONTROLEREN...",
    resultTitle: "Zichtbaarheidsresultaten voor",
    scoreLabel: "Zichtbaarheidsscore",
    goodLabel: "Goed",
    reviewLabel: "Controle nodig",
    healthyLabel: "Gezond",
    suggestedLabel: "Controle aanbevolen",
    fixTitle: "Zo los je zichtbaarheid op",
    fixSteps: ["Open YouTube Studio en controleer kanaalovertredingen, videobeperkingen en meldingen over bezwaar.", "Controleer of het kanaal en recente video's openbaar zijn en niet leeftijdsbeperkt of regionaal geblokkeerd.", "Gebruik duidelijke titels, beschrijvingen en thumbnails die bij de video passen; vermijd herhaalde metadata.", "Volg bij een concrete beleidsbeslissing de bezwaarprocedure van YouTube en wacht tot wijzigingen zijn verwerkt."],
    resultNote: "Dit is een heuristische zichtbaarheidscontrole, geen officiële YouTube-status. YouTube publiceert geen shadowbanstatus.",
    faqTitle: "Veelgestelde vragen over YouTube-shadowbans",
    keywords: ["YouTube-shadowbanchecker", "YouTube-shadowbantest", "YouTube-kanaalzichtbaarheid controleren"],
    faqs: [
      { question: "Kan deze checker een YouTube-shadowban bevestigen?", answer: "Nee. YouTube publiceert geen officiële shadowbanstatus of interne aanbevelingsbeslissingen. Deze tool controleert alleen enkele openbare paginasignalen." },
      { question: "Welke kanaalnotaties kan ik invoeren?", answer: "Voer een handle zoals @MrBeast in, een youtube.com/@handle-URL, een oudere /c/-URL of een /channel/UC...-ID-URL." },
      { question: "Garandeert een gezonde uitslag dat mijn video's in zoekresultaten komen?", answer: "Nee. Een openbare kanaalpagina en zichtbare video's garanderen geen positie in zoekresultaten of aanbevelingen. De rangschikking kan per zoekopdracht, kijker, regio en tijd verschillen." },
      { question: "Moet ik inloggen of een API-sleutel opgeven?", answer: "Nee. De checker haalt de openbare kanaalpagina op zonder in te loggen. Deel nooit je wachtwoord of toegangstoken." },
      { question: "Wat moet ik doen als mijn kanaal niet verschijnt of het bereik daalt?", answer: "Controleer meldingen en beperkingen in YouTube Studio en vergelijk openbare kanaal- en video-URL's. Minder weergaven bewijzen op zichzelf geen beperking." },
    ],
  },
  pl: {
    h1: "Sprawdzanie shadowbana na YouTube",
    subtitle: "Sprawdź publiczne sygnały widoczności kanału YouTube bez logowania i klucza API.",
    inputLabel: "Uchwyt lub adres URL kanału YouTube",
    inputPlaceholder: "@MrBeast lub youtube.com/@MrBeast",
    buttonLabel: "SPRAWDŹ KANAŁ",
    loadingLabel: "SPRAWDZANIE PUBLICZNYCH SYGNAŁÓW...",
    resultTitle: "Wyniki widoczności dla",
    scoreLabel: "Wynik widoczności",
    goodLabel: "Dobrze",
    reviewLabel: "Wymaga sprawdzenia",
    healthyLabel: "Bez zastrzeżeń",
    suggestedLabel: "Zalecana kontrola",
    fixTitle: "Jak poprawić widoczność",
    fixSteps: ["Otwórz YouTube Studio i sprawdź naruszenia kanału, ograniczenia filmów oraz informacje o odwołaniach.", "Upewnij się, że kanał i najnowsze filmy są publiczne, bez ograniczeń wiekowych i blokad regionalnych.", "Stosuj jasne tytuły, opisy i miniatury zgodne z treścią; unikaj powtarzalnych metadanych.", "Jeśli YouTube wskazuje konkretną decyzję dotyczącą zasad, skorzystaj z procedury odwoławczej i poczekaj na jej rozpatrzenie."],
    resultNote: "To heurystyczna ocena widoczności, a nie oficjalny status YouTube. YouTube nie publikuje statusu shadowbana.",
    faqTitle: "FAQ o shadowbanie na YouTube",
    keywords: ["sprawdzanie shadowbana YouTube", "test shadowbana YouTube", "sprawdź widoczność kanału YouTube"],
    faqs: [
      { question: "Czy ten checker potwierdzi shadowbana na YouTube?", answer: "Nie. YouTube nie publikuje oficjalnego statusu shadowbana ani wewnętrznych decyzji o polecaniu. Narzędzie sprawdza jedynie kilka publicznych sygnałów strony." },
      { question: "Jakie formaty kanału mogę wpisać?", answer: "Wpisz uchwyt, np. @MrBeast, adres youtube.com/@uchwyt, starszy adres /c/ lub adres identyfikatora /channel/UC... ." },
      { question: "Czy dobry wynik gwarantuje, że filmy pojawią się w wyszukiwarce?", answer: "Nie. Publiczna strona kanału i widoczne filmy nie gwarantują pozycji w wynikach ani rekomendacjach. Ranking zależy od zapytania, odbiorcy, regionu i czasu." },
      { question: "Czy muszę się zalogować lub podać klucz API?", answer: "Nie. Checker pobiera publiczną stronę kanału bez logowania. Nigdy nie udostępniaj hasła ani tokenu dostępu." },
      { question: "Co zrobić, jeśli kanału nie widać lub spadają wyświetlenia?", answer: "Sprawdź ograniczenia i komunikaty w YouTube Studio, a następnie porównaj publiczne adresy kanału i filmów. Sam spadek wyświetleń nie dowodzi ograniczenia." },
    ],
  },
};
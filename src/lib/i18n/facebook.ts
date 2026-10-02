import type { Metadata } from "next";
import { baseUrl } from "./config";

export const facebookLocales = ["en", "de", "id", "th", "es", "pt", "it"] as const;
export type FacebookLocale = (typeof facebookLocales)[number];

export const facebookSlugs: Record<FacebookLocale, string> = {
  en: "facebook-shadowban-checker",
  de: "de/facebook-shadowban-test",
  id: "id/cek-shadowban-facebook",
  th: "th/ตรวจสอบ-shadowban-facebook",
  es: "es/comprobar-shadowban-facebook",
  pt: "pt/teste-shadowban-facebook",
  it: "it/test-shadowban-facebook",
};

export function getFacebookUrl(locale: FacebookLocale): string {
  const path = facebookSlugs[locale].split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/${path}`;
}

export type FacebookCopy = {
  h1: string;
  subtitle: string;
  faqTitle: string;
  inputLabel: string;
  buttonLabel: string;
  loadingLabel: string;
  resultTitle: string;
  resultNote: string;
  facebookSearchLink: string;
  whyTitle: string;
  whyReasons: string[];
  howTitle: string;
  howSteps: string[];
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

export const facebookCopy: Record<FacebookLocale, FacebookCopy> = {
  en: {
    h1: "Facebook Shadowban Checker",
    subtitle: "Review public visibility signals for a Facebook profile. No password or login is needed; Meta's internal distribution status is not publicly available.",
    faqTitle: "Facebook shadowban FAQs",
    inputLabel: "Facebook profile name or username",
    buttonLabel: "CHECK VISIBILITY",
    loadingLabel: "PREPARING REVIEW...",
    resultTitle: "Visibility review for @{username}",
    resultNote: "Facebook does not provide a public shadowban status, and this review cannot access private reach or recommendation data. The steps below help you check what is visible to other people.",
    facebookSearchLink: "Open Facebook search results",
    whyTitle: "Why reach can change",
    whyReasons: [
      "A change in reach alone does not prove that an account has been restricted.",
      "Audience activity, content format, ranking changes, and recommendation eligibility can all affect distribution.",
      "Only Facebook can show account-level restrictions and recommendation notices in its own tools.",
    ],
    howTitle: "How to check your account",
    howSteps: [
      "Open Account Status in Facebook and review any restrictions or recommendation notices.",
      "View your profile and recent posts while logged out, or ask someone who is not connected to you to check them.",
      "Compare several recent posts and their audience reach; do not rely on one post or a third-party checker as proof.",
    ],
    keywords: ["Facebook shadowban checker", "Facebook shadowban test", "check Facebook visibility", "Facebook reach drop"],
    faqs: [
      { question: "Can a public checker confirm a Facebook shadowban?", answer: "No. Facebook does not expose an official public shadowban status or internal reach data. This page provides a manual visibility checklist, not a diagnosis." },
      { question: "Do I need to share my Facebook password?", answer: "No. Never share your password with a checker. This tool only uses the profile name you enter and does not log in to Facebook." },
      { question: "Where can I review account restrictions?", answer: "Check Account Status and any recommendation or policy notices in Facebook. These first-party notices are more reliable than assumptions based only on lower reach." },
    ],
  },
  de: {
    h1: "Facebook-Shadowban-Checker",
    subtitle: "Prüfe öffentliche Sichtbarkeitssignale eines Facebook-Profils. Passwort und Anmeldung sind nicht erforderlich; Metas interne Ausspielungsdaten sind nicht öffentlich.",
    faqTitle: "Häufige Fragen zum Facebook-Shadowban",
    inputLabel: "Facebook-Profilname oder Benutzername",
    buttonLabel: "SICHTBARKEIT PRÜFEN",
    loadingLabel: "PRÜFUNG WIRD VORBEREITET...",
    resultTitle: "Sichtbarkeitsprüfung für @{username}",
    resultNote: "Facebook stellt keinen öffentlichen Shadowban-Status bereit. Diese Prüfung kann keine privaten Reichweiten- oder Empfehlungsdaten abrufen. Die folgenden Schritte helfen dir, öffentliche Inhalte zu prüfen.",
    facebookSearchLink: "Facebook-Suchergebnisse öffnen",
    whyTitle: "Warum sich die Reichweite ändern kann",
    whyReasons: [
      "Eine veränderte Reichweite allein beweist keine Einschränkung des Kontos.",
      "Aktivität der Zielgruppe, Inhaltsformat, Ranking-Änderungen und Empfehlungseignung beeinflussen die Ausspielung.",
      "Nur Facebook zeigt Kontoeinschränkungen und Hinweise zu Empfehlungen in den eigenen Werkzeugen an.",
    ],
    howTitle: "So prüfst du dein Konto",
    howSteps: [
      "Öffne den Kontostatus auf Facebook und prüfe Einschränkungen oder Hinweise zu Empfehlungen.",
      "Rufe dein Profil und aktuelle Beiträge abgemeldet auf oder bitte eine nicht verbundene Person darum.",
      "Vergleiche mehrere aktuelle Beiträge und ihre Reichweite; ein einzelner Beitrag oder externer Checker ist kein Beweis.",
    ],
    keywords: ["Facebook Shadowban Checker", "Facebook Shadowban Test", "Facebook Sichtbarkeit prüfen", "Facebook Reichweite"],
    faqs: [
      { question: "Kann ein öffentlicher Checker einen Facebook-Shadowban bestätigen?", answer: "Nein. Facebook veröffentlicht weder einen offiziellen Shadowban-Status noch interne Reichweitendaten. Diese Seite bietet eine manuelle Prüfliste, keine Diagnose." },
      { question: "Muss ich mein Facebook-Passwort teilen?", answer: "Nein. Teile dein Passwort niemals mit einem Checker. Dieses Tool verwendet nur den eingegebenen Profilnamen und meldet sich nicht bei Facebook an." },
      { question: "Wo kann ich Kontoeinschränkungen prüfen?", answer: "Prüfe den Kontostatus und Hinweise zu Empfehlungen oder Richtlinien direkt auf Facebook. Diese Hinweise sind zuverlässiger als Vermutungen aufgrund geringerer Reichweite." },
    ],
  },
  id: {
    h1: "Pemeriksa Shadowban Facebook",
    subtitle: "Tinjau sinyal visibilitas publik profil Facebook. Kata sandi dan login tidak diperlukan; status distribusi internal Meta tidak tersedia untuk publik.",
    faqTitle: "FAQ shadowban Facebook",
    inputLabel: "Nama profil atau nama pengguna Facebook",
    buttonLabel: "PERIKSA VISIBILITAS",
    loadingLabel: "MENYIAPKAN PEMERIKSAAN...",
    resultTitle: "Tinjauan visibilitas untuk @{username}",
    resultNote: "Facebook tidak menyediakan status shadowban publik. Tinjauan ini tidak dapat mengakses data jangkauan atau rekomendasi privat. Langkah berikut membantu Anda memeriksa konten yang terlihat oleh orang lain.",
    facebookSearchLink: "Buka hasil pencarian Facebook",
    whyTitle: "Mengapa jangkauan dapat berubah",
    whyReasons: [
      "Perubahan jangkauan saja tidak membuktikan bahwa akun dibatasi.",
      "Aktivitas audiens, format konten, perubahan peringkat, dan kelayakan rekomendasi dapat memengaruhi distribusi.",
      "Hanya Facebook yang dapat menampilkan pembatasan akun dan pemberitahuan rekomendasi melalui fiturnya sendiri.",
    ],
    howTitle: "Cara memeriksa akun",
    howSteps: [
      "Buka Status Akun di Facebook dan tinjau pembatasan atau pemberitahuan rekomendasi.",
      "Lihat profil dan posting terbaru saat logout, atau minta seseorang yang tidak berteman dengan Anda untuk memeriksanya.",
      "Bandingkan beberapa posting terbaru dan jangkauannya; jangan jadikan satu posting atau checker pihak ketiga sebagai bukti.",
    ],
    keywords: ["pemeriksa shadowban Facebook", "tes shadowban Facebook", "cek visibilitas Facebook", "jangkauan Facebook turun"],
    faqs: [
      { question: "Bisakah checker publik memastikan shadowban Facebook?", answer: "Tidak. Facebook tidak menyediakan status shadowban resmi atau data jangkauan internal untuk publik. Halaman ini memberikan daftar pemeriksaan manual, bukan diagnosis." },
      { question: "Apakah saya harus memberikan kata sandi Facebook?", answer: "Tidak. Jangan pernah membagikan kata sandi kepada checker. Alat ini hanya menggunakan nama profil yang Anda masukkan dan tidak login ke Facebook." },
      { question: "Di mana saya dapat memeriksa pembatasan akun?", answer: "Periksa Status Akun dan pemberitahuan rekomendasi atau kebijakan langsung di Facebook. Pemberitahuan tersebut lebih dapat diandalkan daripada dugaan berdasarkan jangkauan yang menurun." },
    ],
  },
  th: {
    h1: "เครื่องมือตรวจสอบ Shadowban Facebook",
    subtitle: "ตรวจสอบสัญญาณการมองเห็นโปรไฟล์ Facebook แบบสาธารณะ ไม่ต้องใช้รหัสผ่านหรือเข้าสู่ระบบ และสถานะการกระจายเนื้อหาภายในของ Meta ไม่เปิดเผยต่อสาธารณะ",
    faqTitle: "คำถามที่พบบ่อยเกี่ยวกับ Shadowban Facebook",
    inputLabel: "ชื่อโปรไฟล์หรือชื่อผู้ใช้ Facebook",
    buttonLabel: "ตรวจสอบการมองเห็น",
    loadingLabel: "กำลังเตรียมการตรวจสอบ...",
    resultTitle: "ผลการตรวจสอบการมองเห็นของ @{username}",
    resultNote: "Facebook ไม่มีสถานะ Shadowban สาธารณะ การตรวจสอบนี้ไม่สามารถเข้าถึงข้อมูลการเข้าถึงหรือการแนะนำส่วนตัวได้ ขั้นตอนด้านล่างช่วยตรวจสอบเนื้อหาที่ผู้อื่นมองเห็น",
    facebookSearchLink: "เปิดผลการค้นหา Facebook",
    whyTitle: "เหตุใดการเข้าถึงจึงเปลี่ยนแปลงได้",
    whyReasons: [
      "การเข้าถึงที่เปลี่ยนไปเพียงอย่างเดียวไม่ได้ยืนยันว่าบัญชีถูกจำกัด",
      "กิจกรรมของผู้ชม รูปแบบเนื้อหา การจัดอันดับ และสิทธิ์ในการแนะนำล้วนส่งผลต่อการเผยแพร่ได้",
      "มีเพียง Facebook เท่านั้นที่แสดงข้อจำกัดบัญชีและการแจ้งเตือนการแนะนำในเครื่องมือของตนได้",
    ],
    howTitle: "วิธีตรวจสอบบัญชีของคุณ",
    howSteps: [
      "เปิดสถานะบัญชีใน Facebook และตรวจสอบข้อจำกัดหรือการแจ้งเตือนเกี่ยวกับการแนะนำ",
      "ดูโปรไฟล์และโพสต์ล่าสุดขณะออกจากระบบ หรือขอให้คนที่ไม่ได้เชื่อมต่อกับคุณตรวจสอบ",
      "เปรียบเทียบโพสต์ล่าสุดหลายรายการและการเข้าถึง อย่าใช้โพสต์เดียวหรือเครื่องมือภายนอกเป็นหลักฐาน",
    ],
    keywords: ["ตรวจสอบ Facebook shadowban", "ทดสอบ shadowban Facebook", "ตรวจสอบการมองเห็น Facebook", "การเข้าถึง Facebook ลดลง"],
    faqs: [
      { question: "เครื่องมือตรวจสอบสาธารณะยืนยัน Shadowban Facebook ได้ไหม?", answer: "ไม่ได้ Facebook ไม่เปิดเผยสถานะ Shadowban อย่างเป็นทางการหรือข้อมูลการเข้าถึงภายใน หน้านี้ให้รายการตรวจสอบด้วยตนเอง ไม่ใช่การวินิจฉัย" },
      { question: "ต้องให้รหัสผ่าน Facebook หรือไม่?", answer: "ไม่ต้อง อย่าเปิดเผยรหัสผ่านให้เครื่องมือตรวจสอบ เครื่องมือนี้ใช้เพียงชื่อโปรไฟล์ที่คุณกรอกและไม่เข้าสู่ระบบ Facebook" },
      { question: "ตรวจสอบข้อจำกัดบัญชีได้ที่ไหน?", answer: "ตรวจสอบสถานะบัญชีและการแจ้งเตือนด้านคำแนะนำหรือนโยบายใน Facebook โดยตรง ข้อมูลเหล่านี้น่าเชื่อถือกว่าการคาดเดาจากการเข้าถึงที่ลดลง" },
    ],
  },
  es: {
    h1: "Comprobador de shadowban de Facebook",
    subtitle: "Revisa señales públicas de visibilidad de un perfil de Facebook. No necesitas contraseña ni iniciar sesión; el estado interno de distribución de Meta no es público.",
    faqTitle: "Preguntas frecuentes sobre shadowban en Facebook",
    inputLabel: "Nombre o usuario del perfil de Facebook",
    buttonLabel: "COMPROBAR VISIBILIDAD",
    loadingLabel: "PREPARANDO LA REVISIÓN...",
    resultTitle: "Revisión de visibilidad de @{username}",
    resultNote: "Facebook no ofrece un estado público de shadowban. Esta revisión no puede acceder a datos privados de alcance o recomendaciones. Los pasos siguientes te ayudan a comprobar qué contenido ven otras personas.",
    facebookSearchLink: "Abrir resultados de búsqueda de Facebook",
    whyTitle: "Por qué puede cambiar el alcance",
    whyReasons: [
      "Un cambio en el alcance, por sí solo, no demuestra que una cuenta tenga restricciones.",
      "La actividad de la audiencia, el formato, los cambios de clasificación y la aptitud para recomendaciones afectan a la distribución.",
      "Solo Facebook puede mostrar restricciones de cuenta y avisos de recomendaciones en sus propias herramientas.",
    ],
    howTitle: "Cómo revisar tu cuenta",
    howSteps: [
      "Abre Estado de la cuenta en Facebook y revisa las restricciones o avisos de recomendaciones.",
      "Consulta tu perfil y publicaciones recientes sin iniciar sesión, o pide a alguien que no esté conectado contigo que los revise.",
      "Compara varias publicaciones recientes y su alcance; una sola publicación o un comprobador externo no son una prueba.",
    ],
    keywords: ["comprobador shadowban Facebook", "test shadowban Facebook", "comprobar visibilidad Facebook", "bajada de alcance Facebook"],
    faqs: [
      { question: "¿Un comprobador público puede confirmar un shadowban de Facebook?", answer: "No. Facebook no publica un estado oficial de shadowban ni datos internos de alcance. Esta página ofrece una lista de comprobación manual, no un diagnóstico." },
      { question: "¿Tengo que compartir mi contraseña de Facebook?", answer: "No. Nunca compartas tu contraseña con un comprobador. Esta herramienta solo usa el nombre del perfil y no inicia sesión en Facebook." },
      { question: "¿Dónde puedo revisar las restricciones de mi cuenta?", answer: "Consulta Estado de la cuenta y los avisos de recomendaciones o políticas directamente en Facebook. Son más fiables que las suposiciones basadas en una bajada del alcance." },
    ],
  },
  pt: {
    h1: "Verificador de shadowban do Facebook",
    subtitle: "Analise sinais públicos de visibilidade de um perfil do Facebook. Não é preciso senha nem login; o status interno de distribuição da Meta não é público.",
    faqTitle: "Perguntas frequentes sobre shadowban no Facebook",
    inputLabel: "Nome ou usuário do perfil do Facebook",
    buttonLabel: "VERIFICAR VISIBILIDADE",
    loadingLabel: "PREPARANDO A ANÁLISE...",
    resultTitle: "Análise de visibilidade de @{username}",
    resultNote: "O Facebook não fornece um status público de shadowban. Esta análise não acessa dados privados de alcance ou recomendação. As etapas abaixo ajudam a verificar o que outras pessoas conseguem ver.",
    facebookSearchLink: "Abrir resultados de pesquisa do Facebook",
    whyTitle: "Por que o alcance pode mudar",
    whyReasons: [
      "Uma mudança no alcance, sozinha, não comprova que uma conta foi restringida.",
      "Atividade do público, formato do conteúdo, mudanças no ranqueamento e elegibilidade para recomendações afetam a distribuição.",
      "Somente o Facebook pode mostrar restrições da conta e avisos de recomendação nas ferramentas da própria plataforma.",
    ],
    howTitle: "Como verificar sua conta",
    howSteps: [
      "Abra o Status da Conta no Facebook e verifique restrições ou avisos sobre recomendações.",
      "Veja seu perfil e publicações recentes sem entrar na conta, ou peça para alguém que não seja seu contato verificar.",
      "Compare várias publicações recentes e o alcance delas; uma publicação ou ferramenta externa não é prova.",
    ],
    keywords: ["verificador de shadowban Facebook", "teste de shadowban Facebook", "verificar visibilidade Facebook", "queda de alcance Facebook"],
    faqs: [
      { question: "Um verificador público confirma um shadowban no Facebook?", answer: "Não. O Facebook não divulga um status oficial de shadowban nem dados internos de alcance. Esta página oferece uma lista manual de verificação, não um diagnóstico." },
      { question: "Preciso compartilhar minha senha do Facebook?", answer: "Não. Nunca compartilhe sua senha com um verificador. Esta ferramenta usa apenas o nome do perfil informado e não entra no Facebook." },
      { question: "Onde posso verificar restrições na conta?", answer: "Consulte o Status da Conta e os avisos de recomendação ou política diretamente no Facebook. Eles são mais confiáveis que suposições baseadas apenas na queda do alcance." },
    ],
  },
  it: {
    h1: "Checker shadowban Facebook",
    subtitle: "Esamina i segnali pubblici di visibilità di un profilo Facebook. Non servono password o accesso; lo stato interno di distribuzione di Meta non è pubblico.",
    faqTitle: "Domande frequenti sullo shadowban Facebook",
    inputLabel: "Nome o username del profilo Facebook",
    buttonLabel: "CONTROLLA LA VISIBILITÀ",
    loadingLabel: "PREPARAZIONE DEL CONTROLLO...",
    resultTitle: "Verifica della visibilità per @{username}",
    resultNote: "Facebook non offre uno stato pubblico di shadowban. Questa verifica non può accedere ai dati privati su copertura o raccomandazioni. I passaggi seguenti aiutano a controllare cosa è visibile agli altri.",
    facebookSearchLink: "Apri i risultati di ricerca Facebook",
    whyTitle: "Perché la copertura può cambiare",
    whyReasons: [
      "Una variazione della copertura, da sola, non dimostra che un account sia stato limitato.",
      "Attività del pubblico, formato dei contenuti, cambiamenti nel ranking e idoneità ai consigli possono influire sulla distribuzione.",
      "Solo Facebook può mostrare limitazioni dell'account e avvisi sulle raccomandazioni nei propri strumenti.",
    ],
    howTitle: "Come controllare il tuo account",
    howSteps: [
      "Apri Stato dell'account su Facebook e controlla eventuali limitazioni o avvisi sulle raccomandazioni.",
      "Visualizza il profilo e i post recenti senza accedere, oppure chiedi a una persona non collegata di controllarli.",
      "Confronta più post recenti e la relativa copertura; un singolo post o un checker esterno non sono una prova.",
    ],
    keywords: ["checker shadowban Facebook", "test shadowban Facebook", "controllare visibilità Facebook", "calo copertura Facebook"],
    faqs: [
      { question: "Un checker pubblico può confermare uno shadowban Facebook?", answer: "No. Facebook non pubblica uno stato ufficiale di shadowban né i dati interni sulla copertura. Questa pagina offre una lista di controlli manuali, non una diagnosi." },
      { question: "Devo condividere la password di Facebook?", answer: "No. Non condividere mai la password con un checker. Questo strumento usa solo il nome del profilo inserito e non accede a Facebook." },
      { question: "Dove posso controllare le limitazioni dell'account?", answer: "Controlla Stato dell'account e gli avvisi sulle raccomandazioni o sulle policy direttamente su Facebook. Sono più affidabili delle supposizioni basate sul calo della copertura." },
    ],
  },
};

const facebookTitles: Record<FacebookLocale, string> = {
  en: "Facebook Shadowban Checker | ShadowbannChecker",
  de: "Facebook-Shadowban-Test | ShadowbannChecker",
  id: "Cek Shadowban Facebook | ShadowbannChecker",
  th: "ตรวจสอบ Shadowban Facebook | ShadowbannChecker",
  es: "Comprobar shadowban en Facebook | ShadowbannChecker",
  pt: "Teste de shadowban no Facebook | ShadowbannChecker",
  it: "Test shadowban Facebook | ShadowbannChecker",
};

function createFacebookMetadata(locale: FacebookLocale): Metadata {
  const url = getFacebookUrl(locale);
  const copy = facebookCopy[locale];
  const title = facebookTitles[locale];
  const languages = Object.fromEntries(facebookLocales.map((language) => [language, getFacebookUrl(language)]));

  return {
    title,
    description: copy.subtitle,
    keywords: copy.keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": getFacebookUrl("en") },
    },
    openGraph: { type: "website", url, title, description: copy.subtitle, siteName: "ShadowbannChecker" },
  };
}

export const facebookMetadata: Record<FacebookLocale, Metadata> = {
  en: createFacebookMetadata("en"),
  de: createFacebookMetadata("de"),
  id: createFacebookMetadata("id"),
  th: createFacebookMetadata("th"),
  es: createFacebookMetadata("es"),
  pt: createFacebookMetadata("pt"),
  it: createFacebookMetadata("it"),
};

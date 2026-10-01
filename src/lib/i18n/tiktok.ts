import type { Metadata } from "next";
import { baseUrl } from "./config";

export const tiktokLocales = ["en", "de", "id", "pt", "es", "it", "th"] as const;
export type TikTokLocale = (typeof tiktokLocales)[number];

const tiktokSlugs: Record<TikTokLocale, string> = {
  en: "tiktok",
  de: "de/tiktok-shadowban-test",
  id: "id/cek-shadowban-tiktok",
  pt: "pt/teste-shadowban-tiktok",
  es: "es/comprobar-shadowban-tiktok",
  it: "it/test-shadowban-tiktok",
  th: "th/check-shadowban-tiktok",
};

type TikTokCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: { question: string; answer: string }[];
};

export const tiktokCopies: Record<TikTokLocale, TikTokCopy> = {
  en: {
    title: "TikTok Shadowban Checker | ShadowbannChecker",
    description:
      "Check if your TikTok account is shadowbanned for free. Test username, video visibility, hashtag suppression and For You Page (FYP) reach risk without login.",
    h1: "TikTok Shadowban Checker",
    intro:
      "The TikTok checker is coming soon. Learn about video visibility, hashtag suppression, and For You Page (FYP) reach signals. TikTok does not provide an official shadowban status.",
    keywords: [
      "TikTok shadowban checker",
      "TikTok shadowban test",
      "TikTok video visibility",
      "TikTok hashtag suppression",
      "TikTok FYP reach",
    ],
    faqs: [
      {
        question: "Does TikTok provide an official shadowban status?",
        answer:
          "No. TikTok does not provide a single official shadowban status. A change in views or For You Page reach alone cannot confirm an account restriction.",
      },
      {
        question: "Can low video views prove a TikTok shadowban?",
        answer:
          "No. Views can change with audience interest, video performance, recommendation eligibility, and platform ranking. Compare several videos and review TikTok account notifications.",
      },
      {
        question: "Do I need to share my TikTok password?",
        answer:
          "No. Never share your password with a checker. The TikTok checker is in development and does not currently analyze accounts.",
      },
    ],
  },
  de: {
    title: "TikTok-Shadowban-Test | ShadowbannChecker",
    description:
      "Prüfe kostenlos, ob dein TikTok-Konto im Shadowban ist. Teste Sichtbarkeit von Videos, Hashtags und For-You-Page-Reichweite ohne Login.",
    h1: "TikTok-Shadowban-Test",
    intro:
      "Der TikTok-Checker kommt bald. Erfahre mehr über Videosichtbarkeit, Hashtag-Unterdrückung und Reichweitensignale auf der For You Page. TikTok bietet keinen offiziellen Shadowban-Status.",
    keywords: [
      "TikTok Shadowban Checker",
      "TikTok Shadowban Test",
      "TikTok Videosichtbarkeit",
      "TikTok Hashtag-Reichweite",
      "TikTok For You Page Reichweite",
    ],
    faqs: [
      {
        question: "Gibt es bei TikTok einen offiziellen Shadowban-Status?",
        answer:
          "Nein. TikTok bietet keinen einzelnen offiziellen Shadowban-Status. Weniger Aufrufe oder Reichweite auf der For You Page allein bestätigen keine Kontoeinschränkung.",
      },
      {
        question: "Beweisen wenige Videoaufrufe einen TikTok-Shadowban?",
        answer:
          "Nein. Aufrufe hängen auch von Interesse, Videoleistung, Empfehlungseignung und Ranking ab. Vergleiche mehrere Videos und prüfe Hinweise in deinem TikTok-Konto.",
      },
      {
        question: "Muss ich mein TikTok-Passwort teilen?",
        answer:
          "Nein. Teile dein Passwort niemals mit einem Checker. Der TikTok-Checker ist in Entwicklung und analysiert derzeit keine Konten.",
      },
    ],
  },
  id: {
    title: "Cek Shadowban TikTok | ShadowbannChecker",
    description:
      "Periksa gratis apakah akun TikTok Anda terkena shadowban. Uji risiko visibilitas video, pembatasan hashtag, dan jangkauan For You Page (FYP) tanpa login.",
    h1: "Pemeriksa Shadowban TikTok",
    intro:
      "Pemeriksa TikTok segera hadir. Pelajari sinyal visibilitas video, pembatasan hashtag, dan jangkauan For You Page (FYP). TikTok tidak menyediakan status shadowban resmi.",
    keywords: [
      "pemeriksa shadowban TikTok",
      "tes shadowban TikTok",
      "visibilitas video TikTok",
      "pembatasan hashtag TikTok",
      "jangkauan FYP TikTok",
    ],
    faqs: [
      {
        question: "Apakah TikTok menyediakan status shadowban resmi?",
        answer:
          "Tidak. TikTok tidak menyediakan satu status shadowban resmi. Penurunan jumlah penayangan atau jangkauan FYP saja tidak membuktikan pembatasan akun.",
      },
      {
        question: "Apakah penayangan video yang rendah membuktikan shadowban?",
        answer:
          "Tidak. Penayangan dapat berubah karena minat audiens, performa video, kelayakan rekomendasi, dan pemeringkatan platform. Bandingkan beberapa video dan periksa notifikasi akun TikTok.",
      },
      {
        question: "Apakah saya perlu membagikan kata sandi TikTok?",
        answer:
          "Tidak. Jangan pernah membagikan kata sandi kepada alat pemeriksa. Pemeriksa TikTok sedang dikembangkan dan saat ini belum menganalisis akun.",
      },
    ],
  },
  pt: {
    title: "Teste de Shadowban no TikTok | ShadowbannChecker",
    description:
      "Verifique gratuitamente se sua conta do TikTok está sofrendo shadowban. Avalie riscos de visibilidade de vídeos, hashtags e alcance da For You Page (FYP), sem login.",
    h1: "Teste de Shadowban no TikTok",
    intro:
      "O verificador do TikTok estará disponível em breve. Saiba mais sobre visibilidade de vídeos, restrição de hashtags e alcance na For You Page. O TikTok não oferece um status oficial de shadowban.",
    keywords: [
      "verificador de shadowban TikTok",
      "teste de shadowban TikTok",
      "visibilidade de vídeos TikTok",
      "restrição de hashtags TikTok",
      "alcance FYP TikTok",
    ],
    faqs: [
      {
        question: "O TikTok oferece um status oficial de shadowban?",
        answer:
          "Não. O TikTok não oferece um status oficial único de shadowban. Uma queda nas visualizações ou no alcance da For You Page, por si só, não confirma uma restrição.",
      },
      {
        question: "Poucas visualizações provam um shadowban no TikTok?",
        answer:
          "Não. As visualizações podem mudar por interesse do público, desempenho do vídeo, elegibilidade para recomendações e classificação da plataforma. Compare vários vídeos e confira os avisos da conta.",
      },
      {
        question: "Preciso compartilhar minha senha do TikTok?",
        answer:
          "Não. Nunca compartilhe sua senha com um verificador. O verificador do TikTok está em desenvolvimento e ainda não analisa contas.",
      },
    ],
  },
  es: {
    title: "Comprobar Shadowban en TikTok | ShadowbannChecker",
    description:
      "Comprueba gratis si tu cuenta de TikTok tiene shadowban. Evalúa riesgos de visibilidad de videos, hashtags y alcance de la página Para ti (FYP), sin iniciar sesión.",
    h1: "Comprobar shadowban en TikTok",
    intro:
      "El verificador de TikTok estará disponible pronto. Aprende sobre visibilidad de videos, limitación de hashtags y alcance en la página Para ti. TikTok no ofrece un estado oficial de shadowban.",
    keywords: [
      "comprobar shadowban TikTok",
      "test shadowban TikTok",
      "visibilidad de videos TikTok",
      "restricción de hashtags TikTok",
      "alcance FYP TikTok",
    ],
    faqs: [
      {
        question: "¿TikTok ofrece un estado oficial de shadowban?",
        answer:
          "No. TikTok no ofrece un estado oficial único de shadowban. Una bajada de visualizaciones o del alcance en Para ti, por sí sola, no confirma una restricción.",
      },
      {
        question: "¿Pocas visualizaciones prueban un shadowban en TikTok?",
        answer:
          "No. Las visualizaciones pueden variar por el interés de la audiencia, el rendimiento del video, la idoneidad para recomendaciones y el ranking. Compara varios videos y revisa los avisos de tu cuenta.",
      },
      {
        question: "¿Tengo que compartir mi contraseña de TikTok?",
        answer:
          "No. Nunca compartas tu contraseña con un verificador. El verificador de TikTok está en desarrollo y todavía no analiza cuentas.",
      },
    ],
  },
  it: {
    title: "Test Shadowban TikTok | ShadowbannChecker",
    description:
      "Controlla gratis se il tuo account TikTok è soggetto a shadowban. Valuta i rischi per visibilità dei video, hashtag e copertura nella pagina Per Te (FYP), senza accesso.",
    h1: "Test Shadowban TikTok",
    intro:
      "Il checker TikTok sarà disponibile a breve. Scopri di più su visibilità dei video, limitazioni degli hashtag e copertura nella pagina Per Te. TikTok non offre uno stato ufficiale di shadowban.",
    keywords: [
      "checker shadowban TikTok",
      "test shadowban TikTok",
      "visibilità video TikTok",
      "limitazione hashtag TikTok",
      "copertura FYP TikTok",
    ],
    faqs: [
      {
        question: "TikTok offre uno stato ufficiale di shadowban?",
        answer:
          "No. TikTok non offre un unico stato ufficiale di shadowban. Un calo di visualizzazioni o della copertura Per Te, da solo, non conferma una limitazione dell'account.",
      },
      {
        question: "Poche visualizzazioni dimostrano uno shadowban su TikTok?",
        answer:
          "No. Le visualizzazioni possono variare in base al pubblico, al video, all'idoneità ai consigliati e al ranking. Confronta più video e controlla le notifiche dell'account.",
      },
      {
        question: "Devo condividere la password di TikTok?",
        answer:
          "No. Non condividere mai la password con un checker. Il checker TikTok è in sviluppo e al momento non analizza gli account.",
      },
    ],
  },
  th: {
    title: "เช็ก Shadowban TikTok | ShadowbannChecker",
    description:
      "ตรวจสอบฟรีว่าบัญชี TikTok ของคุณอาจถูกจำกัดการมองเห็นหรือไม่ ประเมินความเสี่ยงด้านการมองเห็นวิดีโอ แฮชแท็ก และการเข้าถึงหน้า For You (FYP) โดยไม่ต้องเข้าสู่ระบบ",
    h1: "เครื่องมือตรวจสอบ Shadowban TikTok",
    intro:
      "เครื่องมือตรวจสอบ TikTok กำลังอยู่ระหว่างการพัฒนา เรียนรู้เกี่ยวกับสัญญาณการมองเห็นวิดีโอ แฮชแท็ก และการเข้าถึงหน้า For You ทั้งนี้ TikTok ไม่มีสถานะ Shadowban อย่างเป็นทางการ",
    keywords: [
      "ตรวจสอบ shadowban TikTok",
      "ทดสอบ shadowban TikTok",
      "การมองเห็นวิดีโอ TikTok",
      "การจำกัดแฮชแท็ก TikTok",
      "การเข้าถึง FYP TikTok",
    ],
    faqs: [
      {
        question: "TikTok มีสถานะ Shadowban อย่างเป็นทางการหรือไม่?",
        answer:
          "ไม่มี TikTok ไม่มีสถานะ Shadowban อย่างเป็นทางการเพียงสถานะเดียว ยอดเข้าชมหรือการเข้าถึงหน้า For You ที่ลดลงเพียงอย่างเดียวไม่สามารถยืนยันการจำกัดบัญชีได้",
      },
      {
        question: "ยอดดูวิดีโอต่ำยืนยัน Shadowban บน TikTok ได้หรือไม่?",
        answer:
          "ไม่ได้ ยอดดูอาจเปลี่ยนแปลงตามความสนใจของผู้ชม ประสิทธิภาพวิดีโอ สิทธิ์ในการแนะนำ และการจัดอันดับของแพลตฟอร์ม ควรเปรียบเทียบหลายวิดีโอและตรวจสอบการแจ้งเตือนในบัญชี",
      },
      {
        question: "ต้องแชร์รหัสผ่าน TikTok หรือไม่?",
        answer:
          "ไม่ต้อง อย่าแชร์รหัสผ่านกับเครื่องมือตรวจสอบ เครื่องมือตรวจสอบ TikTok อยู่ระหว่างการพัฒนาและยังไม่ได้วิเคราะห์บัญชีในขณะนี้",
      },
    ],
  },
};

export function getTikTokUrl(locale: TikTokLocale): string {
  return `${baseUrl}/${tiktokSlugs[locale]}`;
}

export function getTikTokMetadata(locale: TikTokLocale): Metadata {
  const { title, description, keywords } = tiktokCopies[locale];
  const url = getTikTokUrl(locale);
  const languages = Object.fromEntries(
    tiktokLocales.map((language) => [language, getTikTokUrl(language)]),
  );

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": getTikTokUrl("en") },
    },
    openGraph: { type: "website", url, title, description, siteName: "ShadowbannChecker" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
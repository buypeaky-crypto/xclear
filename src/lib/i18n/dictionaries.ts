import type { Locale } from "./config";

export type LocaleFaq = {
  question: string;
  answer: string;
};

export type LocaleDictionary = {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  faqTitle: string;
  keywords: string[];
  faqs: LocaleFaq[];
};

export const dictionaries: Record<Exclude<Locale, "en">, LocaleDictionary> = {
  de: {
    title: "Twitter-Shadowban-Test 2026 | Kostenlos & Sofort",
    description:
      "Teste kostenlos, ob dein Twitter-Konto von Suchsperren, Ghost-Bans oder ausgeblendeten Antworten betroffen ist. Ohne Login.",
    h1: "Twitter-Shadowban-Test",
    subtitle:
      "Prüfe ein öffentliches Profil kostenlos. Der aktuelle Check sucht Kontoinformationen und kann eine Shadowban-Entscheidung nicht bestätigen.",
    faqTitle: "Häufige Fragen",
    keywords: ["Shadowban-Test", "Shadowban Checker", "X Shadowban prüfen", "Twitter Profil prüfen"],
    faqs: [
      {
        question: "Was bedeutet Shadowban?",
        answer:
          "Shadowban ist ein allgemeiner Begriff für eine mögliche Einschränkung der Sichtbarkeit. Plattformen verwenden unterschiedliche Systeme; ein Rückgang der Reichweite allein beweist keine Einschränkung.",
      },
      {
        question: "Was prüft dieser Shadowban-Test?",
        answer:
          "Der derzeit verfügbare Check fragt grundlegende öffentliche Profilinformationen für X/Twitter ab. Er führt keinen vollständigen Such-, Hashtag- oder Empfehlungstest durch.",
      },
      {
        question: "Funktioniert der Checker für Instagram oder TikTok?",
        answer:
          "Nein. Die Live-Prüfung unterstützt derzeit nur öffentliche X/Twitter-Profile. Instagram-, TikTok- und YouTube-Prüfungen sind hier noch nicht verfügbar.",
      },
      {
        question: "Muss ich mich anmelden oder mein Passwort eingeben?",
        answer:
          "Nein. Für die Profilabfrage ist keine Anmeldung und kein Passwort erforderlich. Gib nur einen öffentlichen X/Twitter-Benutzernamen ein, wenn du die Prüfung starten möchtest.",
      },
      {
        question: "Kann das Ergebnis einen Shadowban sicher bestätigen?",
        answer:
          "Nein. Öffentliche Profilinformationen zeigen nicht die internen Moderations- oder Empfehlungssysteme einer Plattform. Nutze das Ergebnis nur als begrenzten Hinweis und prüfe Kontostatusmeldungen direkt bei X.",
      },
    ],
  },
  id: {
    title: "Tes Shadowban Twitter 2026 | Gratis & Instan",
    description:
      "Cek gratis apakah akun Twitter Anda terkena pembatasan pencarian, ghost ban, atau deboosting balasan. Tanpa login.",
    h1: "Tes Shadowban Twitter",
    subtitle:
      "Periksa profil publik secara gratis. Pemeriksaan saat ini mencari informasi akun dan tidak dapat memastikan keputusan shadowban.",
    faqTitle: "Pertanyaan umum",
    keywords: ["cek shadowban", "tes shadowban Twitter", "cek profil X", "shadowban checker"],
    faqs: [
      {
        question: "Apa arti shadowban?",
        answer:
          "Shadowban adalah istilah umum untuk kemungkinan pembatasan visibilitas. Setiap platform memakai sistem yang berbeda; penurunan jangkauan saja tidak membuktikan adanya pembatasan.",
      },
      {
        question: "Apa yang diperiksa oleh alat ini?",
        answer:
          "Pemeriksaan yang tersedia saat ini mengambil informasi dasar profil publik X/Twitter. Alat ini belum menjalankan pemeriksaan lengkap untuk pencarian, hashtag, atau rekomendasi.",
      },
      {
        question: "Apakah alat ini memeriksa Instagram atau TikTok?",
        answer:
          "Belum. Pemeriksaan langsung saat ini hanya mendukung profil publik X/Twitter. Pemeriksaan Instagram, TikTok, dan YouTube belum tersedia di situs ini.",
      },
      {
        question: "Apakah saya perlu login atau memasukkan kata sandi?",
        answer:
          "Tidak. Anda tidak perlu login atau memberikan kata sandi. Masukkan nama pengguna X/Twitter publik hanya jika ingin menjalankan pemeriksaan.",
      },
      {
        question: "Bisakah hasilnya memastikan shadowban?",
        answer:
          "Tidak. Informasi profil publik tidak memperlihatkan sistem moderasi atau rekomendasi internal platform. Gunakan hasil hanya sebagai petunjuk terbatas dan periksa notifikasi status akun langsung di X.",
      },
    ],
  },
  pt: {
    title: "Teste de Shadowban no X/Twitter | ShadowbanChecker",
    description:
      "Consulte gratuitamente um perfil público do X/Twitter sem login e veja com clareza os limites da verificação.",
    h1: "Sua conta do X/Twitter está com shadowban?",
    subtitle:
      "Consulte um perfil público gratuitamente. A verificação atual busca dados da conta e não confirma uma decisão de shadowban.",
    faqTitle: "Perguntas frequentes",
    keywords: ["teste de shadowban", "verificar shadowban Twitter", "teste de conta X", "shadowban checker"],
    faqs: [
      {
        question: "O que significa shadowban?",
        answer:
          "Shadowban é um termo geral para uma possível limitação de visibilidade. Cada plataforma usa sistemas próprios; uma queda no alcance, por si só, não comprova uma restrição.",
      },
      {
        question: "O que este teste verifica?",
        answer:
          "A verificação disponível atualmente consulta informações básicas de perfis públicos do X/Twitter. Ela não faz uma análise completa de busca, hashtags ou recomendações.",
      },
      {
        question: "O verificador funciona para Instagram ou TikTok?",
        answer:
          "Ainda não. A verificação ao vivo aceita apenas perfis públicos do X/Twitter. As verificações de Instagram, TikTok e YouTube ainda não estão disponíveis neste site.",
      },
      {
        question: "Preciso entrar na conta ou informar minha senha?",
        answer:
          "Não. Não é necessário fazer login nem fornecer uma senha. Informe um nome de usuário público do X/Twitter somente se quiser iniciar a consulta.",
      },
      {
        question: "O resultado confirma um shadowban?",
        answer:
          "Não. Dados públicos de perfil não revelam os sistemas internos de moderação ou recomendação da plataforma. Considere o resultado apenas um indício limitado e confira o status da conta diretamente no X.",
      },
    ],
  },
  es: {
    title: "Comprobar Shadowban en X/Twitter | ShadowbanChecker",
    description:
      "Consulta gratis un perfil público de X/Twitter sin iniciar sesión y conoce claramente los límites de la comprobación.",
    h1: "¿Tu cuenta de X/Twitter tiene shadowban?",
    subtitle:
      "Consulta un perfil público gratis. La comprobación actual busca información de la cuenta y no puede confirmar una decisión de shadowban.",
    faqTitle: "Preguntas frecuentes",
    keywords: ["comprobar shadowban", "test shadowban Twitter", "revisar cuenta X", "shadowban checker"],
    faqs: [
      {
        question: "¿Qué significa shadowban?",
        answer:
          "Shadowban es un término general para una posible limitación de visibilidad. Cada plataforma usa sistemas distintos; una caída del alcance por sí sola no demuestra que exista una restricción.",
      },
      {
        question: "¿Qué comprueba esta herramienta?",
        answer:
          "La comprobación disponible actualmente consulta información básica de perfiles públicos de X/Twitter. No realiza una auditoría completa de búsquedas, hashtags o recomendaciones.",
      },
      {
        question: "¿Funciona con Instagram o TikTok?",
        answer:
          "Todavía no. La comprobación en directo solo admite perfiles públicos de X/Twitter. Las revisiones de Instagram, TikTok y YouTube aún no están disponibles en este sitio.",
      },
      {
        question: "¿Tengo que iniciar sesión o compartir mi contraseña?",
        answer:
          "No. No hace falta iniciar sesión ni compartir una contraseña. Introduce un nombre de usuario público de X/Twitter solo si quieres realizar la consulta.",
      },
      {
        question: "¿El resultado confirma un shadowban?",
        answer:
          "No. La información pública del perfil no muestra los sistemas internos de moderación o recomendación. Usa el resultado solo como una señal limitada y consulta el estado de la cuenta directamente en X.",
      },
    ],
  },
  it: {
    title: "Test Shadowban su X/Twitter | ShadowbanChecker",
    description:
      "Controlla gratuitamente un profilo pubblico X/Twitter senza accedere e scopri con chiarezza i limiti della verifica.",
    h1: "Il tuo account X/Twitter è in shadowban?",
    subtitle:
      "Controlla gratuitamente un profilo pubblico. Il controllo attuale cerca informazioni dell’account e non può confermare una decisione di shadowban.",
    faqTitle: "Domande frequenti",
    keywords: ["test shadowban", "controllare shadowban Twitter", "verifica account X", "shadowban checker"],
    faqs: [
      {
        question: "Che cosa significa shadowban?",
        answer:
          "Shadowban è un termine generico per una possibile limitazione della visibilità. Ogni piattaforma usa sistemi diversi; un calo della copertura, da solo, non dimostra una restrizione.",
      },
      {
        question: "Che cosa controlla questo strumento?",
        answer:
          "Il controllo attualmente disponibile consulta informazioni di base dei profili pubblici X/Twitter. Non esegue un’analisi completa di ricerca, hashtag o consigliati.",
      },
      {
        question: "Il checker funziona con Instagram o TikTok?",
        answer:
          "Non ancora. Il controllo attivo supporta solo profili pubblici X/Twitter. Le verifiche per Instagram, TikTok e YouTube non sono ancora disponibili su questo sito.",
      },
      {
        question: "Devo accedere o inserire la password?",
        answer:
          "No. Non serve effettuare l’accesso né fornire una password. Inserisci un nome utente pubblico X/Twitter solo se vuoi avviare la ricerca.",
      },
      {
        question: "Il risultato conferma uno shadowban?",
        answer:
          "No. Le informazioni pubbliche del profilo non mostrano i sistemi interni di moderazione o raccomandazione. Considera il risultato un indizio limitato e controlla lo stato dell’account direttamente su X.",
      },
    ],
  },
  th: {
    title: "ตรวจสอบ Shadowban บน X/Twitter | ShadowbanChecker",
    description:
      "ตรวจสอบโปรไฟล์สาธารณะบน X/Twitter ด้วย ShadowbannChecker ฟรี ไม่ต้องเข้าสู่ระบบ พร้อมอธิบายข้อจำกัดของการตรวจสอบอย่างชัดเจน",
    h1: "บัญชี X/Twitter ของคุณติด Shadowban หรือไม่?",
    subtitle:
      "ตรวจสอบโปรไฟล์สาธารณะได้ฟรี การตรวจสอบปัจจุบันค้นหาข้อมูลบัญชีและไม่สามารถยืนยันการตัดสินเรื่อง Shadowban ได้",
    faqTitle: "คำถามที่พบบ่อย",
    keywords: ["ตรวจสอบ shadowban", "ทดสอบ shadowban Twitter", "ตรวจบัญชี X", "shadowban checker"],
    faqs: [
      {
        question: "Shadowban หมายถึงอะไร?",
        answer:
          "Shadowban เป็นคำทั่วไปที่ใช้เรียกความเป็นไปได้ที่การมองเห็นจะถูกจำกัด แต่ละแพลตฟอร์มมีระบบต่างกัน ยอดเข้าถึงที่ลดลงเพียงอย่างเดียวไม่ได้ยืนยันว่ามีการจำกัด",
      },
      {
        question: "เครื่องมือนี้ตรวจสอบอะไรบ้าง?",
        answer:
          "การตรวจสอบที่เปิดให้ใช้ในขณะนี้จะค้นหาข้อมูลพื้นฐานของโปรไฟล์สาธารณะบน X/Twitter และยังไม่ได้ตรวจสอบผลการค้นหา แฮชแท็ก หรือคำแนะนำอย่างครบถ้วน",
      },
      {
        question: "ตรวจสอบ Instagram หรือ TikTok ได้หรือไม่?",
        answer:
          "ยังไม่ได้ การตรวจสอบที่ใช้งานได้ในขณะนี้รองรับเฉพาะโปรไฟล์สาธารณะบน X/Twitter การตรวจ Instagram, TikTok และ YouTube ยังไม่เปิดให้บริการบนเว็บไซต์นี้",
      },
      {
        question: "ต้องเข้าสู่ระบบหรือให้รหัสผ่านหรือไม่?",
        answer:
          "ไม่จำเป็นต้องเข้าสู่ระบบหรือแจ้งรหัสผ่าน ใส่ชื่อผู้ใช้สาธารณะบน X/Twitter เฉพาะเมื่อคุณต้องการเริ่มตรวจสอบเท่านั้น",
      },
      {
        question: "ผลการตรวจยืนยัน Shadowban ได้หรือไม่?",
        answer:
          "ไม่ได้ ข้อมูลโปรไฟล์สาธารณะไม่สามารถแสดงระบบกลั่นกรองหรือแนะนำเนื้อหาภายในแพลตฟอร์มได้ ใช้ผลนี้เป็นเพียงข้อมูลเบื้องต้น และตรวจสอบสถานะบัญชีโดยตรงกับ X",
      },
    ],
  },
};
import type { AppLocale } from "@/i18n/routing";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const COPY = {
  en: {
    title: "Privacy Policy | Reddy Dental",
    description:
      "How Reddy Dental collects information, which analytics tools run after you accept, and how appointment form data is handled.",
    footer: "Privacy Policy »",
    formNote:
      "We use this information only to respond to your appointment request. See our <a href=\"/privacy/\">Privacy Policy</a>.",
    main: `
      <div class="bg-tertiary px-sm py-md flex justify-center">
        <article class="privacy-copy max-w-content w-full font-body font-[300] normal-case text-[16px] text-tertiary">
          <h1 class="font-title font-[400] text-[32px] mb-4">Privacy Policy</h1>
          <p>Reddy Dental, 6751 1st Ave S, St. Petersburg, FL 33707, uses this website to share practice information and to receive appointment and callback requests. This page explains what the site collects, which tools run, and how form information is handled.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Information you send us</h2>
          <p>The appointment form collects your name, whether you are a new or existing patient, phone number, preferred day and time, last dental visit when you are a new patient, how you heard about the practice, email address, preferred contact method, and any note you choose to add.</p>
          <p>The callback form collects your name, phone number, an optional summary of what you need, and the page address where you submitted the form so the office knows which page the request came from.</p>
          <p>That information is sent to the practice through its form handler so the office can contact you about dental care. It is not sold. It is not used to turn on advertising cookies.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Cookies and tracking tools</h2>
          <p>Essential cookies stay on so the site can remember your language choice and whether you accepted or declined tracking. Analytics and advertising tools stay off until you click Accept. If you decline or leave the banner without choosing, those tools do not run.</p>
          <p>After you accept, the site may use:</p>
          <ul>
            <li>Google Analytics, to understand which pages are visited.</li>
            <li>Google Ads, including call tracking on phone links.</li>
            <li>Google Tag Manager on the advertising landing pages.</li>
            <li>Meta Pixel, to measure visits and phone clicks.</li>
          </ul>
          <p>You can change your mind later by clearing the site’s cookies in your browser. The banner will appear again, and tracking stays off until you accept.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Contact</h2>
          <p>Questions about this policy can be sent to the office at <a href="tel:727-377-3339">727-377-3339</a> or at 6751 1st Ave S, St. Petersburg, FL 33707.</p>
        </article>
      </div>`,
  },
  es: {
    title: "Política de privacidad | Reddy Dental",
    description:
      "Qué información recopila Reddy Dental, qué herramientas se usan después de aceptar y cómo se tratan los datos del formulario.",
    footer: "Política de privacidad »",
    formNote:
      "Usamos esta información solo para responder a su solicitud de cita. Consulte nuestra <a href=\"/privacy/\">Política de privacidad</a>.",
    main: `
      <div class="bg-tertiary px-sm py-md flex justify-center">
        <article class="privacy-copy max-w-content w-full font-body font-[300] normal-case text-[16px] text-tertiary">
          <h1 class="font-title font-[400] text-[32px] mb-4">Política de privacidad</h1>
          <p>Reddy Dental, 6751 1st Ave S, St. Petersburg, FL 33707, usa este sitio para compartir información del consultorio y recibir solicitudes de cita y de llamada. Esta página explica qué recopila el sitio, qué herramientas se usan y cómo se trata la información de los formularios.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Información que usted envía</h2>
          <p>El formulario de cita recopila su nombre, si es paciente nuevo o existente, número de teléfono, día y hora preferidos, última visita dental si es paciente nuevo, cómo conoció el consultorio, correo electrónico, método de contacto preferido y cualquier nota que decida agregar.</p>
          <p>El formulario de llamada recopila su nombre, número de teléfono, un resumen opcional de lo que necesita y la dirección de la página desde la que envió la solicitud, para que el consultorio sepa de qué página proviene.</p>
          <p>Esa información se envía al consultorio mediante su sistema de formularios para que puedan comunicarse con usted sobre su atención dental. No se vende. No se usa para activar cookies de publicidad.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Cookies y herramientas de seguimiento</h2>
          <p>Las cookies esenciales permanecen activas para recordar su idioma y si aceptó o rechazó el seguimiento. Las herramientas de analítica y publicidad permanecen desactivadas hasta que pulse Aceptar. Si las rechaza o deja el aviso sin elegir, esas herramientas no se ejecutan.</p>
          <p>Después de aceptar, el sitio puede usar:</p>
          <ul>
            <li>Google Analytics, para entender qué páginas se visitan.</li>
            <li>Google Ads, incluido el seguimiento de llamadas en los enlaces telefónicos.</li>
            <li>Google Tag Manager en las páginas de anuncios.</li>
            <li>Meta Pixel, para medir visitas y clics en el teléfono.</li>
          </ul>
          <p>Puede cambiar de opinión más adelante borrando las cookies de este sitio en su navegador. El aviso volverá a aparecer y el seguimiento permanecerá desactivado hasta que acepte.</p>
          <h2 class="font-title font-[400] text-[22px] mt-8 mb-2">Contacto</h2>
          <p>Las preguntas sobre esta política pueden enviarse al consultorio al <a href="tel:727-377-3339">727-377-3339</a> o a 6751 1st Ave S, St. Petersburg, FL 33707.</p>
        </article>
      </div>`,
  },
} as const;

function absolutizeRootUrls(html: string): string {
  return html
    .replace(
      /(\b(?:href|src)\s*=\s*)(["'])(?!(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#|data:))([^"']*)\2/gi,
      (_match, prefix: string, quote: string, url: string) =>
        `${prefix}${quote}/${url.replace(/^\.\//, "")}${quote}`,
    )
    .replace(
      /url\((['"]?)(?!(?:[a-z][a-z0-9+.-]*:|\/\/|\/|#|data:))([^)'"]+)\1\)/gi,
      (_match, quote: string, url: string) =>
        `url(${quote}/${url.replace(/^\.\//, "")}${quote})`,
    );
}

export function buildPrivacyDocument(homeHtml: string, locale: AppLocale): string {
  const copy = locale === "es" ? COPY.es : COPY.en;
  const navEnd = homeHtml.indexOf("</nav>");
  const mainEnd = homeHtml.indexOf("</main>");
  let html = homeHtml;
  if (navEnd !== -1 && mainEnd > navEnd) {
    html = `${homeHtml.slice(0, navEnd + "</nav>".length)}\n${copy.main}\n${homeHtml.slice(mainEnd)}`;
  }
  html = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(copy.title)}</title>`)
    .replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']/i,
      `<meta name="description" content="${escapeHtml(copy.description)}"`,
    );
  return absolutizeRootUrls(html);
}

export function injectPrivacyLinks(html: string, locale: AppLocale): string {
  const copy = locale === "es" ? COPY.es : COPY.en;
  let next = html;
  if (!next.includes('href="/privacy/"')) {
    next = next.replace(
      /(<a\b[^>]*href=["']\/patient-resources\/["'][^>]*>\s*Online Payment[^<]*<\/a>)/i,
      `$1\n              <a href="/privacy/" target="_self" class="block min-h-6 text-light mb-1 hover:text-primaryHover font-menuItems font-[300] capitalize text-[16px]">${copy.footer}</a>`,
    );
  }
  if (next.includes('id="requestAppointment"') && !next.includes("data-rd-form-privacy")) {
    next = next.replace(
      /(<form\b[^>]*id=["']requestAppointment["'][\s\S]*?)(\s*<\/form>)/i,
      `$1\n            <p class="font-body font-[300] normal-case text-[16px] text-tertiary sm:col-span-2" data-rd-form-privacy>${copy.formNote}</p>$2`,
    );
  }
  return next;
}

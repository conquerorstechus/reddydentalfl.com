import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_ADS_WEBSITE_CALL_LABEL,
  META_PIXEL_ID,
} from "@/lib/analytics";

export const TRACKING_CONSENT_COOKIE = "rd_tracking_consent";

declare global {
  interface Window {
    __rdTrackingConsent?: "accepted" | "declined" | "";
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const BANNER_CSS = `
.rd-consent {
  position: fixed;
  z-index: 100000;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  box-sizing: border-box;
  padding: 16px 20px;
  background: #231f20;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  line-height: 1.45;
  box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.22);
}
.rd-consent p { margin: 0; max-width: 760px; }
.rd-consent a { color: #d9b748; }
.rd-consent-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.rd-consent button {
  border-radius: 4px;
  padding: 10px 16px;
  font: inherit;
  cursor: pointer;
}
.rd-consent-accept { background: #d9b748; color: #231f20; border: 0; font-weight: 700; }
.rd-consent-decline { background: transparent; color: #fff; border: 1px solid #fff; }
@media (max-width: 640px) {
  .rd-consent { flex-direction: column; align-items: stretch; padding-bottom: 20px; }
  .rd-consent-actions { width: 100%; }
  .rd-consent button { flex: 1 1 140px; }
}
`;

export function getTrackingConsentSource(loadStaticTracking: boolean): string {
  return `
(function () {
  var COOKIE = ${JSON.stringify(TRACKING_CONSENT_COOKIE)};
  var LOAD_STATIC = ${loadStaticTracking ? "true" : "false"};
  var GA_ID = ${JSON.stringify(GA_MEASUREMENT_ID)};
  var ADS_ID = ${JSON.stringify(GOOGLE_ADS_TAG_ID)};
  var ADS_LABEL = ${JSON.stringify(GOOGLE_ADS_WEBSITE_CALL_LABEL)};
  var PIXEL_ID = ${JSON.stringify(META_PIXEL_ID)};
  var spanish = (document.documentElement.lang || "").toLowerCase().indexOf("es") === 0;
  var copy = spanish ? {
    text: "Usamos cookies de analítica y publicidad solo si usted lo acepta. Si las rechaza o no elige, ese seguimiento permanece desactivado.",
    privacy: "Política de privacidad",
    accept: "Aceptar",
    decline: "Rechazar"
  } : {
    text: "We use analytics and advertising cookies only if you accept. If you decline or ignore this, that tracking stays off.",
    privacy: "Privacy Policy",
    accept: "Accept",
    decline: "Decline"
  };

  function readChoice() {
    var match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"));
    var value = match ? decodeURIComponent(match[1]) : "";
    return value === "accepted" || value === "declined" ? value : "";
  }

  function writeChoice(choice) {
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = COOKIE + "=" + choice + "; Path=/; Max-Age=31536000; SameSite=Lax" + secure;
  }

  function loadStaticTracking() {
    if (window.__rdTrackingLoaded) return;
    window.__rdTrackingLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(ga);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: true });
    window.gtag("config", ADS_ID);
    window.gtag("config", ADS_LABEL, {
      phone_conversion_number: "727-377-3339",
      phone_conversion_callback: function (formattedNumber, mobileNumber) {
        document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
          link.setAttribute("href", "tel:" + mobileNumber);
          var label = (link.textContent || "").trim();
          if (/^\\+?[\\d\\s().-]+$/.test(label) && label.replace(/\\D/g, "").length >= 10) {
            link.textContent = formattedNumber;
          }
        });
      }
    });
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      var link = target.closest('a[href^="tel:"]');
      if (!link) return;
      window.gtag("event", "click_to_call", {
        phone_number: "727-377-3339",
        link_url: link.href,
        page_location: window.location.href
      });
    }, true);

    if (window.fbq) return;
    var fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    var pixel = document.createElement("script");
    pixel.async = true;
    pixel.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(pixel);
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!target || typeof target.closest !== "function") return;
      if (!target.closest('a[href^="tel:"]')) return;
      fbq("track", "Contact");
    }, true);
  }

  function removeBanner() {
    var banner = document.querySelector("[data-rd-consent]");
    if (banner) banner.remove();
    document.body.style.paddingBottom = "";
  }

  function applyChoice(choice, persist) {
    if (persist) writeChoice(choice);
    window.__rdTrackingConsent = choice;
    document.dispatchEvent(new CustomEvent("rd-tracking-consent", { detail: choice }));
    if (choice === "accepted" && LOAD_STATIC) loadStaticTracking();
    removeBanner();
  }

  function showBanner() {
    if (document.querySelector("[data-rd-consent]")) return;
    var style = document.createElement("style");
    style.textContent = ${JSON.stringify(BANNER_CSS)};
    document.head.appendChild(style);
    var banner = document.createElement("div");
    banner.className = "rd-consent";
    banner.setAttribute("data-rd-consent", "");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", copy.privacy);
    var text = document.createElement("p");
    text.textContent = copy.text + " ";
    var privacy = document.createElement("a");
    privacy.href = "/privacy/";
    privacy.textContent = copy.privacy;
    text.appendChild(privacy);
    var actions = document.createElement("div");
    actions.className = "rd-consent-actions";
    var accept = document.createElement("button");
    accept.type = "button";
    accept.className = "rd-consent-accept";
    accept.textContent = copy.accept;
    var decline = document.createElement("button");
    decline.type = "button";
    decline.className = "rd-consent-decline";
    decline.textContent = copy.decline;
    accept.addEventListener("click", function () { applyChoice("accepted", true); });
    decline.addEventListener("click", function () { applyChoice("declined", true); });
    actions.appendChild(accept);
    actions.appendChild(decline);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    document.body.style.paddingBottom = banner.offsetHeight + "px";
  }

  var current = readChoice();
  if (current === "accepted" || current === "declined") applyChoice(current, false);
  else showBanner();
})();
`;
}

export function getTrackingConsentHtml(loadStaticTracking: boolean): string {
  return `<script data-rd-tracking-consent>${getTrackingConsentSource(loadStaticTracking)}</script>`;
}

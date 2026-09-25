export type Language = "en" | "es";

export const LANGUAGE_STORAGE_KEY = "reddy-lang";

export type CallUsTranslations = {
  languageToggleLabel: string;
  callNow: string;
  callAriaLabel: string;
  brandHomeAriaLabel: string;
  brandLogoAlt: string;
  heroHeading: string;
  heroSubtitle: string;
  heroDescription: string;
  heroNote: string;
  heroImageAlt: string;
  googleTrustAriaLabel: string;
  googleTrustBadgeLabel: string;
  googleTrustRatingAriaLabel: string;
  googleTrustReviewCount: string;
  formSectionAriaLabel: string;
  formNameLabel: string;
  formPhoneLabel: string;
  formSummaryLabel: string;
  formSummaryOptional: string;
  formSummaryPlaceholder: string;
  formPhoneTitle: string;
  formSubmitLoading: string;
  formSubmitIdle: string;
  formPrivacyNote: string;
  formError: string;
  reviewsEyebrow: string;
  reviewsHeading: string;
  reviewsGoogleLink: string;
  reviewStarsAriaLabel: string;
  servicesEyebrow: string;
  servicesHeading: string;
  services: string[];
  bookAppointment: string;
  valuesHeadingLead: string;
  valuesHeadingLocation: string;
  valuesHeadingTagline: string;
  valuesImageAlt: string;
  valuesItems: { title: string; body: string }[];
  aboutHeading: string;
  aboutEyebrow: string;
  doctorCredential: string;
  doctorBio: string;
  insuranceEyebrow: string;
  insuranceHeading: string;
  insuranceIntro: string;
  insuranceImageAlt: string;
  offer99Description: string;
  offer59Description: string;
  finalEyebrow: string;
  finalHeading: string;
  finalDescription: string;
  requestCallbackInstead: string;
  footerLocationLabel: string;
  footerOfficeHours: string;
  officeHours: { day: string; hours: string }[];
  thankYouKicker: string;
  thankYouTitle: string;
  thankYouReceived: string;
  thankYouFollowUp: string;
  thankYouBackToOffers: string;
  thankYouBackToHome: string;
};

export const translations: Record<Language, CallUsTranslations> = {
  en: {
    languageToggleLabel: "🇪🇸 Español",
    callNow: "Call now",
    callAriaLabel: "Call Reddy Dental at 727-377-3339",
    brandHomeAriaLabel: "Reddy Dental home",
    brandLogoAlt: "Reddy Dental — General & Implant Dentistry",
    heroHeading: "Need a Dentist in St.\u00a0Petersburg, FL?",
    heroSubtitle: "Personalized Dental Care for New & Existing Patients",
    heroDescription:
      "Preventive, restorative, cosmetic, implant and emergency dental care in a comfortable, patient-focused environment.",
    heroNote: "New Patients Welcome | St. Petersburg, FL",
    heroImageAlt: "Modern dental operatory at Reddy Dental in St. Petersburg, FL",
    googleTrustAriaLabel: "Google reviews for Reddy Dental",
    googleTrustBadgeLabel: "5-Star Google Review",
    googleTrustRatingAriaLabel: "5.0 out of 5 stars based on 61 Google reviews",
    googleTrustReviewCount: "61 reviews",
    formSectionAriaLabel: "Request a callback",
    formNameLabel: "Name",
    formPhoneLabel: "Phone number",
    formSummaryLabel: "Summary",
    formSummaryOptional: "(optional)",
    formSummaryPlaceholder: "Tell us briefly what you need help with",
    formPhoneTitle: "Enter a 10-digit phone number",
    formSubmitLoading: "Sending...",
    formSubmitIdle: "Request my callback",
    formPrivacyNote: "Your information is used only to contact you about dental care.",
    formError: "We could not send your request. Please call (727) 377-3339.",
    reviewsEyebrow: "Patient reviews",
    reviewsHeading: "What patients are saying",
    reviewsGoogleLink: "Read more on Google",
    reviewStarsAriaLabel: "5 out of 5 stars",
    servicesEyebrow: "Our services",
    servicesHeading: "Comprehensive care for every smile",
    services: [
      "Preventive Dentistry",
      "Restorative Dentistry",
      "Cosmetic Dentistry",
      "Implant Dentistry",
      "Emergency Dental Care",
    ],
    bookAppointment: "Book an Appointment",
    valuesHeadingLead: "Trusted, Personalized Dentistry",
    valuesHeadingLocation: "in St. Petersburg, FL—",
    valuesHeadingTagline: "Where Comfort and Integrity Come First",
    valuesImageAlt: "Dr. Anish Reddy consulting with a patient at Reddy Dental",
    valuesItems: [
      {
        title: "1. Integrity Without Pressure:",
        body:
          "At Reddy Dental, trust comes first. Every recommendation is honest, unrushed, and never sales-driven. Dr. Reddy treats patients the way he'd treat his own family—only necessary care, guided by comfort, health, and long-term well-being.",
      },
      {
        title: "2. Calm, Elevated Experience:",
        body:
          "Reddy Dental is designed to feel different. A warm, modern space and unhurried care create a calm, welcoming environment that eases anxiety. Every detail is intentional—so you feel relaxed, comfortable, and cared for from the moment you arrive.",
      },
      {
        title: "3. Clarity That Builds Confidence:",
        body:
          "Great care starts with understanding. Dr. Reddy clearly explains the why behind each recommendation, with transparent clinical and financial details. Patients feel informed, empowered, and confident—never rushed or confused.",
      },
      {
        title: "4. Precision, Personalized to You:",
        body:
          "Dr. Reddy blends advanced technology with meticulous attention to detail to deliver precise, personalized dentistry. Every treatment is thoughtfully tailored for long-lasting results—so patients know their care is done right the first time.",
      },
      {
        title: "5. Dentistry That Feels Like Home:",
        body:
          "At Reddy Dental, patients are treated like family. You're greeted by name, truly listened to, and cared for with intention. Our team builds genuine relationships in a welcoming space where patients feel comfortable, known, and valued—every visit.",
      },
    ],
    aboutHeading: "About Us",
    aboutEyebrow: "Trust is built first. Smiles follow.",
    doctorCredential: "University of Florida graduate",
    doctorBio:
      "Dr. Sajan Anish Reddy, DMD, was drawn to dentistry for its unique blend of precision, problem-solving, and the ability to make an immediate, meaningful impact on a person's confidence and quality of life. He earned his Doctor of Dental Medicine degree from the University of Florida and has over five years of clinical experience, including extensive hands-on patient care during his training. Dr. Reddy is licensed to practice in Florida, Georgia, Tennessee, Alabama, South Carolina, North Carolina, Missouri, and Wisconsin, and is an active member of the American Dental Association and Florida Dental Association.",
    insuranceEyebrow: "Insurance and self-pay welcome",
    insuranceHeading: "Affordable options for patients with and without insurance.",
    insuranceIntro:
      "Coverage varies by plan. Our team will gladly help verify your benefits before treatment.",
    insuranceImageAlt: "Reddy Dental office exterior at 6751 1st Ave S, St. Petersburg, FL",
    offer99Description: "New patient exam and X-rays for patients without insurance",
    offer59Description: "Focused exam and X-ray for a specific dental concern",
    finalEyebrow: "Ready when you are",
    finalHeading: "Let's take the next step together.",
    finalDescription:
      "Call now to ask a question or request an appointment. We'll help you understand what comes next.",
    requestCallbackInstead: "Request a callback instead",
    footerLocationLabel: "Location",
    footerOfficeHours: "Office Hours",
    officeHours: [
      { day: "Monday", hours: "9:00am - 5:00pm" },
      { day: "Tuesday", hours: "9:00am - 5:00pm" },
      { day: "Wednesday", hours: "9:00am - 5:00pm" },
      { day: "Thursday", hours: "9:00am - 5:00pm" },
      { day: "Friday", hours: "9:00am - 5:00pm" },
      { day: "Saturday", hours: "9:00am - 5:00pm" },
      { day: "Sunday", hours: "9:00am - 5:00pm" },
    ],
    thankYouKicker: "Dental offers",
    thankYouTitle: "Thank You!",
    thankYouReceived: "Your request has been received successfully.",
    thankYouFollowUp: "Our team will get back to you shortly.",
    thankYouBackToOffers: "Back to offers",
    thankYouBackToHome: "Back to home",
  },
  es: {
    languageToggleLabel: "🇺🇸 English",
    callNow: "Llame ahora",
    callAriaLabel: "Llame a Reddy Dental al 727-377-3339",
    brandHomeAriaLabel: "Inicio de Reddy Dental",
    brandLogoAlt: "Reddy Dental — Odontología General e Implantes",
    heroHeading: "¿Necesita un dentista en St.\u00a0Petersburg, FL?",
    heroSubtitle: "Atención dental personalizada para pacientes nuevos y existentes",
    heroDescription:
      "Atención dental preventiva, restauradora, cosmética, de implantes y de emergencia en un entorno cómodo y centrado en el paciente.",
    heroNote: "Pacientes nuevos bienvenidos | St. Petersburg, FL",
    heroImageAlt: "Moderno consultorio dental en Reddy Dental en St. Petersburg, FL",
    googleTrustAriaLabel: "Reseñas de Google de Reddy Dental",
    googleTrustBadgeLabel: "Reseña de Google de 5 estrellas",
    googleTrustRatingAriaLabel: "5.0 de 5 estrellas basado en 61 reseñas de Google",
    googleTrustReviewCount: "61 reseñas",
    formSectionAriaLabel: "Solicitar una llamada",
    formNameLabel: "Nombre",
    formPhoneLabel: "Número de teléfono",
    formSummaryLabel: "Resumen",
    formSummaryOptional: "(opcional)",
    formSummaryPlaceholder: "Cuéntenos brevemente en qué necesita ayuda",
    formPhoneTitle: "Ingrese un número de teléfono de 10 dígitos",
    formSubmitLoading: "Enviando...",
    formSubmitIdle: "Solicitar mi llamada",
    formPrivacyNote:
      "Su información se utiliza únicamente para contactarle sobre su atención dental.",
    formError: "No pudimos enviar su solicitud. Por favor llame al (727) 377-3339.",
    reviewsEyebrow: "Reseñas de pacientes",
    reviewsHeading: "Lo que dicen los pacientes",
    reviewsGoogleLink: "Leer más en Google",
    reviewStarsAriaLabel: "5 de 5 estrellas",
    servicesEyebrow: "Nuestros servicios",
    servicesHeading: "Atención integral para cada sonrisa",
    services: [
      "Odontología preventiva",
      "Odontología restauradora",
      "Odontología cosmética",
      "Odontología de implantes",
      "Atención dental de emergencia",
    ],
    bookAppointment: "Reservar una cita",
    valuesHeadingLead: "Odontología de confianza y personalizada",
    valuesHeadingLocation: "en St. Petersburg, FL—",
    valuesHeadingTagline: "Donde la comodidad y la integridad son lo primero",
    valuesImageAlt: "El Dr. Anish Reddy consultando con un paciente en Reddy Dental",
    valuesItems: [
      {
        title: "1. Integridad sin presión:",
        body:
          "En Reddy Dental, la confianza es lo primero. Cada recomendación es honesta, sin prisas y nunca orientada a la venta. El Dr. Reddy trata a los pacientes como trataría a su propia familia: solo la atención necesaria, guiada por la comodidad, la salud y el bienestar a largo plazo.",
      },
      {
        title: "2. Una experiencia tranquila y elevada:",
        body:
          "Reddy Dental está diseñado para sentirse diferente. Un espacio cálido y moderno, junto con una atención sin prisas, crea un entorno acogedor que reduce la ansiedad. Cada detalle es intencional para que se sienta relajado, cómodo y bien atendido desde el momento en que llega.",
      },
      {
        title: "3. Claridad que genera confianza:",
        body:
          "Una gran atención comienza con la comprensión. El Dr. Reddy explica claramente el porqué de cada recomendación, con detalles clínicos y financieros transparentes. Los pacientes se sienten informados, seguros y con confianza, nunca presionados ni confundidos.",
      },
      {
        title: "4. Precisión, personalizada para usted:",
        body:
          "El Dr. Reddy combina tecnología avanzada con una atención meticulosa al detalle para ofrecer odontología precisa y personalizada. Cada tratamiento se adapta cuidadosamente para lograr resultados duraderos, para que los pacientes sepan que su atención se hace bien desde la primera vez.",
      },
      {
        title: "5. Odontología que se siente como en casa:",
        body:
          "En Reddy Dental, los pacientes son tratados como familia. Se le recibe por su nombre, se le escucha de verdad y se le atiende con intención. Nuestro equipo construye relaciones genuinas en un espacio acogedor donde los pacientes se sienten cómodos, conocidos y valorados en cada visita.",
      },
    ],
    aboutHeading: "Sobre nosotros",
    aboutEyebrow: "La confianza se construye primero. Las sonrisas siguen.",
    doctorCredential: "Graduado de la Universidad de Florida",
    doctorBio:
      "Al Dr. Sajan Anish Reddy, DMD, le atrajo la odontología por su combinación única de precisión, resolución de problemas y la capacidad de generar un impacto inmediato y significativo en la confianza y calidad de vida de una persona. Obtuvo su título de Doctor en Medicina Dental de la Universidad de Florida y cuenta con más de cinco años de experiencia clínica, incluida una amplia atención práctica al paciente durante su formación. El Dr. Reddy tiene licencia para ejercer en Florida, Georgia, Tennessee, Alabama, Carolina del Sur, Carolina del Norte, Missouri y Wisconsin, y es miembro activo de la Asociación Dental Americana y la Asociación Dental de Florida.",
    insuranceEyebrow: "Seguros y pago propio bienvenidos",
    insuranceHeading: "Opciones asequibles para pacientes con y sin seguro.",
    insuranceIntro:
      "La cobertura varía según el plan. Nuestro equipo con gusto le ayudará a verificar sus beneficios antes del tratamiento.",
    insuranceImageAlt: "Exterior de la oficina de Reddy Dental en 6751 1st Ave S, St. Petersburg, FL",
    offer99Description:
      "Examen para pacientes nuevos y radiografías para pacientes sin seguro",
    offer59Description:
      "Examen enfocado y radiografía para una preocupación dental específica",
    finalEyebrow: "Listos cuando usted lo esté",
    finalHeading: "Demos juntos el siguiente paso.",
    finalDescription:
      "Llame ahora para hacer una pregunta o solicitar una cita. Le ayudaremos a entender los próximos pasos.",
    requestCallbackInstead: "Solicitar una llamada en su lugar",
    footerLocationLabel: "Ubicación",
    footerOfficeHours: "Horario de atención",
    officeHours: [
      { day: "Lunes", hours: "9:00am - 5:00pm" },
      { day: "Martes", hours: "9:00am - 5:00pm" },
      { day: "Miércoles", hours: "9:00am - 5:00pm" },
      { day: "Jueves", hours: "9:00am - 5:00pm" },
      { day: "Viernes", hours: "9:00am - 5:00pm" },
      { day: "Sábado", hours: "9:00am - 5:00pm" },
      { day: "Domingo", hours: "9:00am - 5:00pm" },
    ],
    thankYouKicker: "Ofertas dentales",
    thankYouTitle: "¡Gracias!",
    thankYouReceived: "Su solicitud se ha recibido correctamente.",
    thankYouFollowUp: "Nuestro equipo se pondrá en contacto con usted en breve.",
    thankYouBackToOffers: "Volver a ofertas",
    thankYouBackToHome: "Volver al inicio",
  },
};

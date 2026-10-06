import type { Language } from "@/i18n/translations";

export interface Treatment {
  name: Record<Language, string>;
  duration: Record<Language, string>;
  price: string;
  description: Record<Language, string>;
  image: string;
}

export const featuredTreatments: Treatment[] = [
  {
    name: { en: "Express Facial", es: "Facial Express" },
    duration: { en: "50 mins", es: "50 min" },
    price: "$85",
    description: {
      en: "The perfect introduction to professional skincare.",
      es: "La introducción perfecta al cuidado profesional de la piel.",
    },
    image:
      "https://images.pexels.com/photos/37229304/pexels-photo-37229304.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "Deluxe Facial", es: "Facial Deluxe" },
    duration: { en: "2 hrs", es: "2 h" },
    price: "$160",
    description: {
      en: "Indulge in our luxurious two-hour Deluxe Facial.",
      es: "Disfruta de nuestro lujoso Facial Deluxe de dos horas.",
    },
    image:
      "https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "Deep Cleansing Facial", es: "Facial de Limpieza Profunda" },
    duration: { en: "90 mins", es: "90 min" },
    price: "$120",
    description: {
      en: "Reveal a fresher, healthier-looking complexion.",
      es: "Revela un cutis más fresco y saludable.",
    },
    image:
      "https://images.pexels.com/photos/37240358/pexels-photo-37240358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: {
      en: "Face Lifting & Neck Microcurrent",
      es: "Lifting Facial y Microcorriente de Cuello",
    },
    duration: { en: "1 hr", es: "1 h" },
    price: "$120",
    description: {
      en: "A non-invasive treatment using microcurrent technology.",
      es: "Un tratamiento no invasivo con tecnología de microcorriente.",
    },
    image:
      "https://images.pexels.com/photos/6663564/pexels-photo-6663564.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "Gold Anti-Aging Facial", es: "Facial Antienvejecimiento de Oro" },
    duration: { en: "90 mins", es: "90 min" },
    price: "$120",
    description: {
      en: "A treatment using a 24K gold-infused mask.",
      es: "Un tratamiento con mascarilla infusionada con oro de 24K.",
    },
    image:
      "https://images.pexels.com/photos/36436447/pexels-photo-36436447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "Microcurrent & Cupping", es: "Microcorriente y Ventosas" },
    duration: { en: "1 hr", es: "1 h" },
    price: "$120",
    description: {
      en: "A therapeutic body treatment combining technologies.",
      es: "Un tratamiento corporal terapéutico que combina tecnologías.",
    },
    image:
      "https://images.pexels.com/photos/8313238/pexels-photo-8313238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "Reflexology", es: "Reflexología" },
    duration: { en: "1 hr", es: "1 h" },
    price: "$85",
    description: {
      en: "A relaxing foot therapy that applies gentle pressure.",
      es: "Una terapia de pies relajante que aplica presión suave.",
    },
    image:
      "https://images.pexels.com/photos/9146383/pexels-photo-9146383.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: { en: "LamProbe", es: "LamProbe" },
    duration: { en: "Varies", es: "Varía" },
    price: "Varies",
    description: {
      en: "Reveal smoother, healthier-looking skin with LamProbe.",
      es: "Revela una piel más suave y saludable con LamProbe.",
    },
    image:
      "https://images.pexels.com/photos/37229302/pexels-photo-37229302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];

export const waxingServices: { en: string; es: string }[] = [
  { en: "Full Face Wax", es: "Depilación de Rostro Completo" },
  { en: "Chin Wax", es: "Depilación de Mentón" },
  { en: "Eyebrow Wax", es: "Depilación de Cejas" },
  { en: "French Bikini Wax", es: "Depilación Bikini Francés" },
  { en: "Full Leg Wax", es: "Depilación de Piernas Completa" },
  { en: "Half Leg Wax", es: "Depilación de Media Pierna" },
  { en: "Lip Wax", es: "Depilación de Labio" },
  { en: "Underarm Wax", es: "Depilación de Axilas" },
];

export const serviceOptions: Record<Language, string[]> = {
  en: [
    "Express Facial",
    "Deluxe Facial",
    "Deep Cleansing Facial",
    "Face Lifting & Neck Microcurrent",
    "Gold Anti-Aging Facial",
    "Microcurrent & Cupping",
    "Reflexology",
    "LamProbe",
    "Full Face Wax",
    "Chin Wax",
    "Eyebrow Wax",
    "French Bikini Wax",
    "Full Leg Wax",
    "Half Leg Wax",
    "Lip Wax",
    "Underarm Wax",
    "Other / Not Sure",
  ],
  es: [
    "Facial Express",
    "Facial Deluxe",
    "Facial de Limpieza Profunda",
    "Lifting Facial y Microcorriente de Cuello",
    "Facial Antienvejecimiento de Oro",
    "Microcorriente y Ventosas",
    "Reflexología",
    "LamProbe",
    "Depilación de Rostro Completo",
    "Depilación de Mentón",
    "Depilación de Cejas",
    "Depilación Bikini Francés",
    "Depilación de Piernas Completa",
    "Depilación de Media Pierna",
    "Depilación de Labio",
    "Depilación de Axilas",
    "Otro / No Estoy Segur@",
  ],
};

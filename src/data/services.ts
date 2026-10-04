export interface Treatment {
  name: string;
  duration: string;
  price: string;
  description: string;
  image: string;
}

export const featuredTreatments: Treatment[] = [
  {
    name: "Express Facial",
    duration: "50 mins",
    price: "$85",
    description: "The perfect introduction to professional skincare.",
    image: "https://images.pexels.com/photos/37229304/pexels-photo-37229304.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Deluxe Facial",
    duration: "2 hrs",
    price: "$160",
    description: "Indulge in our luxurious two-hour Deluxe Facial.",
    image: "https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Deep Cleansing Facial",
    duration: "90 mins",
    price: "$120",
    description: "Reveal a fresher, healthier-looking complexion.",
    image: "https://images.pexels.com/photos/37240358/pexels-photo-37240358.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Face Lifting & Neck Microcurrent",
    duration: "1 hr",
    price: "$120",
    description: "A non-invasive treatment using microcurrent technology.",
    image: "https://images.pexels.com/photos/6663564/pexels-photo-6663564.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Gold Anti-Aging Facial",
    duration: "90 mins",
    price: "$120",
    description: "A treatment using a 24K gold-infused mask.",
    image: "https://images.pexels.com/photos/36436447/pexels-photo-36436447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Microcurrent & Cupping",
    duration: "1 hr",
    price: "$120",
    description: "A therapeutic body treatment combining technologies.",
    image: "https://images.pexels.com/photos/8313238/pexels-photo-8313238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "Reflexology",
    duration: "1 hr",
    price: "$85",
    description: "A relaxing foot therapy that applies gentle pressure.",
    image: "https://images.pexels.com/photos/9146383/pexels-photo-9146383.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
  {
    name: "LamProbe",
    duration: "Varies",
    price: "Varies",
    description: "Reveal smoother, healthier-looking skin with LamProbe.",
    image: "https://images.pexels.com/photos/37229302/pexels-photo-37229302.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  },
];

export const waxingServices: string[] = [
  "Full Face Wax",
  "Chin Wax",
  "Eyebrow Wax",
  "French Bikini Wax",
  "Full Leg Wax",
  "Half Leg Wax",
  "Lip Wax",
  "Underarm Wax",
];

export const serviceOptions: string[] = [
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
];

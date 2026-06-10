import logoAsset from "@/assets/prince-logo.png.asset.json";
import crownAsset from "@/assets/prince-crown.png.asset.json";
import ginniAsset from "@/assets/brand-ginni.png.asset.json";
import momsAsset from "@/assets/brand-moms.png.asset.json";
import shreeAsset from "@/assets/brand-shree.png.asset.json";

export const SITE = {
  name: "Prince Confectionery Departmental",
  shortName: "Prince Confectionery",
  tagline: "Quality You May Rely",
  description:
    "Tricity's trusted wholesaler of Namkeen, Biscuits, Sweets, Bakery, Roasted Snacks, Dry Fruits & Grocery",
  yearsExperience: 26,
  established: 1999,
  owner: "Prince Prajapat",
  gst: "04DJFPP4805P1ZT",
  phone: "+91 81467 03048",
  whatsapp: "+918146703048",
  email: "princeconfectionery@gmail.com",
  address: "#1091/2-3-4, Near Dev Samaj College, Sector 45B, Chandigarh - 160047",
  deliveryArea: "We deliver across Tricity — Chandigarh, Mohali & Panchkula",
  hours: "Mon – Sat: 9:00 AM – 8:00 PM",
  logo: logoAsset.url,
  crown: crownAsset.url,
  socials: {
    instagram: "https://www.instagram.com/prince__confectionery__/",
    facebook: "",
  },
  brands: [
    { name: "Ginni Food Products", tagline: "Pure Vegetarian — Estd. 1986", logo: ginniAsset.url },
    { name: "Shree Bajrang Food Products", tagline: "Sweet & Namkeen", logo: shreeAsset.url },
    { name: "Mom's Basket", tagline: "Every bite has mom's love", logo: momsAsset.url },
  ],
};

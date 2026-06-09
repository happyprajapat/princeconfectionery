import { SITE } from "@/lib/site";
import { MessageCircle } from "lucide-react";

const DEFAULT_MSG = "Hello Prince Confectionery Departmental, I would like information about your products.";

export function WhatsAppFloat() {
  const num = SITE.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${num}?text=${encodeURIComponent(DEFAULT_MSG)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl animate-pulse-glow transition hover:scale-110"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

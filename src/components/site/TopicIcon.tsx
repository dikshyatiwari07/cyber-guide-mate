import {
  CreditCard,
  Link2,
  Mail,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";

const icons = {
  mail: Mail,
  smartphone: Smartphone,
  "credit-card": CreditCard,
  "phone-call": PhoneCall,
  users: Users,
  link: Link2,
  shield: ShieldCheck,
} as const;

export function TopicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons] ?? ShieldCheck;
  return <Icon className={className} aria-hidden="true" />;
}

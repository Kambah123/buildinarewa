import {Code2, GraduationCap, HeartPulse, Landmark, MoonStar, Palette, Radio, Route, Server, Shapes, ShoppingBag, Sparkles, WalletCards, Wheat} from 'lucide-react';

const icons = {
  WalletCards,
  Sparkles,
  Wheat,
  GraduationCap,
  HeartPulse,
  Route,
  Code2,
  Palette,
  ShoppingBag,
  Radio,
  MoonStar,
  Landmark,
  Server,
  Shapes
};

export function CategoryIcon({name, size = 18}: {name: string; size?: number}) {
  const Icon = icons[name as keyof typeof icons] ?? Shapes;
  return <Icon size={size} strokeWidth={1.65} aria-hidden />;
}

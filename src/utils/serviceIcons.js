import {
  Binoculars,
  Briefcase,
  Car,
  Compass,
  FileText,
  Hotel,
  Palmtree,
  Plane,
  Shield,
  Users,
} from 'lucide-react';

export const SERVICE_ICON_MAP = {
  compass: Compass,
  plane: Plane,
  'file-text': FileText,
  palmtree: Palmtree,
  hotel: Hotel,
  briefcase: Briefcase,
  car: Car,
  binoculars: Binoculars,
  users: Users,
  shield: Shield,
};

export function getServiceIcon(name) {
  return SERVICE_ICON_MAP[name] || Compass;
}

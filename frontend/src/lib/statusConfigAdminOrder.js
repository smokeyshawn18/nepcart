import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  Clock,
  TruckIcon,
} from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, color: "bg-warning", accent: "border-l-warning" },
  processing: {
    icon: TruckIcon,
    color: "bg-info",
    accent: "border-l-info",
  },
  shipped: { icon: TruckIcon, color: "bg-primary", accent: "border-l-primary" },
  delivered: {
    icon: CheckCircle2Icon,
    color: "bg-success",
    accent: "border-l-success",
  },
  cancelled: {
    icon: AlertCircleIcon,
    color: "bg-error",
    accent: "border-l-error",
  },
};

const defaultStatusConfig = {
  icon: ClipboardListIcon,
  color: "bg-base-content/20",
  accent: "border-l-base-content/20",
};

export function getStatusConfig(status) {
  return statusConfig[status] || defaultStatusConfig;
}

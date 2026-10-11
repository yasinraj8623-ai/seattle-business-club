import { Label } from "@/components/ui/shadcn/label";

export default function FormField({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {children}

      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-[#F5F4F0] text-sm leading-normal">
        {label}
        {required && <span className="text-current"> *</span>}
        {optional && <span className="font-normal text-xs text-[#8C8C8C]"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

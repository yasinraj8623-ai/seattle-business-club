export default function IconInput({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative [&_input]:pl-10">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</span>
      {children}
    </div>
  );
}

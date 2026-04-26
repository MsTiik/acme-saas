export function ProbeTracked({ changeId, children }: { changeId: string; children: React.ReactNode }) {
  return <div data-probe-change={changeId}>{children}</div>;
}

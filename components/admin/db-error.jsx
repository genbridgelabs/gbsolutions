export default function DbError({ message }) {
  return (
    <div className="border border-laterite/40 bg-laterite/5 px-5 py-6">
      <p className="font-display text-xl text-laterite">
        The studio desk could not reach MongoDB.
      </p>
      <p className="mt-2 max-w-[60ch] text-[0.84rem] leading-relaxed text-ink-soft">
        Check <code>MONGODB_URI</code> in <code>.env.local</code> and that this
        machine can reach the cluster, then reload.
      </p>
      <p className="mt-3 font-mono text-[0.72rem] text-quiet">{message}</p>
    </div>
  );
}

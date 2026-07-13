export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-neutral-800 text-neutral-300 rounded-full mb-6">
          Milestone 1 — Project Foundation
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          AllThings<span className="text-emerald-400">Merch</span>
        </h1>
        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mb-8">
          Licensed Merchandise & Collectibles Storefront with Authenticity TAG Verification and Royalty Tracking.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <h3 className="font-semibold text-white mb-1">Authentic Merch</h3>
            <p className="text-sm text-neutral-400">Formula 1, Music Artists, Football Clubs, and rare collectibles.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <h3 className="font-semibold text-white mb-1">Authenticity TAG</h3>
            <p className="text-sm text-neutral-400">Unique public verification code & serial number per item.</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <h3 className="font-semibold text-white mb-1">Royalty Reporting</h3>
            <p className="text-sm text-neutral-400">Automated snapshot calculation of licensing royalties.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

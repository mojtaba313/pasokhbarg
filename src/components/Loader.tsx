// components/Loader.tsx
export const Loader = () => (
  <div className="fixed inset-0 bg-slate-800 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);
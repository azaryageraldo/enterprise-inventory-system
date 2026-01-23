export function Footer() {
    return (
      <footer className="py-6 px-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-emerald-700">Enterprise System</span>. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-6">
                <a href="#" className="hover:text-emerald-600 transition-colors">Dukungan</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Syarat Layanan</a>
                <span className="opacity-50">v1.0.0</span>
            </div>
        </div>
      </footer>
    );
  }

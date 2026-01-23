export function Footer() {
    return (
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© 2024 Enterprise System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    );
  }

export function Footer() {
    return (
      <footer className="py-6 px-8 border-t bg-background/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">Enterprise System</span>. All rights reserved.</p>
            <div className="flex items-center gap-6">
                <a href="#" className="hover:text-primary transition-colors">Support</a>
                <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                <span className="opacity-50">v1.0.0</span>
            </div>
        </div>
      </footer>
    );
  }

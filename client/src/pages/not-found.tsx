import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background geometric elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 border border-red-500/10 rotate-45" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-cyan-500/10 rotate-12" />
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-yellow-400/5 rotate-45" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md relative z-10"
      >
        <div className="w-24 h-24 mx-auto mb-6 rotate-45 bg-red-500 flex items-center justify-center">
          <span className="text-white font-bold text-4xl -rotate-45">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="btn-angular bg-yellow-400 text-black hover:bg-yellow-300 font-semibold" data-testid="button-go-home">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="btn-angular"
            onClick={() => window.history.back()}
            data-testid="button-go-back"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

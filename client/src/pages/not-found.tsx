import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-4xl">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" data-testid="button-go-home">
              <Home className="mr-2 w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
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

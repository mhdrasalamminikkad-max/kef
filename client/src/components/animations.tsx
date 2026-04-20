import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";

export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

export function MagneticButton({ 
  children, 
  className = "",
  strength = 0.3
}: { 
  children: ReactNode; 
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.05
}: { 
  children: string; 
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const chars = children.split("");
  
  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ 
            duration: 0.5, 
            delay: delay + i * duration,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          style={{ 
            display: "inline-block",
            transformOrigin: "bottom",
            whiteSpace: char === " " ? "pre" : "normal"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function WordReveal({ 
  children, 
  className = "",
  delay = 0,
  stagger = 0.1
}: { 
  children: string; 
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = children.split(" ");
  
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ 
            duration: 0.6, 
            delay: delay + i * stagger,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function SlideUp({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : {}}
        transition={{ 
          duration: 0.8, 
          delay,
          ease: [0.215, 0.61, 0.355, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function FadeInUp({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.6
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.215, 0.61, 0.355, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className = "",
  stagger = 0.1
}: { 
  children: ReactNode; 
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = ""
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.215, 0.61, 0.355, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingParticles({ count = 50 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function GlowingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-red-500/30 to-yellow-500/20 blur-3xl"
        animate={{
          x: ["-20%", "10%", "-20%"],
          y: ["-10%", "20%", "-10%"],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ left: "-10%", top: "-20%" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"
        animate={{
          x: ["20%", "-10%", "20%"],
          y: ["10%", "-20%", "10%"],
          scale: [1.2, 1, 1.2]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ right: "-10%", bottom: "-10%" }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl"
        animate={{
          x: ["-10%", "30%", "-10%"],
          y: ["30%", "-10%", "30%"],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ left: "40%", top: "50%" }}
      />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500 origin-left z-[9999]"
      style={{ scaleX }}
    />
  );
}

export function CountUp({ 
  end, 
  duration = 2,
  prefix = "",
  suffix = ""
}: { 
  end: number; 
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);
  
  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function HoverScale({ 
  children, 
  className = "",
  scale = 1.05
}: { 
  children: ReactNode; 
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GradientText({ 
  children, 
  className = "",
  from = "from-red-500",
  via = "via-yellow-500",
  to = "to-cyan-500"
}: { 
  children: ReactNode; 
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}) {
  return (
    <span className={`bg-gradient-to-r ${from} ${via} ${to} bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] ${className}`}>
      {children}
    </span>
  );
}

export function Spotlight({ className = "" }: { className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return (
    <div 
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 ${className}`}
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`
      }}
    />
  );
}

export function ShimmerButton({ 
  children, 
  className = ""
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
      {children}
    </div>
  );
}

export function PulseRing({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-red-500/50"
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

export function TypewriterText({
  text,
  className = "",
  speed = 50,
  delay = 0
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || started) return;
    
    const timer = setTimeout(() => {
      setStarted(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, text, speed, delay, started]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1"
      />
    </span>
  );
}

export function RevealOnScroll({
  children,
  className = "",
  direction = "up"
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    up: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    left: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } }
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction].initial}
      animate={isInView ? variants[direction].animate : variants[direction].initial}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  duration = 3
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlitchText({
  children,
  className = ""
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute top-0 left-0 text-red-500 z-0"
        animate={{
          x: [-2, 2, -2],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 text-cyan-500 z-0"
        animate={{
          x: [2, -2, 2],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3,
          delay: 0.1
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// OPTIMIZED: Global Floating Elements - Reduced animations for performance
export function GlobalFloatingElements() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "300px" });

  if (!isInView) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ perspective: "1500px" }} ref={ref} />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ perspective: "1500px", willChange: "transform" }} ref={ref}>
      {/* Large floating cube - SIMPLIFIED */}
      <motion.div
        className="absolute w-20 h-20 md:w-28 md:h-28"
        style={{ 
          left: "5%", 
          top: "15%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        animate={{
          y: [-10, 10, -10],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border border-yellow-300/20 backdrop-blur-sm" style={{ transform: "translateZ(14px)" }} />
        </div>
      </motion.div>

      {/* Diamond shape - SIMPLIFIED */}
      <motion.div
        className="absolute w-16 h-16 md:w-24 md:h-24"
        style={{ 
          right: "8%", 
          top: "25%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        animate={{
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 9, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-500/10 border border-cyan-300/20 backdrop-blur-sm" />
      </motion.div>

      {/* Removed most floating dots and shapes - Too expensive */}
      {/* Kept only 3 key dots for visual balance */}
      {[
        { x: "25%", y: "30%", size: 8, delay: 0, duration: 6 },
        { x: "70%", y: "15%", size: 6, delay: 1.5, duration: 7 },
        { x: "85%", y: "45%", size: 10, delay: 0.8, duration: 5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: `radial-gradient(circle, ${i % 3 === 0 ? 'rgba(251,191,36,0.4)' : i % 3 === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(34,211,238,0.35)'}, transparent 70%)`,
            willChange: "transform"
          }}
          animate={{
            y: [-10, 15, -10],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// OPTIMIZED: 3D Floating Geometric Shapes for Hero Sections - Reduced animations
export function Floating3DShapes() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "500px" });
  
  // Only render animations when in view
  if (!isInView) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }} ref={ref} />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px", willChange: "transform" }} ref={ref}>
      {/* Simplified Floating Cube - STATIC */}
      <div
        className="absolute w-16 h-16 md:w-20 md:h-20"
        style={{ 
          left: "10%", 
          top: "20%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/20 border border-yellow-300/30 backdrop-blur-sm" style={{ transform: "translateZ(10px)" }} />
        </div>
      </div>

      {/* Simplified Diamond - MINIMAL ANIMATION */}
      <motion.div
        className="absolute w-12 h-12 md:w-16 md:h-16"
        style={{ 
          right: "15%", 
          top: "30%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        animate={{
          y: [-5, 5, -5],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400/30 to-blue-500/20 border border-cyan-300/40 backdrop-blur-sm shadow-lg shadow-cyan-500/20" />
      </motion.div>

      {/* Floating Sphere - MINIMAL ANIMATION */}
      <motion.div
        className="absolute w-10 h-10 md:w-14 md:h-14 rounded-full"
        style={{ 
          left: "75%", 
          top: "60%",
          willChange: "transform"
        }}
        animate={{
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/40 via-yellow-200/30 to-transparent border border-white/30 shadow-xl shadow-yellow-400/20" 
          style={{ 
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(251,191,36,0.2) 50%, transparent 70%)"
          }} 
        />
      </motion.div>

      {/* Simplified Triangle - STATIC */}
      <div
        className="absolute"
        style={{ 
          left: "20%", 
          bottom: "25%",
          transformStyle: "preserve-3d"
        }}
      >
        <div 
          className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[45px] md:border-l-[35px] md:border-r-[35px] md:border-b-[60px] border-l-transparent border-r-transparent border-b-red-400/30"
          style={{ filter: "drop-shadow(0 10px 20px rgba(239,68,68,0.2))" }}
        />
      </div>

      {/* Floating Ring - MINIMAL ANIMATION */}
      <motion.div
        className="absolute w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-cyan-400/30"
        style={{ 
          right: "25%", 
          bottom: "20%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Hexagon - MINIMAL ANIMATION */}
      <motion.div
        className="absolute"
        style={{ 
          left: "55%", 
          top: "15%",
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
        animate={{
          y: [-6, 6, -6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="40" height="46" viewBox="0 0 40 46" className="md:w-[50px] md:h-[58px]">
          <polygon 
            points="20,1 38,12 38,34 20,45 2,34 2,12" 
            fill="rgba(251,191,36,0.15)" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      {/* Removed Small Floating Dots - Too expensive for performance */}
    </div>
  );
}

// ===== NEW KILLER ANIMATION COMPONENTS =====

// Page Transition Wrapper
export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 3D Tilt Card Component
export function TiltCard({ 
  children, 
  className = "",
  intensity = 15
}: { 
  children: ReactNode; 
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Aurora Background Effect
export function AuroraBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute w-[150%] h-[150%] -top-1/4 -left-1/4"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0 aurora-bg opacity-60" />
      </motion.div>
      <motion.div
        className="absolute w-full h-full rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 50%)",
          left: "20%",
          top: "30%"
        }}
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-full h-full rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 50%)",
          right: "20%",
          bottom: "20%"
        }}
        animate={{
          x: [50, -50, 50],
          y: [30, -30, 30],
          scale: [1.2, 1, 1.2]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

// Liquid Blob Component
export function LiquidBlob({
  color = "from-red-500 to-yellow-500",
  size = "w-64 h-64",
  className = ""
}: {
  color?: string;
  size?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute bg-gradient-to-br ${color} ${size} blur-3xl opacity-30 liquid-blob ${className}`}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Text Scramble Animation
export function TextScramble({
  text,
  className = "",
  scrambleSpeed = 50
}: {
  text: string;
  className?: string;
  scrambleSpeed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    if (!isInView || isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [isInView, text, scrambleSpeed, isScrambling]);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText}
    </span>
  );
}

// Animated Gradient Border
export function GradientBorderCard({
  children,
  className = "",
  borderWidth = 2
}: {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
}) {
  return (
    <div className={`relative rounded-lg ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          padding: borderWidth,
          background: "linear-gradient(90deg, #ef4444, #fbbf24, #22d3ee, #a855f7, #ef4444)",
          backgroundSize: "300% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full bg-background rounded-lg" />
      </motion.div>
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
}

// Bounce In Animation
export function BounceIn({
  children,
  className = "",
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Elastic Slide
export function ElasticSlide({
  children,
  direction = "left",
  className = "",
  delay = 0
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const variants = {
    left: { x: -200, opacity: 0 },
    right: { x: 200, opacity: 0 },
    up: { y: 200, opacity: 0 },
    down: { y: -200, opacity: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction]}
      animate={isInView ? { 
        x: 0, 
        y: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glowing Button Effect
export function GlowingButton({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500 blur-lg opacity-50"
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// Animated Counter with Spring
export function SpringCounter({
  value,
  className = ""
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

// Morphing Shape
export function MorphingShape({
  className = ""
}: {
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-cyan-500/20 ${className}`}
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "50% 60% 30% 60% / 30% 50% 70% 50%",
          "60% 40% 60% 30% / 70% 30% 50% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%"
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Sparkle Effect
export function SparkleEffect({
  count = 10,
  className = ""
}: {
  count?: number;
  className?: string;
}) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-yellow-400"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Animated Background Mesh
export function AnimatedMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mesh" width="60" height="60" patternUnits="userSpaceOnUse">
            <motion.circle
              cx="30"
              cy="30"
              r="1"
              fill="currentColor"
              animate={{
                r: [1, 2, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>
    </div>
  );
}

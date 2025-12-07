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

// 3D Floating Geometric Shapes for Hero Sections
export function Floating3DShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
      {/* Floating 3D Cube */}
      <motion.div
        className="absolute w-16 h-16 md:w-20 md:h-20"
        style={{ 
          left: "10%", 
          top: "20%",
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          y: [-20, 20, -20],
        }}
        transition={{
          rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
          rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/20 border border-yellow-300/30 backdrop-blur-sm" style={{ transform: "translateZ(10px)" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 border border-yellow-300/20" style={{ transform: "translateZ(-10px)" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/25 to-orange-500/15 border border-yellow-300/25" style={{ transform: "rotateY(90deg) translateZ(10px)" }} />
        </div>
      </motion.div>

      {/* Floating 3D Diamond/Rhombus */}
      <motion.div
        className="absolute w-12 h-12 md:w-16 md:h-16"
        style={{ 
          right: "15%", 
          top: "30%",
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateZ: [45, 405],
          rotateY: [0, 360],
          y: [-15, 25, -15],
          x: [-10, 10, -10]
        }}
        transition={{
          rotateZ: { duration: 25, repeat: Infinity, ease: "linear" },
          rotateY: { duration: 18, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400/30 to-blue-500/20 border border-cyan-300/40 backdrop-blur-sm shadow-lg shadow-cyan-500/20" />
      </motion.div>

      {/* Floating 3D Sphere/Circle */}
      <motion.div
        className="absolute w-10 h-10 md:w-14 md:h-14 rounded-full"
        style={{ 
          left: "75%", 
          top: "60%"
        }}
        animate={{
          y: [-25, 15, -25],
          x: [-15, 20, -15],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 6,
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

      {/* Floating 3D Triangle/Pyramid */}
      <motion.div
        className="absolute"
        style={{ 
          left: "20%", 
          bottom: "25%",
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateY: [0, 360],
          y: [-20, 20, -20],
        }}
        transition={{
          rotateY: { duration: 22, repeat: Infinity, ease: "linear" },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div 
          className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[45px] md:border-l-[35px] md:border-r-[35px] md:border-b-[60px] border-l-transparent border-r-transparent border-b-red-400/30"
          style={{ filter: "drop-shadow(0 10px 20px rgba(239,68,68,0.2))" }}
        />
      </motion.div>

      {/* Floating 3D Ring/Torus */}
      <motion.div
        className="absolute w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-cyan-400/30"
        style={{ 
          right: "25%", 
          bottom: "20%",
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateX: [60, 60],
          rotateZ: [0, 360],
          y: [-10, 15, -10]
        }}
        transition={{
          rotateZ: { duration: 12, repeat: Infinity, ease: "linear" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="absolute inset-1 rounded-full border-2 border-yellow-300/20" />
      </motion.div>

      {/* Floating Hexagon */}
      <motion.div
        className="absolute"
        style={{ 
          left: "55%", 
          top: "15%",
          transformStyle: "preserve-3d"
        }}
        animate={{
          rotateZ: [0, 360],
          y: [-18, 18, -18],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotateZ: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <svg width="40" height="46" viewBox="0 0 40 46" className="md:w-[50px] md:h-[58px]">
          <polygon 
            points="20,1 38,12 38,34 20,45 2,34 2,12" 
            fill="url(#hexGradient)" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251,191,36,0.3)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Small Floating Dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
          style={{
            left: `${15 + i * 10}%`,
            top: `${25 + (i % 3) * 25}%`,
            background: i % 2 === 0 
              ? "radial-gradient(circle, rgba(251,191,36,0.5), transparent)" 
              : "radial-gradient(circle, rgba(34,211,238,0.5), transparent)"
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

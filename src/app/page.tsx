"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mouseVelocity, setMouseVelocity] = useState({ x: 0, y: 0 });
  const [isDizzy, setIsDizzy] = useState(false);
  const [isCrossEyed, setIsCrossEyed] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDerp, setIsDerp] = useState(false);
  const [derpEyePosition, setDerpEyePosition] = useState({ x: 15, y: 15 }); // Initialize with extreme values
  const [googleEyeAngles, setGoogleEyeAngles] = useState({ left: 0, right: 0 });
  const [rapidMovementCount, setRapidMovementCount] = useState(0);
  const [mousePositions, setMousePositions] = useState<Array<{x: number, y: number}>>([]);
  const [lastAngle, setLastAngle] = useState<number | null>(null);
  const [circularMotionCount, setCircularMotionCount] = useState(0);
  const VELOCITY_THRESHOLD = 100; // Increased from 30
  const RAPID_MOVEMENTS_NEEDED = 5; // Number of rapid movements needed to trigger dizzy
  const CIRCULAR_MOTION_THRESHOLD = 20; // Number of continuous circular movements needed
  const lastMousePos = useRef({ x: 0, y: 0 });
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastBlinkTime = useRef(Date.now());
  const googleEyeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Setup automatic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Date.now() - lastBlinkTime.current > 4000) { // Don't blink if we recently blinked
        handleBlink();
      }
    }, 5000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Handle mouse movement and effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Store last few mouse positions for circular motion detection
        setMousePositions(prev => {
          const newPositions = [...prev, {x, y}].slice(-10); // Keep last 10 positions
          
          // Detect circular motion
          if (newPositions.length >= 3) {
            const angle = Math.atan2(
              newPositions[newPositions.length - 1].y - rect.height / 2,
              newPositions[newPositions.length - 1].x - rect.width / 2
            );

            if (lastAngle !== null) {
              const angleDiff = ((angle - lastAngle + Math.PI) % (2 * Math.PI)) - Math.PI;
              
              // Check if motion is circular (consistent angle change in one direction)
              if (Math.abs(angleDiff) > 0.1 && Math.abs(angleDiff) < 1) {
                setCircularMotionCount(prev => prev + 1);
                if (circularMotionCount >= CIRCULAR_MOTION_THRESHOLD && !isDizzy) {
                  setIsDizzy(true);
                  startGoogleEyes();
                  setTimeout(() => {
                    setIsDizzy(false);
                    stopGoogleEyes();
                    setCircularMotionCount(0);
                  }, 2500);
                }
              } else {
                setCircularMotionCount(0);
              }
            }
            setLastAngle(angle);
          }
          return newPositions;
        });

        // Update mouse position for eye tracking
        setMousePosition({ x, y });

        // Clear derp effect when mouse moves
        if (isDerp) {
          setIsDerp(false);
        }

        // Reset and start derp timer
        if (hoverTimer.current) {
          clearTimeout(hoverTimer.current);
        }
        
        hoverTimer.current = setTimeout(() => {
          setIsDerp(true);
          setDerpEyePosition({
            x: (Math.random() > 0.5 ? 15 : -15), // More extreme values
            y: (Math.random() > 0.5 ? 15 : -15)
          });
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, [isDerp, circularMotionCount, isDizzy, lastAngle]);

  // Add Google Eyes animation functions
  const startGoogleEyes = () => {
    if (googleEyeRef.current) return;
    
    googleEyeRef.current = setInterval(() => {
      setGoogleEyeAngles(prev => ({
        left: prev.left + 25,
        right: prev.right - 15
      }));
    }, 50);
  };

  const stopGoogleEyes = () => {
    if (googleEyeRef.current) {
      clearInterval(googleEyeRef.current);
      googleEyeRef.current = null;
      setGoogleEyeAngles({ left: 0, right: 0 });
    }
  };

  // Handle blinking
  const handleBlink = () => {
    setIsBlinking(true);
    lastBlinkTime.current = Date.now();
    setTimeout(() => setIsBlinking(false), 150);
  };

  // Handle click for bonus blink
  const handleClick = () => {
    handleBlink();
  };

  // Calculate eye position with all effects
  const getEyeStyle = (side: 'left' | 'right') => {
    const maxMove = 8;
    let deltaX = Math.min(Math.max(mousePosition.x / 30, -maxMove), maxMove);
    let deltaY = Math.min(Math.max(mousePosition.y / 30, -maxMove), maxMove);
    let rotation = 0;
    
    // Apply cross-eyed effect - increased inward movement
    if (isCrossEyed) {
      deltaX = side === 'left' ? 4 : -4;  // Increased from 2
    }

    // Apply derp effect - only affect left eye
    if (isDerp && side === 'left') {
      deltaX = derpEyePosition.x;
      deltaY = derpEyePosition.y;
      rotation = 25; // Increased rotation
      // Add more pronounced wobble
      deltaX += Math.sin(Date.now() / 400) * 4; // Faster and wider wobble
      deltaY += Math.cos(Date.now() / 400) * 4;
    }

    // Apply google eyes effect with smoother circular motion
    if (isDizzy) {
      const time = Date.now() / 300;
      const radius = 5; // Increased radius for more noticeable effect
      const angle = side === 'left' ? time * 2 : -time * 2;
      deltaX += Math.cos(angle) * radius;
      deltaY += Math.sin(angle) * radius;
    }

    return {
      transform: `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`,
      transition: isDizzy ? 'none' : 'transform 0.1s ease-out',
    };
  };

  // Add these CSS keyframes at the top of your file
  const keyframes = `
    @keyframes blink {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  // Helper function for placeholder icons
  const PlaceholderIcon = ({ name }: { name: string }) => (
    <div className="w-4 h-4 flex items-center justify-center bg-white rounded-sm text-black text-[8px] font-bold">
      {name.charAt(0)}
    </div>
  );
  
  return (
    <>
      <style>{keyframes}</style>
      <div className="w-full bg-gradient-to-b from-background to-background/80 min-h-screen">
        {/* Hero Section */}
        <section className="py-8 flex flex-col items-center px-4">
          <div className="flex flex-col md:flex-row items-start justify-center w-full gap-8 px-[8%] py-8">
            {/* Left Stack - Developer */}
            <div className="w-full md:w-1/3 space-y-6 pt-4">
              {/* Developer Header */}
              <div className="text-center mb-6">
                <h1 className="text-5xl font-bold text-white font-mono border-b-2 border-ice-blue pb-2 inline-block transform hover:scale-105 transition-transform">
                  &lt;Developer/&gt;
                </h1>
              </div>
              
              {/* Languages */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Languages</h2>
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {[
                    { name: "Python", icon: "PythonLogo.png" },
                    { name: "JavaScript", icon: "JsLogo.png" },
                    { name: "TypeScript", icon: "TSLogo.png" },
                    { name: "C#", icon: "CsLogo.png" },
                    { name: "Dart", icon: "DartLogo.png" },
                    { name: "SQL", icon: "SQLLogo.png" },
                    { name: "Bash", icon: "BashLogo.png" },
                    { name: "Markdown", icon: "MarkdownLogo.png" }
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Frameworks */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Frameworks</h2>
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {[
                    { name: "Next.js", icon: "NextJSLogo.png" },
                    { name: "Vue.js", icon: "VueJSLogo.png" },
                    { name: "Django", icon: "DjangoLogo.png" },
                    { name: "Node.js", icon: "NodeJSLogo.png" },
                    { name: "Express.js", icon: "ExpressLogo.png" },
                    { name: "TailwindCSS", icon: "TailwindCSSLogo.png" },
                    { name: "React", icon: "ReactLogo.png" },
                    { name: "Flutter", icon: "FlutterLogo.png" },
                    { name: "Flask", icon: "FlaskLogo.png" },
                    { name: "FastAPI", icon: "FastAPILogo.png" },
                    { name: "Pandas", icon: "PandasLogo.png" },
                    { name: "NumPy", icon: "NumPyLogo.png" },
                    { name: "Discord.py", icon: "DiscordLogo.png" },
                    { name: "Unity", icon: "UnityLogo.png" }

                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Storage */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Data Storage</h2>
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {[
                    { name: "Firebase", icon: "FirebaseLogo.png" },
                    { name: "MongoDB", icon: "MongoDBLogo.png" },
                    { name: "MySQL", icon: "MySQLLogo.png" },
                    { name: "MariaDB", icon: "MariaDBLogo.png" },
                    { name: "SQLite", icon: "SQLiteLogo.png" },
                    { name: "JSON", icon: "JsonLogo.png" },
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* DevOps & Tools */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">DevOps & Tools</h2>
                <ul className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {[
                    { name: "Docker", icon: "DockerLogo.png" },
                    { name: "GitHub", icon: "GitHubLogo.png" },
                    { name: "GitLab", icon: "GitLabLogo.png" },
                    { name: "Linux/PT", icon: "LinuxPTLogo.png" },
                    { name: "NGINX", icon: "NGINXLogo.png" },
                    { name: "Apache", icon: "ApacheLogo.png" },
                    { name: "Postman", icon: "PostmanLogo.png" },
                    { name: "Trello", icon: "TrelloLogo.png" },
                    { name: "Jira", icon: "JiraLogo.png" },
                    { name: "VS Code", icon: "VSCodeLogo.png" },
                    { name: "Blender", icon: "BlenderLogo.png" },
                    { name: "Pterodactyl", icon: "PterodactylLogo.png" },
                    { name: "cPanel", icon: "cPanelLogo.png" },
                    { name: "Firebase CLI", icon: "FirebaseCLILogo.png" }
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Center - Character */}
            <div className="w-full md:w-1/3 flex justify-center pt-20" ref={containerRef} onClick={handleClick}>
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-ice-blue bg-opacity-20 rounded-full blur-xl animate-pulse-slow"></div>
                
                {/* Character with animated eyes - 2x larger */}
                <div className="relative w-80 h-80">
                  {/* Character Stack - All images same size but absolutely positioned on top of each other */}
                  <div className="relative w-full h-full">
                    {/* Base Layer */}
                    <Image 
                      src="/logo/SelfCartoonLower.png" 
                      alt="Character Base"
                      width={400} 
                      height={400}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      priority
                    />
                    
                    {/* Left Eye with movement */}
                    <div className="absolute bottom-8 left-1 w-full h-full pointer-events-none">
                      <div style={getEyeStyle('left')}>
                        <Image 
                          src="/logo/SelfCartoonEyesLeft.png" 
                          alt="Left Eye"
                          width={400} 
                          height={400}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* Right Eye with movement */}
                    <div className="absolute bottom-8 right-[2%] w-full h-full pointer-events-none">
                      <div style={getEyeStyle('right')}>
                        <Image 
                          src="/logo/SelfCartoonEyesRight.png" 
                          alt="Right Eye"
                          width={400} 
                          height={400}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Eyelids */}
                    <Image 
                      src="/logo/SelfCartoonLids.png" 
                      alt="Eyelids"
                      width={400} 
                      height={400}
                      className={`absolute bottom-3 left-0 w-full h-full object-contain transition-transform duration-150 ${
                        isBlinking ? 'translate-y-[20px]' : 'translate-y-0'
                      }`}
                    />
                    
                    {/* Top Layer */}
                    <Image 
                      src="/logo/SelfCartoonUpper.png" 
                      alt="Character Top"
                      width={400} 
                      height={400}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                    />

                    {/* Dizzy emoji */}
                    {isDizzy && (
                      <div className="absolute -top-8 right-0 text-2xl animate-bounce">
                        😵
                      </div>
                    )}

                    {/* Derp emoji with drool */}
                    {isDerp && (
                      <div className="absolute -top-8 right-0 text-2xl animate-bounce">
                        🤤
                      </div>
                    )}

                    {/* Confused emoji for cross-eyed mode */}
                    {isCrossEyed && (
                      <div className="absolute -top-8 right-0 text-2xl animate-bounce">
                        🤔
                      </div>
                    )}
                  </div>

                  {/* Name below character */}
                  <div className="absolute -bottom-12 left-0 right-0 text-center">
                    <h1 className="text-4xl font-bold text-ice-blue">ice.code</h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stack - Creative */}
            <div className="w-full md:w-1/3 space-y-6 pt-4">
              {/* Creative Header */}
              <div className="text-center mb-6">
                <h1 className="text-5xl font-bold text-white font-serif italic border-b-2 border-ice-blue pb-2 inline-block handwriting-font transform hover:scale-105 transition-transform" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Creative
                </h1>
              </div>
              
              {/* Creative Tools */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Creative Tools</h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { name: "GIMP", icon: "GimpLogo.png" },
                    { name: "Blender", icon: "BlenderLogo.png" },
                    { name: "Spriter", icon: "SpriterLogo.png" },
                    { name: "UI/UX", icon: "UiUxLogo.png" },
                    { name: "Graphics", icon: "GraphicDesignLogo.png" }
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Music Production */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Music Production</h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { name: "FL Studio", icon: "FLLogo.png" },
                    { name: "Melodyne", icon: "MelodyneLogo.png" },
                    { name: "Sound Design", icon: null },
                    { name: "Composition", icon: null }
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Organization */}
              <div>
                <h2 className="text-2xl font-bold text-ice-blue mb-4 border-b border-gray-700 pb-2">Organization</h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { name: "Trello", icon: "TrelloLogo.png" },
                    { name: "Notion", icon: null },
                    { name: "Figma", icon: null }
                  ].map((tech) => (
                    <li key={tech.name} className="flex items-center gap-2">
                      {tech.icon ? (
                        <Image 
                          src={`/icons/${tech.icon}`} 
                          alt={tech.name}
                          width={20} 
                          height={20}
                        />
                      ) : (
                        <PlaceholderIcon name={tech.name} />
                      )}
                      <span className="text-foreground text-sm">{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Dev by trade. <span className="text-ice-blue">Gamer by nature.</span>
              </h2>
            
            {/* Social Links */}
            <div className="mt-8 flex gap-4 justify-center">
              <a 
                href="https://github.com/Icecode0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black/50 dark:bg-gray-800/70 flex items-center justify-center border border-gray-700 hover:border-ice-blue hover:bg-gray-700/50 transition-all duration-300 shadow-md"
              >
                <span className="sr-only">GitHub</span>
                <Image 
                  src="/icons/GitHubLogo.png" 
                  alt="GitHub"
                  width={24} 
                  height={24}
                />
              </a>
              <a 
                href="https://discord.gg/yourinvite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black/50 dark:bg-gray-800/70 flex items-center justify-center border border-gray-700 hover:border-ice-blue hover:bg-gray-700/50 transition-all duration-300 shadow-md"
              >
                <span className="sr-only">Discord</span>
                <Image 
                  src="/icons/DiscordLogo.png" 
                  alt="Discord"
                  width={24} 
                  height={24}
                />
              </a>
            </div>
            
            {/* Scroll prompt */}
            <div className="mt-16 animate-bounce">
              <p className="text-sm text-gray-400">Scroll to explore</p>
              <div className="mx-auto w-6 h-12 border-2 border-gray-400 rounded-full mt-2 flex justify-center">
                <div className="w-2 h-2 bg-ice-blue rounded-full mt-2 animate-ping"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects preview section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
            <div className="w-24 h-1 bg-ice-blue mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {[
              {
                title: "Primal Heaven Skin Creator",
                description: "Interactive skin creation tool for Primal Heaven's website, featuring real-time 3D preview and customization options",
                image: "/projects/PrimalHeavenProject.png",
                tags: ["React", "Three.js", "TypeScript", "Next.js"],
                link: "/projects/skinCreator"
              },
              {
                title: "Discord.py Toolkit",
                description: "A production-ready collection of Discord.py modules including a comprehensive ticket system and custom voice channel manager",
                image: "/projects/DiscordToolkit.png", 
                tags: ["Python", "Discord.py", "JSON", "Slash Commands"],
                link: "https://github.com/Icecode0/DiscordPy-Toolkit"
              }
            ].map((project) => (
              <div 
                key={project.title}
                className="bg-black/30 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-ice hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-ice-blue backdrop-blur-sm"
              >
                <div className="h-48 bg-gray-700/50 relative">
                  {project.image ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={project.image}
                        alt={project.title}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full">
                        <PlaceholderIcon name="Project" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-700/70 rounded-md text-xs text-gray-300">{tech}</span>
                    ))}
                  </div>
                  <Link 
                    href={project.link} 
                    target={project.link.startsWith('http') ? '_blank' : undefined}
                    rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-ice-blue hover:underline flex items-center gap-1"
                  >
                    <span>View details</span>
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/projects" 
              className="px-6 py-3 bg-ice-blue text-gray-900 rounded-lg font-bold hover:bg-ice-blue/80 transition-all duration-300 shadow-lg hover:shadow-ice"
            >
              View All Projects
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
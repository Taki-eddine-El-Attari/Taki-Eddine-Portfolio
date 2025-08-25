import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { useState, useEffect, useRef } from "react";

import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { Suspense } from "react";
import CanvasLoader from "../../Loading";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isLargeDesktop = useMediaQuery({ query: "(min-width: 1280px)" });
  
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef();

  // Intersection Observer to detect when Hero section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Only load the model when in view
        if (entry.isIntersecting) {
          setShouldLoad(true);
        } else {
          // Add a small delay before unloading to prevent flickering when scrolling fast
          setTimeout(() => {
            if (!isInView) {
              setShouldLoad(false);
            }
          }, 1000);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px', // Start loading a bit before it comes into view
      }
    );

    // Find the hero section element
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, [isInView]);

  // If model shouldn't load, show a placeholder
  if (!shouldLoad) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl flex items-center justify-center">
        <div className="text-white/50 text-sm">Loading 3D Experience...</div>
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      {/* deep blue ambient */}
      <ambientLight intensity={0.2} color="#1a1a40" />
      {/* Configure OrbitControls to disable panning and control zoom based on device type */}
      <OrbitControls
        enablePan={false} // Prevents panning of the scene
        enableZoom={!isTablet} // Disables zoom on tablets
        maxDistance={20} // Maximum distance for zooming out
        minDistance={5} // Minimum distance for zooming in
        minPolarAngle={Math.PI / 5} // Minimum angle for vertical rotation
        maxPolarAngle={Math.PI / 2} // Maximum angle for vertical rotation
      />

      <Suspense fallback={<CanvasLoader />}>
        <HeroLights />
        <Particles count={100} speed={isMobile ? 2 : 1} />
        <group
          scale={isMobile ? 0.7 : isLargeDesktop ? 1 : 0.7}
          position={[0, -3.5, 0]}
          rotation={[0, -Math.PI / 4, 0]}
        >
          <Room />
        </group>
      </Suspense>
    </Canvas>
  );
};

export default HeroExperience;
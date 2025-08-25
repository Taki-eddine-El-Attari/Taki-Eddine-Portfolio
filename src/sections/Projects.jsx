import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';

import { myProjects } from '../constants/index.js';
import CanvasLoader from '../components/Loading.jsx';
import DemoComputer from '../components/DemoComputer.jsx';
import TitleHeader from '../components/TitleHeader.jsx';

const projectCount = myProjects.length;

const Projects = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const leftCardRef = useRef(null);

  // Intersection Observer to detect when Projects section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        
        // Only load the 3D model when in view
        if (entry.isIntersecting) {
          setShouldLoad3D(true);
        } else {
          // Add a small delay before unloading to prevent flickering when scrolling fast
          setTimeout(() => {
            if (!isInView) {
              setShouldLoad3D(false);
            }
          }, 1000);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '50px', // Start loading a bit before it comes into view
      }
    );

    // Find the projects section element
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      observer.observe(projectsSection);
    }

    return () => {
      if (projectsSection) {
        observer.unobserve(projectsSection);
      }
    };
  }, [isInView]);

  const handleLeftCardMouseMove = (e) => {
    const card = leftCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    angle = (angle + 360) % 360;
    card.style.setProperty('--start', angle + 60);
  };

  const handleNavigation = (direction) => {
    setSelectedProjectIndex((prevIndex) => {
      if (direction === 'previous') {
        return prevIndex === 0 ? projectCount - 1 : prevIndex - 1;
      } else {
        return prevIndex === projectCount - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  useGSAP(() => {
    gsap.fromTo(`.animatedText`, { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.inOut' });
  }, [selectedProjectIndex]);

  const currentProject = myProjects[selectedProjectIndex];

  return (
    <section id="projects" className="c-space my-10 md:my-30 ">
        <TitleHeader
          title="My Projects"
        />
      <div className="grid lg:grid-cols-2 grid-cols-1 mt-20 gap-5 w-full ">
        <div
          ref={leftCardRef}
          onMouseMove={handleLeftCardMouseMove}
          className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full relative"
        >
          <div className="glow pointer-events-none"></div>
          <div className="absolute top-0 right-0 pointer-events-none z-0">
            <img src={currentProject.spotlight} alt="spotlight" className="w-full h-96 object-cover rounded-xl pointer-events-none" />
          </div>

          <div className="p-3 backdrop-filter backdrop-blur-3xl w-fit rounded-lg" style={currentProject.logoStyle}>
            <img className="w-10 h-10 shadow-sm" src={currentProject.logo} alt="logo" />
          </div>

          <div className="flex flex-col gap-5 text-white-600 my-5">
            <p className="text-white text-2xl font-semibold animatedText">{currentProject.title}</p>

            <p className="animatedText">{currentProject.desc}</p>
            <p className="animatedText">{currentProject.subdesc}</p>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-5">
            <div className="flex items-center gap-3">
              {currentProject.tags.map((tag, index) => (
                <div key={index} className="tech-logo">
                  <img src={tag.path} alt={tag.name} />
                </div>
              ))}
            </div>

            <a
              className="flex items-center gap-2 cursor-pointer text-white-600 z-10"
              href={currentProject.href}
              target="_blank"
              rel="noreferrer">
              <p>Check Live Site</p>
              <img src="/assets/arrow-up.png" alt="arrow" className="w-3 h-3" />
            </a>
          </div>

          <div className="flex justify-between items-center mt-7 z-10">
            <button className="arrow-btn z-10" onClick={() => handleNavigation('previous')}>
              <img src="/assets/left-arrow.png" alt="left arrow" />
            </button>

            <button className="arrow-btn z-10" onClick={() => handleNavigation('next')}>
              <img src="/assets/right-arrow.png" alt="right arrow" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border border-black-300 bg-black-200 rounded-lg h-96 md:h-full">
          {shouldLoad3D ? (
            <Canvas dpr={[1, 2]} gl={{ physicallyCorrectLights: true }} >
              <ambientLight intensity={1.2} />
              <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
              <spotLight position={[0, 8, 8]} angle={0.3} penumbra={0.7} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
              <Center>
                <Suspense fallback={<CanvasLoader />}> 
                  <group scale={2} position={[0, -3, 0]} rotation={[0, -0.1, 0]}>
                    <DemoComputer texture={currentProject.texture} />
                    {/* Screen glow effect */}
                    <pointLight position={[0, 1.2, 1.2]} intensity={12} distance={20} color={'#ffffff'} />
                    {/* Mouse glow effect */}
                    <pointLight position={[2.5, 0.9, 1.2]} intensity={8} distance={8} color={'#ffffff'} />
                  </group>
                </Suspense>
              </Center>
              <OrbitControls 
                maxPolarAngle={Math.PI / 2} 
                enablePan={false} 
                enableZoom={true} 
                minDistance={1.7} 
                maxDistance={6}
                minAzimuthAngle={-Math.PI / 2}
                maxAzimuthAngle={Math.PI / 2}
              />
            </Canvas>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800/20 to-black-300/20 rounded-lg flex items-center justify-center">
              <div className="text-white/50 text-sm">Loading 3D Project View...</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
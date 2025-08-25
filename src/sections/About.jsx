import { useState, useRef, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Globe from 'react-globe.gl';

import Button2 from '../components/Button2.jsx';
import TitleHeader from '../components/TitleHeader.jsx';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef([]);
  const globeRef = useRef();

  useGSAP(() => {
    // Animate each card with a staggered entrance effect
    gsap.utils.toArray(".about-card").forEach((card, index) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
      });
    });

    // Animate the globe with a special entrance effect
    gsap.from(".globe-container", {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".globe-container",
        start: "top 80%",
      },
    });
  }, []);

  // Check if device is mobile on component mount
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Enable smooth auto-rotate before user interaction, stop on first interaction
  useEffect(() => {
    if (isMobile || !globeRef.current) return;
    const controls = globeRef.current.controls();
    if (!controls) return;

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5; // adjust speed if needed

    const stopAutoRotate = () => {
      controls.autoRotate = false;
    };
    controls.addEventListener('start', stopAutoRotate);

    return () => {
      controls.removeEventListener('start', stopAutoRotate);
    };
  }, [isMobile]);

  // Center the globe camera on my location label
  const handleLocateMe = () => {
    if (isMobile || !globeRef.current) return;
    const controls = globeRef.current.controls && globeRef.current.controls();
    if (controls) controls.autoRotate = false;
    // Tangier, Morocco
    globeRef.current.pointOfView({ lat: 35.0595, lng: -5.6340, altitude: 0.4 }, 1500);
  };

  const handleCopy = async (e) => {
    e.stopPropagation(); // Empêcher l'interférence avec l'effet glow
    try {
      await navigator.clipboard.writeText('takieddineelattari@gmail.com');
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    } catch (error) {
      // Fallback pour les navigateurs non-sécurisés
      const textArea = document.createElement('textarea');
      textArea.value = 'takieddineelattari@gmail.com';
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setHasCopied(true);
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
      } finally {
        textArea.remove();
      }
    }
  };

  // when mouse moves over a card, rotate the glow effect
  const handleMouseMove = (index) => (e) => {
    // get the current card
    const card = cardRefs.current[index];
    if (!card) return;

    // get the mouse position relative to the card
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // calculate the angle from the center of the card to the mouse
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    // adjust the angle so that it's between 0 and 360
    angle = (angle + 360) % 360;

    // set the angle as a CSS variable
    card.style.setProperty("--start", angle + 60);
  };

  return (
    <section className="c-space my-20" id="about">
      <TitleHeader
        title="About Me"
      />
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 min-h-screen mt-16">
        <div className="col-span-1 xl:row-span-3">
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            onMouseMove={handleMouseMove(0)}
            className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full about-card"
          >
            <div className="glow"></div>
            <img src="assets/grid1.png" alt="grid-1" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">Hi, I'm Taki eddine El attari</p>
              <p className="grid-subtext">
              A Full Stack Developer specializing in the MEAN stack. 
              I combine technical expertise with a creative approach to build modern and efficient web applications.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            onMouseMove={handleMouseMove(1)}
            className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full about-card"
          >
            <div className="glow"></div>
            <img src="assets/grid2.png" alt="grid-2" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">Tech Stack</p>
              <p className="grid-subtext">
              I build complete, end-to-end web solutions using the MEAN stack, React, and Laravel to 
              deliver powerful and modern applications.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4 hidden md:block">
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            onMouseMove={handleMouseMove(2)}
            className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full about-card"
          >
            <div className="glow"></div>
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center globe-container">
              {!isMobile && (
                <Globe
                  ref={globeRef}
                  height={326}
                  width={326}
                  backgroundColor="rgba(0, 0, 0, 0)"
                  backgroundImageOpacity={0.5}
                  showAtmosphere
                  showGraticules
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  labelsData={[{ lat: 35.0595, lng: -5.6340, text: "I'm here!", color: 'white', size: 15 }]}
                />
              )}
            </div>
            <div>
              <p className="grid-headtext">Open to Global Opportunities</p>
              <p className="grid-subtext">From my base in Tangier, Morocco, I offer flexible communication and a commitment to working effectively with teams in any time zone.</p>
              <Button2 name="Check my location" isBeam containerClass="w-full mt-10" onClick={handleLocateMe} />
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div
            ref={(el) => (cardRefs.current[3] = el)}
            onMouseMove={handleMouseMove(3)}
            className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full about-card"
          >
            <div className="glow"></div>
            <img src="assets/grid3.png" alt="grid-3" className="w-full h-[200px] sm:h-[266px] object-contain" />

            <div>
              <p className="grid-headtext">Driven by Code</p>
              <p className="grid-subtext">
              My passion is centered on solving complex problems by building effective digital solutions. 
              My skills in both coding and design allow me to be more creative, crafting applications that 
              are not only powerful but also intuitive. I am always searching for the best and simplest solutions, 
              believing that clarity and efficiency are the keys to a successful project.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div
            ref={(el) => (cardRefs.current[4] = el)}
            onMouseMove={handleMouseMove(4)}
            className="card card-border rounded-lg sm:p-7 p-4 flex flex-col gap-5 w-full h-full about-card"
          >
            <div className="glow"></div>
            <img
              src="assets/grid4.png"
              alt="grid-4"
              className="w-full md:h-[180px] sm:h-[320px] h-fit object-cover sm:object-top"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">Contact me</p>
              <div 
                className="copy-container cursor-pointer relative z-10" 
                onClick={handleCopy}
                onMouseMove={(e) => e.stopPropagation()}
              >
                <img src={hasCopied ? '/assets/tick.svg' : '/assets/copy.svg'} alt="copy" />
                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">takieddineelattari@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
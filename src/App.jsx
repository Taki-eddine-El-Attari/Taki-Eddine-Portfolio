import NavBar from "./components/NavBar";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import FeatureCards from "./sections/FeatureCards";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import LogoShowcase from "./sections/LogoShowcase";
import Projects from "./sections/Projects";
import AppShowcase from "./sections/ShowcaseSection";
import TechStack from "./sections/TechStack";
import Testimonials from "./sections/Testimonials";

const App = () => {
  return (
    <>
    <NavBar/>
    <Hero />
    <About />
    {/*<AppShowcase />*/}
    {/*<LogoShowcase />*/}
    {/*<FeatureCards />*/}
    <Experience />
    <Projects />
    <TechStack />
    {/*<Testimonials />*/}
    <Contact />
    <Footer />
    </>
  );
}

export default App;
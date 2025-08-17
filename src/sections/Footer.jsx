import { socialImgs } from "../constants";

const Footer = () => {
  const handleOpenCV = () => {
    // Ouvrir le CV dans un nouvel onglet
    window.open('/assets/documents/TAKI EDDINE EL ATTARI CV.pdf', '_blank');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center md:items-start items-center">
          <button 
            onClick={handleOpenCV}
            className="download-cv-btn cursor-pointer hover:opacity-80 transition-opacity"
          >
            View My CV
          </button>
        </div>
        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <div key={index} className="icon">
              <img src={socialImg.imgPath} alt="social icon" />
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Taki Eddine El Attari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
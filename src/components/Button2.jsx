const Button2 = ({ name, isBeam = false, containerClass, onClick }) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (name === "Contact Me") {
        // Scroll to contact section smoothly
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const offset = window.innerHeight * 0.15;
          const top = contactSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    };

    return (
      <button className={`btn ${containerClass}`} onClick={handleClick}>
        {isBeam && (
          <span className="relative flex h-3 w-3">
            <span className="btn-ping"></span>
            <span className="btn-ping_dot"></span>
          </span>
        )}
        {name}
      </button>
    );
  };
  
  export default Button2;
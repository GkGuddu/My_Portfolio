import TiltCard from "./TiltCard";

export default function Home() {
  return (
    <section id="home" className="adri-hero" aria-labelledby="hero-heading">
      <div className="adri-hero-copy reveal-3d">
        <p className="adri-eyebrow">MERN STACK DEVELOPER || FULL-STACK DEVELOPER</p>
        <h1 id="hero-heading">Hey, I’m Guddu.</h1>
        <p className="adri-hero-description">I build thoughtful web applications that turn ideas into meaningful digital experiences.</p>
        <a className="adri-button adri-button-pink" href="#contact">Work with me <span aria-hidden="true">↗</span></a>
        <a className="adri-text-link hero-work-link" href="#projects">Explore my work <span aria-hidden="true">↓</span></a>
      </div>
      <div className="adri-hero-photo reveal-3d">
        <TiltCard className="adri-portrait" intensity={4}>
          <img src={`${import.meta.env.BASE_URL}Profile-white-shirt.png`} alt="Guddu Kumar, MERN stack developer" width="768" height="840" fetchPriority="high" />
        </TiltCard>
        <p className="portrait-caption"><span>Based in India</span><span>Code with care.</span></p>
      </div>
    </section>
  );
}

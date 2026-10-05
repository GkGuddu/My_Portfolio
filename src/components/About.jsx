import TiltCard from "./TiltCard";
import { usePortfolioContent } from "../use-portfolio-content";

export default function About() {
  const { content } = usePortfolioContent();
  return (
    <section id="about" className="adri-approach" aria-labelledby="about-title">
      <div className="adri-approach-visual">
        <div className="approach-orbit" aria-hidden="true" />
        <TiltCard className="approach-browser" intensity={5}>
          <div className="approach-browser-bar"><span aria-hidden="true">● ● ●</span><span>EstateHub — a project by Guddu</span></div>
          <img src={`${import.meta.env.BASE_URL}EstateHub.png`} alt="EstateHub real estate website, designed and developed by Guddu" loading="lazy" width="960" height="600" />
        </TiltCard>
        <div className="approach-code-note" aria-hidden="true"><span>&lt;/&gt;</span><p>A little curiosity.<br />A lot of possibility.</p></div>
        <p className="approach-caption">FROM AN IDEA TO SOMETHING REAL.</p>
      </div>
      <div className="adri-approach-copy reveal-3d">
        <h2 id="about-title">My Approach</h2>
        <div>
          <h3>Thoughtful development</h3>
          <p>I’m a web developer with a strong foundation in frontend technologies and the MERN stack. I care about the details that make an application feel intuitive, responsive, and easy to use.</p>
        </div>
        <div>
          <h3>Always learning</h3>
          <p>I’m sharpening my JavaScript skills to write cleaner, more efficient code. From the first interface to the systems behind it, I keep learning and building with purpose.</p>
        </div>
        <a className="adri-text-link" href={content.resumeUrl} download>Download my CV <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}

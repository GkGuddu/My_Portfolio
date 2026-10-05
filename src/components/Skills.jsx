import TiltCard from "./TiltCard";
import { usePortfolioContent } from "../use-portfolio-content";

const coreStack = ["MongoDB", "Express.js", "React.js", "Node.js"];

const getSkillIcon = (name, categories) => categories.flatMap((category) => category.skills).find((skill) => skill.name === name)?.icon;

export default function Skills() {
  const { content } = usePortfolioContent();
  const skillCategories = content.skills;
  return (
    <section id="skills" className="adri-skills" aria-labelledby="skills-title">
      <div className="skills-heading reveal-3d">
        <div><p className="adri-eyebrow">LEARNING. BUILDING. REFINING.</p><h2 id="skills-title">Skills<span aria-hidden="true">.</span></h2></div>
        <div className="skills-stack">
          <div className="skills-stack-icons" aria-hidden="true">{coreStack.map((name) => <span key={name}>{getSkillIcon(name, skillCategories)}</span>)}</div>
          <div><span className="skills-stack-label">MY CORE STACK</span><p>Made with MERN.</p></div>
        </div>
      </div>
      <div className="skills-card-grid">
        {skillCategories.map((category, index) => (
          <div className="skills-card-reveal reveal-3d" key={category.name} style={{ "--reveal-delay": `${index * 75}ms` }}>
            <TiltCard as="article" className={`skills-category skills-${category.tone}`} intensity={4}>
              <div className="skills-category-heading">
                <span className="skills-category-number" aria-hidden="true">0{index + 1} <span>↗</span></span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <ul className="skills-chip-list" aria-label={`${category.name} skills`}>{category.skills.map((skill) => <li key={skill.name}><span className="skills-chip-icon" aria-hidden="true">{skill.icon}</span><span>{skill.name}</span></li>)}</ul>
            </TiltCard>
          </div>
        ))}
      </div>
      <div className="skills-section-note"><p>From the first interaction to the final deployment.</p><a href="#projects">See these skills in action <span aria-hidden="true">↗</span></a></div>
    </section>
  );
}

import { SERVICES } from "../constants";

export default function Services() {
  return (
    <section id="services" className="adri-services" aria-labelledby="services-title">
      <div className="adri-services-heading reveal-3d">
        <p className="adri-eyebrow">LET’S MAKE IT HAPPEN</p>
        <h2 id="services-title">How I can help</h2>
        <p>Thoughtful interfaces. Reliable systems. From the first idea to the final interaction.</p>
        <a className="adri-text-link" href="#contact">Let’s talk ↗</a>
      </div>
      <div className="adri-service-list reveal-3d">
        {SERVICES.map((service, index) => <details key={service.title} open={index === 0 ? true : undefined}>
          <summary><span>{service.title}</span><span className="service-disclosure" aria-hidden="true">+</span></summary>
          <p>{service.desc}</p>
        </details>)}
      </div>
    </section>
  );
}

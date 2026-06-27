import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import aboutPortrait from './assets/images/about-portrait.jpg';
import signature from './assets/images/signature.png';
import './assets/styles/HomePage.css';

const About = () => {
  return (
    <div className="home-page">
      <SiteHeader />

      <section className="about">
        <div className="container">
          <h2 className="section-title">About Gm'ar,t</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Gm'ar,t is a premiere online gallery showcasing artworks created by Farouk Gmar. An engineer by
                profession and a part time, and self taught artist by obsession.
              </p>
              <p>
                He has been drawing since childhood, beginning with graphite portraits created throughout his
                High school and college years. While studying and working as a textile engineer and an apparel
                developper, he developed a strong sense of composition, structure, and space, a foundation that
                continues to shape his paintings today.
              </p>
              <p>
                His return to art in 2020 was not a decision, but a necessity during his first quarantine at the
                pendamic times of covid 19 — a way to step into a quieter, safer inner world. What began as a
                personal refuge soon became a clear path. By 2025 he fully devoted himself to painting.
              </p>
              <p>
                Working primarily with land & seascapes, Farouk creates an emotional reflection of what he sees
                in nature. His work moves between stillness and intensity, clarity and searching, holding a
                quiet tension between storm and light. Whether it's the ocean waves, the snow on top of the
                mountains, the sky full of stars or the small flowers under the giant trees in a forest - his
                main inspiration is nature and landscapes.
              </p>
              <p>
                Light is the central force in most of his paintings. He started with northen lights, the moon
                and the stars, then sunset views, untill the reflection of the sun rays on the waves. It does
                not simply illuminate, it transforms. It becomes a subtle guide within each piece, carrying a
                sense of movement, hope, and direction.
              </p>
              <p>
                His main styles are modern art and realism. What he does sometimes is something in between!
              </p>
              <p>
                His collection spans various sizes and shades, ensuring there's a balance between day and night,
                sky, ocean and earth, for every taste and aesthetic preference. Each piece is authenticated and
                comes with a certificate of authenticity.
              </p>
              <blockquote className="about-quote">
                "I paint because I enjoy it, because sometimes it's an escape from life, but most importantly
                because painting makes me always feel free, and I can reflect my emotions and thoughts into
                color combinations and brushstrokes. Even when I'm away from my canvas, I still carry my
                sketchbook everywhere with me and sketch whatever inspires me."
              </blockquote>
              <img src={signature} alt="Farouk Gmar signature" className="about-signature" />
            </div>
            <div className="about-image">
              <div className="image-frame">
                <img src={aboutPortrait} alt="Farouk Gmar in his studio" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default About;

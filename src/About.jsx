import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import aboutPortrait from './assets/images/about-portrait.jpg';
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
                Whether it's the ocean waves, the snow on top of the mountains, the sky full of stars or the
                small flowers under the giant trees in a forest - my main inspiration is nature and landscapes.
              </p>
              <p>
                My favourite styles are modern art and realism. What I feel like I do sometimes is something
                in between!
              </p>
              <p>
                I paint because I enjoy it, because sometimes it's an escape from life, but most importantly
                because painting makes me always feel free, and I can reflect my emotions and thoughts into
                color combinations and brushstrokes. Even when I'm away from my canvas, I still carry my
                sketchbook everywhere with me and sketch whatever inspires me. My curated collection spans
                various sizes and shades, ensuring there's a balance between day and night, sky, ocean and
                earth, for every taste and aesthetic preference. Each piece is authenticated and comes with a
                certificate of authenticity.
              </p>
              <p>
                Welcome to my small world and enjoy!
              </p>
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

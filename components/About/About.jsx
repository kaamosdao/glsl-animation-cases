import HoverAnimation from '../HoverAnimation';
import s from './About.module.scss';

export default function About() {
  return (
    <div className={s.container}>
      <p>
        Hey, my name is Alexander. Currently i&apos;m learning Threejs, GSAP and
        glsl shaders. This project will contain some animations. Mostly inspired
        by Yuri Artiukh youtube channel.
      </p>
      <p>My contacts:</p>
      <ul className={s.contacts}>
        <li>
          <span>email: </span>
          <HoverAnimation color="var(--blue)">
            <a
              className={s.contactLink}
              type="email"
              href="mailto:kaamosdao@gmail.com"
            >
              kaamosdao@gmail.com
            </a>
          </HoverAnimation>
        </li>
        <li>
          <span>telegram: </span>
          <HoverAnimation color="var(--blue)">
            <a className={s.contactLink} href="https://t.me/kaamosdao">
              https://t.me/kaamosdao
            </a>
          </HoverAnimation>
        </li>
        <li>
          <span>instagram: </span>
          <HoverAnimation color="var(--blue)">
            <a
              className={s.contactLink}
              href="https://www.instagram.com/kaamosdao/"
            >
              kaamosdao
            </a>
          </HoverAnimation>
        </li>
        <li>
          <span>twitter: </span>
          <HoverAnimation>
            <a className={s.contactLink} href="https://twitter.com/kaamosdao">
              kaamosdao
            </a>
          </HoverAnimation>
        </li>
      </ul>
    </div>
  );
}

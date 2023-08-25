import s from './page.module.scss';

export default function Home() {
  return (
    <main className={s.main}>
      <div className={s.description}>
        <p className={s.text}>Template is working!</p>
      </div>
    </main>
  );
}

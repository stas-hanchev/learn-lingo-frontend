import Image from 'next/image'
import styles from './page.module.css'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import { publicPath } from '@/lib/publicPath'

export default function Home() {
    return (
        <>
        <main className={styles.main}>
            <section className={styles.hero}>
                <div className={styles.container}>
                  <div className={styles.hero_content}>
                    <h1 className={styles.hero_title}>Unlock your potential with the best <span className={styles.hero_title_highlight}>language</span> tutors</h1>
                    <p className={styles.hero_description}>Embark on an Exciting Language Journey with Expert Language<br/>Tutors: Elevate your language proficiency to new heights by<br/>connecting with highly qualified and experienced tutors.</p>
                    <Link href="/teachers" className={styles.cta_button}>
                      Get started
                    </Link>
                  </div>
                  <Image className={styles.hero_image} src={publicPath('/hero_image.png')} alt="Hero Image" width={568} height={530} />
                </div>
            </section>
        </main>
        <Footer />
        </>
    )
}

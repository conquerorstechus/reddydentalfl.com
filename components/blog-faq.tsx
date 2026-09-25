import type { BlogFaq } from "@/lib/blog/types";
import styles from "@/app/blog/blog.module.css";

export function BlogFaqSection({ faqs }: { faqs: BlogFaq[] }) {
  if (faqs.length === 0) return null;

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      <dl className={styles.faqList}>
        {faqs.map((faq) => (
          <div key={faq.question} className={styles.faqItem}>
            <dt className={styles.faqQuestion}>{faq.question}</dt>
            <dd className={styles.faqAnswer}>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

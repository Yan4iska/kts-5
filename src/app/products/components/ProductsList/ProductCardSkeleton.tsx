import styles from './ProductsList.module.scss';

export default function ProductCardSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonBody}>
        <div className={`${styles.skeletonLine} ${styles.skeletonLine_title}`} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLine_short}`} />
        <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
          <div className={styles.skeletonLine} style={{ flex: 1 }} />
          <div className={styles.skeletonLine} style={{ width: 600 }} />
        </div>
      </div>
    </div>
  );
}

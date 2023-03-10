import { useEffect } from 'react';

import Button from '@components/Button';
import { Loader } from '@components/Loader';
import { RepoPageStore } from '@store/RepoPageStore';
import { useLocalStore } from '@store/useLocalStore';
import getFormatLink from '@utils/getFormatLink';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';

import { eye, fork, link, star } from './icon';
import styles from './RepoPage.module.scss';

const RepoPage = () => {
  const { owner, name } = useParams();
  const store = useLocalStore(() => new RepoPageStore());

  const navigate = useNavigate();

  useEffect(() => {
    if (owner && name) {
      store.getRepoInfo({ owner, name });
    }
  }, [name, owner, store]);

  return (
    <div className={styles.container}>
      {store.isLoading && <Loader />}
      {!store.info ? (
        <div style={{ display: store.isLoading ? 'none' : 'block' }}>There is no repository, or it is private</div>
      ) : (
        <div className={styles.repoInfo}>
          <div className={styles.header}>
            <Button backPage={true} className={styles.button} onClick={() => navigate(-1)}>
              <img className={styles.BackIcon} src={eye} alt="Eye Icon" />
              Back to previous page
            </Button>
            <span className={styles.headerText}>
              {store.info.ownerLogin}/{store.info.name}
            </span>
          </div>
          {store.info.homePage && (
            <div className={styles.homepageLink}>
              <img src={link} alt="Link Icon" />
              <a className={styles.link} href={store.info.homePage}>
                {' '}
                {getFormatLink(store.info.homePage)}{' '}
              </a>
            </div>
          )}
          <div>
            {store.info.topics.map((topic: string, index: number) => (
              <div key={index} className={styles.topic}>
                {topic}
              </div>
            ))}
          </div>
          <div className={styles.flexContainer}>
            <div className={styles.information}>
              <div>
                <img src={star} alt="Star Icon" /> <strong>{store.info.starCount}</strong> stars
              </div>
              <div>
                <img src={eye} alt="Eye Icon" /> <strong>{store.info.watchersCount}</strong> watching
              </div>
              <div>
                <img src={fork} alt="Fork Icon" /> <strong>{store.info.forks}</strong> fork
              </div>
            </div>
          </div>
          {store.info.readme ? (
            <div className={styles.readme}>
              <div className={styles.readmeText}>README.md</div>
              <div dangerouslySetInnerHTML={{ __html: store.info.readme! }} />
            </div>
          ) : (
            <div className={styles.readme}>
              <div className={styles.readmeText}>N0 README.md</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(RepoPage);

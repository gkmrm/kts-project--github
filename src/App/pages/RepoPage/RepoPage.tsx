import React, { useState, useEffect } from 'react';

import Button from '@components/Button';
import { Loader, LoaderSize } from '@components/Loader';
import { urls } from '@config/urlsCreator';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import eye from './icon//Eye.svg';
import fork from './icon/Fork.svg';
import link from './icon/Link.svg';
import star from './icon/Star.svg';
import styles from './RepoPage.module.scss';

interface IGithubResponse {
  name: string;
  owner: {
    login: string;
  };
  watchers_count: number;
  forks: number;
  stargazers_count: number;
  homepage: string;
  topics: [];
}

interface IRepoInfo {
  name: string;
  ownerLogin: string;
  watchers_count: number;
  forks: number;
  stargazers_count: number;
  readme: string | null;
  homepage: string;
  topics: [];
}

export const RepoPage = () => {
  const { owner, name } = useParams();
  const [repoInfo, setRepoInfo] = useState<IRepoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        if (owner && name) {
          const response = await axios.get(urls.repos({ owner, name }));
          const data: IGithubResponse = response.data;

          // Get the README.md
          const readmeResponse = await axios.get(urls.readme({ owner, name }), {
            headers: {
              accept: 'application/vnd.github.html',
            },
          });
          const readme: string = readmeResponse.data;

          setRepoInfo({
            name: data.name,
            ownerLogin: data.owner.login,
            homepage: data.homepage,
            watchers_count: data.watchers_count,
            forks: data.forks,
            stargazers_count: data.stargazers_count,
            topics: data.topics,
            readme: readme,
          });
        }
      } catch (error) {
        return (
          <p>
            <b>Error fetching data. Please try again later.</b>
          </p>
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [owner, name]);

  const formattedLink = (link: string) => link?.split('https://');

  return (
    <div className={styles.container}>
      {isLoading && <Loader size={LoaderSize.l} />}
      {!repoInfo ? (
        <div style={{ display: isLoading ? 'none' : 'block' }}>There is no repository, or it is private</div>
      ) : (
        <div className={styles.repoInfo}>
          <div className={styles.header}>
            <Button backPage={true} className={styles.button} onClick={() => navigate(`/repo/${owner}`)}>
              <img className={styles.BackIcon} src={eye} alt="Eye Icon" />
              Back to previous page
            </Button>
            <span className={styles.headerText}>
              {repoInfo.ownerLogin}/{repoInfo.name}
            </span>
          </div>
          {repoInfo.homepage && (
            <div className={styles.homepageLink}>
              <img src={link} alt="Link Icon" />
              <a className={styles.link} href={repoInfo.homepage}>
                {' '}
                {formattedLink(repoInfo.homepage)}{' '}
              </a>
            </div>
          )}
          <div>
            {repoInfo.topics.map((topic, index) => (
              <div key={index} className={styles.topic}>
                {topic}
              </div>
            ))}
          </div>
          <div className={styles.flexContainer}>
            <div className={styles.information}>
              <div>
                <img src={star} alt="Star Icon" /> <strong>{repoInfo.stargazers_count}</strong> stars
              </div>
              <div>
                <img src={eye} alt="Eye Icon" /> <strong>{repoInfo.watchers_count}</strong> watching
              </div>
              <div>
                <img src={fork} alt="Fork Icon" /> <strong>{repoInfo.forks}</strong> fork
              </div>
            </div>
          </div>
          {repoInfo?.readme && (
            <div className={styles.readme}>
              <div className={styles.readmeText}>README.md</div>
              <div dangerouslySetInnerHTML={{ __html: repoInfo.readme! }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

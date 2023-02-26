import React, { useState, useEffect } from 'react';

import Button from '@components/Button';
import { Loader, LoaderSize } from '@components/Loader';
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
  const [noInfoRepo, setNoInfoRepo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${name}`);
        const data: IGithubResponse = response.data;

        // Get the README.md, any уберу
        const readmeResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/readme`, {
          headers: {
            accept: 'application/vnd.github.html',
          },
        });
        const readme: any = readmeResponse.data;

        // Get the topics, any уберу
        const topicsResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/topics`, {
          headers: {
            accept: 'application/vnd.github+json',
          },
        });
        const topicsObj: any = topicsResponse.data;
        const topics: any = topicsObj.names;

        setRepoInfo({
          name: data.name,
          ownerLogin: data.owner.login,
          homepage: data.homepage,
          watchers_count: data.watchers_count,
          forks: data.forks,
          stargazers_count: data.stargazers_count,
          readme: readme,
          topics: topics,
        });
        setNoInfoRepo(false);
      } catch (error) {
        setNoInfoRepo(true);
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
      {noInfoRepo || !repoInfo ? (
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
              <a href={repoInfo.homepage}> {formattedLink(repoInfo.homepage)} </a>
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

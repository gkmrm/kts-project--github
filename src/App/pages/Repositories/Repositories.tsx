import React, { useState, KeyboardEvent } from 'react';

import Button from '@components/Button';
import { Card } from '@components/Card';
import { Input } from '@components/Input';
import { MultiDropdown } from '@components/MultiDropdown';
import { urls } from '@config/urlsCreator';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './Repositories.module.scss';
// import _ from 'lodash';

interface IGithubResponse {
  owner: {
    avatar_url: string;
    login: string;
    html_url: string;
  };
  name: string;
  updated_at: string;
  stargazers_count: number;
  id: number;
}

interface IRepositoryInfo {
  image: string;
  title: string;
  owner: string;
  htmlLink: string;
  updated: string;
  starCount: number;
  id: number;
}

export const Repositories = () => {
  const { owner } = useParams();
  const [inputValue, setInputValue] = useState(owner || '');
  const [repos, setRepos] = useState<IRepositoryInfo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);

  const fetchData = async () => {
    const data = (await axios.get(urls.orgs(inputValue) + nextPage)).data;
    const preFormatData = data.map((repo: IGithubResponse) => ({
      image: repo.owner.avatar_url,
      title: repo.name,
      owner: repo.owner.login,
      htmlLink: repo.owner.html_url,
      updated: repo.updated_at,
      starCount: repo.stargazers_count,
      id: repo.id,
    }));

    setRepos((prevState: IRepositoryInfo[]) => {
      return [...prevState, ...preFormatData];
    });
    setNextPage((prevState) => prevState + 1);

    if (preFormatData.length < 30) {
      setHasMore(false);
    }
  };

  const handleClick = () => {
    setHasMore(true);
    setNextPage(1);
    setRepos([]);
    navigate(`/repo/${inputValue}`);
    fetchData();
  };

  const keyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      setHasMore(true);
      setNextPage(1);
      setRepos([]);
      navigate(`/repo/${inputValue}`);
      fetchData();
    }
  };
  // useEffect = (() =>, [])
  // _.debounce(handleClick, 5000);

  const navigate = useNavigate();

  return (
    <div className={styles.gridContainer}>
      <div className={styles.inputContainer}>
        <Input
          placeholder="Enter organization name"
          value={inputValue}
          onChange={setInputValue}
          onKeyPress={keyPressHandler}
        />
        <Button onClick={handleClick} />
      </div>
      <div className={styles.DropdownTypes}>
        <span className={styles.DropdownTypesTitle}>Repositories</span>
        <MultiDropdown disabled={true} onChange={() => {}} value={[]} options={[]} pluralizeOptions={() => ''} />
      </div>
      <InfiniteScroll
        style={{ fontSize: '40px' }}
        className={styles.Item}
        dataLength={repos.length}
        next={fetchData}
        hasMore={hasMore}
        loader={''}
        endMessage={
          <p className={styles.ending_text}>
            <b>You looked at all the repositories!</b>
          </p>
        }
      >
        {repos.map((repo: IRepositoryInfo) => (
          <Card {...repo} onClick={() => navigate(`/repo/${repo.owner}/${repo.title}`)} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

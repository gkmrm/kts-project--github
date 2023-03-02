import React from 'react';

import getFormatDate from '@utils/getFormatDate';

import styles from './Card.module.scss';
import star from './Star.svg';

export type CardProps = {
  id: number;
  image: string;
  title: string;
  owner: string;
  htmlLink: string;
  updated: string;
  starCount: number;
  onClick?: React.MouseEventHandler;
};

export const Card: React.FC<CardProps> = ({ id, image, title, owner, htmlLink, updated, starCount, onClick }) => {
  return (
    <div className={styles['gitRepoTile']} onClick={onClick}>
      <img className={styles['avatar']} src={image} alt="Repository Avatar" />
      <div className={styles['description']}>
        <div className={styles['title']}>{title}</div>
        <a className={styles['link']} href={htmlLink}>
          {owner}
        </a>

        <div className={styles['info']}>
          <div>
            <span className={styles['star']}>
              <img src={star} alt="Star Icon" /> <span className={styles['star_count']}>{starCount}</span>
            </span>
          </div>
          <div className={styles['date']}>
            Updated &nbsp;
            {getFormatDate(updated)}
          </div>
        </div>
      </div>
    </div>
  );
};

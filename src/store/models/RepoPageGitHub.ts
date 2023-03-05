export interface IRepoPageGithubApi {
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

export interface IRepoPageGithubModel {
  name: string;
  ownerLogin: string;
  watchersCount: number;
  forks: number;
  starCount: number;
  homePage: string;
  topics: [];
  readme?: string;
}

export const normalizeRepoGithub = (repo: IRepoPageGithubApi): IRepoPageGithubModel => ({
  name: repo.name,
  ownerLogin: repo.owner.login,
  homePage: repo.homepage,
  watchersCount: repo.watchers_count,
  forks: repo.forks,
  starCount: repo.stargazers_count,
  topics: repo.topics,
});

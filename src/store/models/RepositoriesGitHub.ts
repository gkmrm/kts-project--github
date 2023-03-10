export interface IRepositoriesGithubApi {
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

export interface IRepositoriesGithubModel {
  image: string;
  title: string;
  owner: string;
  htmlLink: string;
  updated: Date;
  starCount: number;
  id: number;
}

export const normalizeRepositoriesGitHub = (repo: IRepositoriesGithubApi): IRepositoriesGithubModel => ({
  image: repo.owner.avatar_url,
  title: repo.name,
  owner: repo.owner.login,
  htmlLink: repo.owner.html_url,
  updated: new Date(repo.updated_at),
  starCount: repo.stargazers_count,
  id: repo.id,
});

import { BASE_URL } from './BASE_URL';

const createUrl = (url: string): string => `${BASE_URL}${url}`;

const urls = {
  repos: (params: { owner: string; name: string }): string => createUrl(`/repos/${params.owner}/${params.name}`),
  orgs: (params: { org: string; type: string }): string =>
    createUrl(`/orgs/${params.org}/repos?&type=${params.type}&page=`),
  readme: (params: { owner: string; name: string }): string =>
    createUrl(`/repos/${params.owner}/${params.name}/readme`),
};

export { createUrl, urls };

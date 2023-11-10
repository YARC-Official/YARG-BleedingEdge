import { graphql } from "@octokit/graphql";
import { GITHUB_API_ROOT } from "./const.js";

/**
 * @param {string} query 
 * @param {Object} variables 
 */
export async function GithubGraphQL(query, variables) {
    const data = await graphql(query, {
        ...variables,
        headers: {
            authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    return data;
}

/**
 * @param {string} path 
 */
export async function GithubRESTAPI(path) {
    return fetch(GITHUB_API_ROOT + path, {
        headers: {
            "Authorization": `token ${process.env.GITHUB_TOKEN}`
        }
    }).then(res => res.json());
}

/**
 * @param {string} repositoryAuthor 
 * @param {string} repositoryName 
 */
export async function GetLatestRelease(repositoryAuthor, repositoryName) {
    const data = await GithubRESTAPI(`repos/${repositoryAuthor}/${repositoryName}/releases/latest`);

    return data;
}

/**
 * 
 * @param {string} repositoryAuthor 
 * @param {string} repositoryName 
 * @param {string} branch 
 * @param {string} since 
 * @returns 
 */
export async function GetCommits(repositoryAuthor, repositoryName, branch, since) {
    const data = await GithubGraphQL(`
        query GetCommits($owner: String!, $repo: String!, $branch: String!, $since: GitTimestamp!) {
            repository(owner: $owner, name: $repo) {
                ref(qualifiedName:$branch) {
                target {
                ... on Commit {
                    history(first: 100, since:$since) {
                    nodes {
                        oid,
                        author {
                            user {
                                login
                            }
                        },
                        messageHeadline
                    }
                    }
                }
                }
            }
            }
        }
    `, {
        owner: repositoryAuthor,
        repo: repositoryName,
        branch,
        since
    });

    return data.repository.ref.target.history.nodes;
}

/**
 * @param {string} repositoryAuthor 
 * @param {string} repositoryName 
 * @param {string} branch 
 */
export async function GetLatestCommit(repositoryAuthor, repositoryName, branch = "main") {
    const data = await GithubRESTAPI(`repos/${repositoryAuthor}/${repositoryName}/commits/${branch}`);

    return data;
}
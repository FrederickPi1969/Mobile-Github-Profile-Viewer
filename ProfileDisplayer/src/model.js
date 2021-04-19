/*eslint-disable */
import { TOKEN } from '@env';  // eslint won't be able to find module @env
/* eslint-enable */

const nodeFetch = require('node-fetch');

const QUERY = `{
    user(login: "{:USER_LOGIN:}") {
      login
      name
      email
      avatarUrl
      bio
      websiteUrl
      createdAt
      updatedAt
      following(first: 100) {
        totalCount
        edges {
          node {
            login
            name
            avatarUrl
          }
        }
      }
      followers(first: 100) {
        edges {
          node {
            login
            name
            avatarUrl
          }
        }
      }
      repositories(first: 100) {
        edges {
          node {
            url
            name
            owner {
              login
            }
            description
          }
        }
      }
    }
}`;

/**
 * The Github user object, or data structure,
 * for storing users' information per requirement of assignment-3.0.
 */
export class GitUser {
  constructor(json) {
    this.parseResult(json);
  }

  parseResult(json) {
    const userData = json.data.user;
    this.userName = userData.name;
    this.userLogin = userData.login;
    this.email = userData.email;
    this.avatar = userData.avatarUrl;
    this.bio = userData.bio;
    this.createdAt = userData.createdAt;
    this.updatedAt = userData.updatedAt;
    this.followers = userData.followers;
    this.following = userData.following;
    this.repo = userData.repositories;
    this.website = userData.websiteUrl;
  }
}

/**
 * The workhorse function for the whole model in MVC.
 * It handles the core functionality of fetch user data
 * via sending post requests to github graphQL.
 * @param {String} userLogin query string, or the target github username (aka user login)
 * @param {String} AUTH authorization string to use graphql.
 * @returns
 */
const fetchData = async function
fetchData(userLogin, fetchCallback = nodeFetch, AUTH = TOKEN) {
  const url = 'https://api.github.com/graphql';
  const query = QUERY.replace(/\n/g, ' ').replace('{:USER_LOGIN:}', userLogin);
  const queryData = JSON.stringify({ query });
  let user;
  try {
    await fetchCallback(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `bearer ${AUTH}`,
      },
      body: queryData,
    }).then((response) => response.json()).then((data) => {
      if ('data' in data) {
        user = ('errors' in data) ? null : new GitUser(data);
      } else {
        // authorization is wrong
        user = null;
      }
    });
  } catch {
    // internet error
    user = null;
  }
  return user;
};

export const GIT_TOKEN = TOKEN;
export { fetchData };

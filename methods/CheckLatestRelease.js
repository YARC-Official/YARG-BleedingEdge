import { GetCommits, GetLatestRelease } from "../utils/Github.js";
import { YARG_DEVBRANCH, YARG_GAMEREPOSITORY, YARG_ORGANIZATIONNAME } from "../utils/const.js";
import * as core from '@actions/core';

const latestRelease = await GetLatestRelease("YARC-Official", "YARG-BleedingEdge");

const commits = await GetCommits(YARG_ORGANIZATIONNAME, YARG_GAMEREPOSITORY, YARG_DEVBRANCH, latestRelease.published_at);

/**
 * Takes all messages from commits and format them to the release message body;
 * @param {Object[]} commits 
 */
function formatMessages(commits) {
    return commits
    .map(commit => `\n* ${commit.messageHeadline} (@${commit.author.user.login})\n`)
    .join("");
};

if(commits.length <= 0) {
    
    core.setOutput("runBuild", false);

} else {

const messageBody = 
`Built using the commit https://github.com/YARC-Official/YARG/commit/${commits[0].oid}


### ⚠️ This build is an extremely early beta, so bugs are expected. ⚠️

If you want the most stable version, [click here](https://github.com/YARC-Official/YARG/releases).
Downloads are below.


## 📋 Changes

${formatMessages(commits)}
`;

    core.setOutput("runBuild", true);
    core.setOutput("messageBody", messageBody);
}
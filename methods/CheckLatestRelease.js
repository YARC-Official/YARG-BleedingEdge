import { GetCommits, GetLatestRelease, GetLatestCommit } from "../utils/Github.js";
import { BLEEDINGEDGE_REPOSITORYAUTHOR, BLEEDINGEDGE_REPOSITORYNAME, YARG_DEVBRANCH, YARG_GAMEREPOSITORY, YARG_ORGANIZATIONNAME } from "../utils/const.js";
import * as core from '@actions/core';

const latestRelease = await GetLatestRelease(BLEEDINGEDGE_REPOSITORYAUTHOR, BLEEDINGEDGE_REPOSITORYNAME);
const devCommits = await GetCommits(YARG_ORGANIZATIONNAME, YARG_GAMEREPOSITORY, YARG_DEVBRANCH, latestRelease.published_at);
const latestDevCommit = devCommits.commits[0];
const nightlyVersionName = `b${devCommits?.branchCommitCount}`;

function checkReleasePlatformBuild(release, platform = process.env.PLATFORM) {
    const assetName = `YARG_${nightlyVersionName}-${platform}`;

    const index = release.assets.findIndex(asset => 
        asset.name
        .toLowerCase()
        .startsWith(assetName.toLowerCase())
    );

    return index >= 0;
}

core.setOutput("macBuild", !checkReleasePlatformBuild(latestRelease, "MacOS"));
core.setOutput("windowsBuild", !checkReleasePlatformBuild(latestRelease, "Windows"));
core.setOutput("linuxBuild", !checkReleasePlatformBuild(latestRelease, "Linux"));

/**
 * Takes all messages from commits and format them to the release message body;
 * @param {Object[]} devCommits 
 */
function formatMessages(devCommits) {
    return devCommits
    .map(commit => `\n* ${commit.messageHeadline} (@${commit.author.user.login})\n`)
    .join("");
};

const messageBody = 
`Built using the commit https://github.com/${YARG_ORGANIZATIONNAME}/${YARG_GAMEREPOSITORY}/commit/${latestDevCommit?.oid}


### ⚠️ This build is an extremely early beta, so bugs are expected. ⚠️

If you want the most stable version, [click here](https://github.com/YARC-Official/YARG/releases).
Downloads are below.


## 📋 Commits

${formatMessages(devCommits.commits)}
`;

core.setOutput("messageBody", devCommits.commits.length > 0 ? messageBody : latestRelease.body);
core.setOutput("latestSHA", latestDevCommit?.oid);
core.setOutput("tagName", nightlyVersionName);
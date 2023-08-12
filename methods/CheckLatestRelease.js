import { GetCommits, GetLatestRelease, GetLatestCommit } from "../utils/Github.js";
import { YARG_BLEEDINGEDGEREPOSITORY, YARG_DEVBRANCH, YARG_GAMEREPOSITORY, YARG_ORGANIZATIONNAME } from "../utils/const.js";
import * as core from '@actions/core';

const latestRelease = await GetLatestRelease(YARG_ORGANIZATIONNAME, YARG_BLEEDINGEDGEREPOSITORY);
const latestDevCommit = await GetLatestCommit(YARG_ORGANIZATIONNAME, YARG_GAMEREPOSITORY, YARG_DEVBRANCH);
const devCommits = await GetCommits(YARG_ORGANIZATIONNAME, YARG_GAMEREPOSITORY, YARG_DEVBRANCH, latestRelease.published_at);

function FindIfLastestCommitHasBuild(release) {
    const sha = latestDevCommit.sha;
    const platform = process.env.PLATFORM;
    const assetName = `YARG_${sha}-${platform}`;

    const index = release.assets.findIndex(asset => 
        asset.name
        .toLowerCase()
        .startsWith(assetName.toLowerCase())
    );

    return index >= 0;
}

core.setOutput("runBuild", !FindIfLastestCommitHasBuild(latestRelease));

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
`Built using the commit https://github.com/YARC-Official/YARG/commit/${latestDevCommit.sha}


### ⚠️ This build is an extremely early beta, so bugs are expected. ⚠️

If you want the most stable version, [click here](https://github.com/YARC-Official/YARG/releases).
Downloads are below.


## 📋 Commits

${formatMessages(devCommits)}
`;

core.setOutput("messageBody", devCommits.length > 0 ? messageBody : latestRelease.body);
export const GITHUB_API_ROOT = "https://api.github.com/";

export const YARG_ORGANIZATIONNAME = process.env.REPOSITORY_AUTHOR || "YARC-Official";
export const YARG_GAMEREPOSITORY = process.env.REPOSITORY_NAME || "YARG";
export const YARG_DEVBRANCH = process.env.REPOSITORY_BRANCH || "dev";

export const BLEEDINGEDGE_REPOSITORYAUTHOR = process.env.BLEEDINGEDGE_REPOSITORYAUTHOR || YARG_ORGANIZATIONNAME || "YARC-Official";
export const BLEEDINGEDGE_REPOSITORYNAME = process.env.BLEEDINGEDGE_REPOSITORYNAME || "YARG-BleedingEdge";
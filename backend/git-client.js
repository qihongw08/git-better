import { Octokit } from "@octokit/rest";
import "dotenv/config";

if (!process.env.GIT_API_KEY) {
  console.error("Missing API key");
}

export const octokit = new Octokit({ auth: process.env.GIT_API_KEY });

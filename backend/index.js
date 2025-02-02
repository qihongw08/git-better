import { octokit } from "./git-client.js";
import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/get-pr", async (req, res) => {
  try {
    const response = await octokit.request(
      "/repos/qihongw08/git-better/pulls/comments"
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching pull request comments:", error);
    res.status(500).json({ error: "Failed to fetch pull request comments" });
  }
});

app.get("/get-branches", async (req, res) => {
  try { 
    const info = req.body;

    await octokit.request('GET /repos/{owner}/{repo}/branches', {
      owner: info.owner,
      repo: info.repo,
      headers: info.headers
    });
  } catch (error) {
    console.error("Error getting branches:", error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

app.get("/get-collaborators", async (req, res) => {
  try { 
    const info = req.body;

    await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
      owner: info.owner,
      repo: info.repo,
      headers: info.headers
    });
  } catch (error) {
    console.error("Error getting collaborators:", error);
    res.status(500).json({ error: "Failed to fetch collaborators" });
  }
});

app.post("/create-pr", async (req, res) => {
  try {
    const info = req.body;

    const response = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
      owner: info.owner,
      repo: info.repo,
      title: info.title,
      body: info.body,
      head: info.head,
      base: info.base,
      headers: info.headers,
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error("Error creating pull request:", error);
    res.status(500).json({ error: "Failed to create pull request" });
  }
});

app.patch("/update-pr", async (req, res) => {
  try {
    const info = {
      ...req.body
    };
  
    await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: info.owner,
      repo: info.repo,
      pull_number: info.pull_number,
      title: info.title,
      body: info.body,
      state: info.state,
      base: info.base,
      headers: info.headers
    });
  } catch (error) {
    console.error("Error updating pull request:", error);
    res.status(500).json({ error: "Failed to update pull request" });
  }
});

function getOwnerRepo(req, res) {
  exec('git remote get-url origin', (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to get remote URL.' });
    }

    const remoteUrl = stdout.trim();

    // Extract owner and repo from the URL
    const httpsPattern = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git/;
    const sshPattern = /git@github\.com:([^\/]+)\/([^\/]+)\.git/;

    let owner = null;
    let repo = null;

    if (httpsPattern.test(remoteUrl)) {
      const match = remoteUrl.match(httpsPattern);
      if (match) {
        owner = match[1];
        repo = match[2];
      }
    } else if (sshPattern.test(remoteUrl)) {
      const match = remoteUrl.match(sshPattern);
      if (match) {
        owner = match[1];
        repo = match[2];
      }
    }

    if (!owner || !repo) {
      return res.status(500).json({ error: 'Unable to parse remote URL.' });
    }

    res.json({ owner, repo });
  });
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

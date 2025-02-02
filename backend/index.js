import express from "express";
import { exec } from 'child_process';

const app = express();
const port = 3002;

let octokit;
let owner, repo;
console.log(10);

app.use(express.json());

// Endpoint to receive the token and perform GitHub API actions
app.post('/api/get-token', async (req, res) => {
  console.log(1);
  const { token } = req.body; // The token sent from the VSCode extension

  if (!token) {
    return res.status(400).send('Authorization token is required.');
  }

  try {
    console.log(token);
    // Initialize Octokit with the provided token
    const finalOctokit = new Octokit({
      auth: token, // Use the token to authenticate
    });

    // Return octokit
    octokit = finalOctokit;
    owner = getOwnerRepo()[0]; //gets the owner and repo
    repo = getOwnerRepo()[1];
  } catch (error) {
    console.error('Error with GitHub API:', error);
    res.status(500).send('Error interacting with GitHub API');
  }
});


console.log(owner);
console.log(repo);
app.get("/get", async (req, res) => {
  try {
    const response = await octokit.request(
      "/repos/{owner}/{repo}/pulls/comments"
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching pull request comments:", error);
    res.status(500).json({ error: "Failed to fetch pull request comments" });
  }
});

app.post("/create", async (req, res) => {
  try {
    const info = req.body;

    const response = await octokit.request("POST /repos/{owner}/{repo}/pulls", {
      owner: owner,
      repo: repo,
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

app.patch("/update", async (req, res) => {
  try {
    const info = {
      ...req.body
    };
  
    await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner: owner,
      repo: repo,
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
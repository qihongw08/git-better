import { Request, Response } from 'express';
import { exec } from 'child_process';

export function getStatus(req, res) {
  res.json({ status: "OK", message: "Server is running!" });
}

export function doSomething(req, res) {
  const { command } = req.body;
  res.json({ message: `Executed command: ${command}` });
}

export function getOwnerRepo(req, res) {
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

export async function createPullRequest(req, res) {
  const { owner, repo, title, head, base, body, maintainer_can_modify, draft } = req.body;

  const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, // Use a GitHub token for authentication
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  const data = {
    title,
    head,
    base,
    body,
    maintainer_can_modify,
    draft,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.message || 'Failed to create pull request' });
    }

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

import { Octokit } from '@octokit/action';
import { describe, expect, test } from 'vitest';

import { baseIssueMetadata, waitForClosedIssue } from './util';
import { deleteIssue } from '../src/util/issues';

const octokit = new Octokit();

const body =
`### URL section
Please add https://mangadex.org/!`;

describe('Existing source check', () => {
  test('Issue created for an existing source gets automatically closed', async () => {
    const createdIssue = await octokit.issues.create({
      ...baseIssueMetadata,
      title: '[Test] This should be closed since the source already exists',
      body: body,
      labels: ['enhancement', 'test'],
    });

    const issue = await waitForClosedIssue(octokit, createdIssue.data.number);

    expect(issue.data.state).toStrictEqual('closed');
    expect(issue.data.state_reason).toStrictEqual('not_planned');

    await deleteIssue(octokit, issue.data.node_id);
  });
});

// This file should contain the utility functions for the agent.
const AGENT_API_NAME = "AGENT_API_NAME";
let agent: any | null = null;

export function getAgent(): any | null {
  if (agent) {
    return agent;
  }

  agent = (window as any).foldspace.agent({
    apiName: AGENT_API_NAME,
  });

  return agent;
}

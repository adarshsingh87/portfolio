---
title: 'Agent, harness, interface, tools: what each one is and how much to care'
description: 'An agent is a model running tools in a loop. The harness runs that loop, the interface is where you watch it. Which layer actually decides the quality.'
date: 2026-10-26
tags: [ai, agents, tooling]
---

Ask five developers what Claude Code is and you'll get five answers. A model. An agent. A CLI. A VS Code extension. The thing that edits my files. Each answer is partly right, and the mix-up costs people time. They switch editors to fix a problem that lives in their tool setup, or blame the model for a mistake the harness made before the model ever saw the task.

We use coding agents every day at SmokeTrees. These are the four words I wish someone had pinned down for me earlier, and how much attention each one deserves.

## The model can't do anything

Start at the bottom. A language model is a function. Text goes in, text comes out. It can't read your files, run your tests, or open a browser. It keeps no memory between calls. On every call it sees exactly the text it's sent and nothing else.

That sounds obvious, but it changes how you read everything an agent does. When an agent "reads a file", the model didn't read anything. It wrote a short piece of structured text asking for the file. Some other program read the file and pasted the contents into the next call.

That other program is the harness. Before we get to it, we need tools.

## A tool is a request the model writes

A tool is a function the model is told about. It has a name, a description, and a schema for its input:

```ts
const readFile = {
  name: 'read_file',
  description:
    'Read a UTF-8 text file inside the project. Returns the contents with line numbers.',
  input_schema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
}
```

The model sees that definition as part of its prompt. When it decides it needs a file, it replies with a tool call instead of an answer:

```json
{ "name": "read_file", "input": { "path": "src/app.ts" } }
```

That reply is still just text. Nothing has happened yet. The model has asked, and the program on the other end decides whether to do it.

Two things follow from this. The description is a prompt. The model picks tools by reading their names and descriptions, so a vague description gets a tool used at the wrong moment or never used at all. And whatever the tool returns goes straight back into the model's context. A tool that dumps 40,000 lines of logs fills the window with noise, and the model reasons worse for the rest of the task.

## The harness runs the loop

The harness is the program around the model. It builds the prompt, sends it, reads the reply, runs any tool calls, appends the results, and sends everything again. Stripped down, it looks like this:

```ts
async function runAgent(task: string) {
  const messages: Message[] = [{ role: 'user', content: task }]

  while (true) {
    const reply = await callModel({ system, tools, messages })
    messages.push({ role: 'assistant', content: reply.content })

    if (reply.toolCalls.length === 0) return reply.text

    for (const call of reply.toolCalls) {
      const result = await runTool(call)
      messages.push({ role: 'tool', id: call.id, content: result })
    }
  }
}
```

That loop is an agent. Simon Willison's definition is the one I use: ["An LLM agent runs tools in a loop to achieve a goal."](https://simonwillison.net/2025/Sep/18/agents/) The model decides what to do next. The harness does it and reports back. The loop ends when the model replies without asking for anything.

The sketch is twenty lines. A real harness is tens of thousands, and very little of the extra code is about calling the model. It's about what goes into each call and what happens to each request:

- **The system prompt.** What the model is told about its job, its tools, and how to behave, before it sees your task.
- **Context files.** Claude Code reads `CLAUDE.md` and Codex reads `AGENTS.md`. The harness puts them in the prompt so your project's rules are there on every call.
- **Permissions.** `runTool` is where the harness decides whether `rm -rf` runs, asks you first, or gets refused. The model can ask for anything. The harness decides what happens.
- **Context management.** Long tasks overflow the window. The harness decides what to summarise, what to drop, and when.
- **The tool set.** Which tools exist, how each is described, and how much each one returns.

Two harnesses can call the same model and get very different work out of it, because they send it different text. That's why [Terminal-Bench](https://www.tbench.ai/leaderboard) ranks model and agent pairs instead of models alone.

## The interface is where you sit

The interface is the part you look at. A terminal UI, a VS Code panel, a desktop app, a web page, a Slack bot. It shows you what the agent is doing, takes your messages, and asks for your approval when the harness wants it.

The interface and the harness are separate, and you can mix them. Claude Code is one harness with several interfaces: the terminal, IDE extensions, a desktop app, and the web. It works the other way too. I do most of my agent work in T3 Code, an interface that drives Claude Code and Codex underneath. One window, two harnesses.

You can also drop the interface completely. `claude -p` and `codex exec` run the same agent headless, which is how you put one in a CI job. The agent still works. Nobody is watching it.

That gives a quick test for which layer something belongs to. If it still matters with no human watching, it's the harness or below. If it only matters because a human is watching, it's the interface.

## An agent isn't a fourth layer

"Agent" is the name for the whole running system: a model, inside a harness, with tools, working on a task. So when someone says the agent did something stupid, the useful next question is which part did it.

Maybe the model reasoned badly from good information. Maybe the harness fed it stale or partial information, or so much that the useful part got buried. Maybe a tool returned something misleading. Or the agent did fine and the interface showed it in a confusing way.

Each of those has a different fix, and only one of them is "use a better model".

## How much to worry about each

Here's how I'd rank them for someone who uses agents every day but isn't building one.

| Layer     | What it decides                                              | How much to care                                       |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| Model     | How well it reasons from what it's given                     | Use a current frontier model and stop agonising        |
| Harness   | What the model sees, and what its requests are allowed to do | A lot. Most of what you control lives here             |
| Tools     | What the agent can reach, and how much noise comes back      | A lot if you write them, a little if you install them  |
| Interface | How easily you can follow and steer the work                 | Pick the one you like reading and switch when you want |

**The model.** For day-to-day coding, the current frontier models are close enough that switching between them changes less than the arguments online suggest. Use a recent one and move up a tier when a task is hard. Don't spend a week benchmarking.

**The harness.** Spend your attention here, and most of it on configuring the harness you already have, not on picking a new one. Your `AGENTS.md` or `CLAUDE.md` is in the prompt on every call, so it's the most direct way you have to shape the agent's work. We put one in our [backend template](/blog/backend-template-for-developers-and-ai-agents) for exactly that reason. It lists our conventions, the commands that prove a change works, and the things the agent must not touch. Permissions belong here too. Decide what runs without asking, what needs a yes, and what runs in a sandbox, before an agent decides for you.

**Tools.** If you only install tools, the main risk is having too many. Every tool definition is text in the prompt on every call, and Anthropic's own [guide to writing tools](https://www.anthropic.com/engineering/writing-tools-for-agents) warns that too many or overlapping tools distract the agent. Turn off the MCP servers you aren't using. If you write tools, write them for a reader who takes every word literally. Name each one plainly, say when to use it and when not to, return the smallest result that answers the question, and make errors say what to try next. MCP is a protocol between harnesses and tool servers, which is why one tool works in any harness that speaks it. A lot of what I wrote about [building against a protocol instead of an API](/blog/api-vs-protocol-ondc) applies here.

**The interface.** Worry about this one least. An IDE extension might pass along your open file or selection, but that's the interface handing the harness more context, and pasting the same text in a terminal gets the same result. What the interface really changes is how fast you can read a diff, how many tasks you can run side by side, and how quickly you can stop an agent heading the wrong way. Those matter to you, but they're taste, not quality. Your context files and tools come with you, so switching costs you very little.

## When an agent gets it wrong

Look at the harness layer before anything else. Read what was in the prompt, what the tools returned, and what the agent was allowed to do. Most of the time the model made a reasonable call from bad or noisy input, and the fix is a line in `AGENTS.md`, a tighter tool, or a permission rule. Swapping the model is the expensive fix, and it's rarely the one you need.

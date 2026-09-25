---
title: 'Why we built a backend template for developers and AI agents'
description: 'A TypeScript starter that fixes the backend decisions once, so developers and coding agents can spend their time on business logic instead of conventions.'
date: 2026-09-25
slug: backend-template-for-developers-and-ai-agents
tags: [typescript, backend, ai]
---

Every new backend project starts the same way. Pick a framework, wire up the database, decide how errors get returned, argue about logging. We'd written that boilerplate enough times that it stopped being interesting, so we built a template that makes the decision once and keeps it.

[`node-template-ts`](https://github.com/smoke-trees/node-template-ts) is our TypeScript backend starter. It sits on top of two packages we maintain ourselves, [`@smoke-trees/postgres-backend`](https://github.com/smoke-trees/node-postgres-backend-core) and [`@smoke-trees/smoke-context`](https://github.com/smoke-trees/smoke-context), and gives us Express, TypeORM, Postgres, Swagger docs, and structured logging without anyone re-deciding how those pieces fit together. We built it for our own developers. Somewhere along the way it also became the reason AI agents write code in our repos that doesn't need a second pass.

## The base classes do the boring part

`postgres-backend` ships abstract classes for the CRUD layer: `BaseEntity`, `Dao<T>`, `Service<T>`, `ServiceController<T>`. The `Dao` class already has `read`, `readMany`, `create`, `update`, and `delete` implemented, so you only touch the raw database object when a query genuinely doesn't fit those five methods. `ServiceController` does the equivalent for routes. Dependency injection runs through Inversify, so a service doesn't construct its own DAO or reach for a global singleton, it gets handed what it needs.

Pair that with `generate.sh`. Run `./generate.sh EntityName` and you get an interface, a TypeORM entity, a DAO, a service, and a controller, all registered in `database.ts` and `setup.ts` for you. What used to be five files and two manual registration steps is one command. Need it somewhere other than the default `src/app/` folder? Pass a path and it generates there instead.

Every function in the codebase returns a `Result` or `ResultWithCount` object, an error flag, an `ErrorCode`, a message, and the payload, always in that shape. Nobody has to guess whether a given function throws or returns `null` on failure. Logging goes through `smoke-context`'s `log` object instead of `console.log`, in a fixed format that names the calling class and function, so a log line tells you where it came from without you having to go find it. The mechanics behind that request-scoped logging are covered in [Async context as a mental model, not just a library](/blog/async-context-mental-model).

Database columns are snake_case, code is camelCase, and the TypeORM decorators handle the mapping so nobody has to remember which is which. Swagger docs come from `@Documentation.addRoute()` decorators sitting right on the controllers, so the docs describe the actual code instead of some separate file that quietly goes stale.

Tests aren't bolted on afterward either. The template wires up Mocha and Chai with a database connection that's established before the suite runs, plus setup and teardown utilities already written, so a new entity gets real integration tests against real Postgres instead of a mocked-out approximation of one.

## Then I noticed what it does for the agents

An AI coding agent dropped into a repo it's never seen has to figure out your conventions by reading code: how errors come back, where logging goes, what a new entity should look like. It gets some of that right and some of it wrong, and the wrong parts tend to look just plausible enough that you don't catch them on a quick skim.

The template answers that question directly instead of making the agent guess. It ships an `AGENTS.md` and a `CLAUDE.md` that spell out naming conventions, column typing, the `Result` pattern, what each base class is for, and where the agent should stop. Migrations are explicitly off-limits. An agent can change an entity and say what migration that change needs, but writing the migration itself is left to a person. I don't want to re-explain that boundary every session, I want it written down once.

`generate.sh` matters here too, maybe more than it does for a human developer. Instead of asking an agent to write a controller, service, and DAO from scratch and hoping it lands on our patterns, we point it at the script. The scaffolding comes out correct by construction, and the agent's actual job shrinks to the part that needs judgment: the entity's fields and the business logic around them.

The `Result` pattern is the one I'd have least expected to matter for this. Give an agent an open-ended choice, throw here, return `undefined` there, wrap it in `{ success: false }` somewhere else, and it'll pick differently across files, sometimes within the same session. Take the choice away and there's nothing left to be inconsistent about. Code an agent writes against this template reads like code one of our developers wrote, because it's built out of the same fixed pieces.

Even the verification step is spelled out for the agent rather than left implicit. `AGENTS.md` tells it to run `pnpm run build` before considering a change done, and `npx prettier . --write` after, in that order. That's not a hint, it's the actual bar the code has to clear, and it's the same bar for the agent as it is for us.

## Why it matters at ten people

We don't have the headcount for one engineer to hold the tribal knowledge of how each individual project does things. A template means a new project starts with those decisions already made, and a new hire, or an agent, can read `AGENTS.md` and know the shape of the codebase before touching a single file. That's the part that scales for a team our size. We're not writing fewer lines of code per project, we're writing fewer decisions.

The same logic shows up when the backend has to work with a shared external contract. I wrote more about that distinction in [What building on ONDC taught me about the difference between an API and a protocol](/blog/api-vs-protocol-ondc): once the system is running, keeping those decisions consistent across services is what makes callbacks, transaction IDs, logs, and failure handling possible to reason about.

It saved our developers time first. The agents just happened to need the same thing.

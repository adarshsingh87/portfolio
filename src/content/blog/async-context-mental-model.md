---
title: 'Async context as a mental model, not just a library'
description: 'AsyncLocalStorage is really about how a value survives async boundaries — plus the rule for when context helps and when it hides real dependencies.'
date: 2026-09-10
tags: [nodejs, backend, architecture]
---

There's a specific kind of annoying bug that shows up in every backend eventually: you need a request ID to appear in a log line ten function calls deep, in code you didn't write, and the only two options anyone hands you are bad. Thread the ID through every function signature between here and there, polluting a dozen unrelated functions with a parameter they don't care about. Or stash it in a module-level variable and hope nothing else touches it before you're done, which works fine until two requests land at the same time and your "global" starts leaking one user's data into another user's logs.

I built Smoke Context to get out of that trap. But the useful part wasn't the library. It was understanding what async context actually is, because once that clicked, a lot of other things about how Node handles concurrency clicked with it. I later wrote about [how we turned that context model into a default in our backend template](/blog/backend-template-for-developers-and-ai-agents), so new services don't have to rediscover where context belongs.

## It's not a global. It's bound to the chain, not the process.

The mechanism under Smoke Context is Node's AsyncLocalStorage. The name undersells it a little, because it's not really about storage, it's about propagation. You set a value at the start of a request, and that value follows the request through every `await`, every promise, every callback, all the way down the call chain, without you passing it anywhere.

The part that took me a while to internalize is that it's not attached to the process. It's attached to the asynchronous lineage of a specific call. Two requests running through the same Express server, interleaved on the same event loop, each get their own isolated context. Request A's ID never bleeds into request B's log line, even though both are technically "in flight" on the same process at the same moment. That's the actual value. Not that you avoid passing a parameter, but that concurrency stops being a hazard for this particular kind of data.

## The mental model that actually helps

Forget the API for a second and think of it as an invisible parameter. Every function in the call chain quietly receives the current context, the same way it would if you'd threaded it through manually, except the compiler and runtime are doing the threading for you, following the async chain instead of the syntactic one.

That's the piece worth taking with you even if you never touch Node again. Go has the same idea in `context.Context`, deliberately passed through every function signature rather than hidden, which is a different tradeoff (explicit, verbose, impossible to lose track of) versus what AsyncLocalStorage gives you (implicit, quiet, easy to lose track of if you're not careful). OpenTelemetry's context propagation across services is solving the identical problem at a bigger scale: how do you keep a trace ID attached to a request as it hops across async boundaries, processes, and sometimes machines, without every function in the path having to know that tracing exists.

Once you see async context as "the answer to how a value survives across async boundaries without being passed explicitly," you can recognize the same shape in a lot of unrelated tools.

## Where it earns its keep, and where it doesn't

Building Smoke Context taught me where this pattern is genuinely the right tool and where it's a trap people reach for because it's convenient.

It's the right tool for cross-cutting observability data. Request IDs, trace IDs, the current user for audit logging, anything that every layer of the app might want to read but that has nothing to do with any layer's actual logic. That data doesn't belong in a function signature. Threading a trace ID through fifteen layers of business logic just to reach a log statement is noise, and async context removes exactly that noise.

It's the wrong tool for business data. I've seen the temptation to smuggle things like the current tenant ID or a feature flag through context instead of passing them as real parameters, because it's less typing. Don't. The moment you do that, you can no longer read a function's signature and know what it depends on. You have to go find where the context got set, somewhere upstream, possibly in a different file entirely, to understand what a function is actually doing. That's the same bug class as the global variable I was trying to avoid in the first place, just with better ergonomics hiding it.

The rule I landed on: if removing the value would only break logging, tracing, or debugging, context is fine. If removing it would break the actual business logic, it belongs in the function signature where anyone reading the code can see it.

That's really the whole idea behind Smoke Context. Not a clever trick, just a clean implementation of a pattern that shows up under a different name in almost every language that deals with concurrency, once you know to look for it.

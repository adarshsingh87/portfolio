---
title: 'What building on ONDC taught me about the difference between an API and a protocol'
description: 'No central author, callbacks instead of responses, defensive parsing — what changes when you integrate with a shared agreement instead of a service.'
date: 2026-09-15
tags: [ondc, systems, backend]
---

The first time I integrated with ONDC, I treated it like every other integration I'd done. Read the docs, map the fields, wire up the endpoints, ship it. That plan lasted about a week. Not because the documentation was bad, but because I was solving the wrong problem. I was building for an API. ONDC is a protocol. Those are not the same job.

## An API has one author. A protocol has none.

With a normal API, there's a company on the other end. If a field behaves strangely, you open a support ticket or read the changelog, because one team owns the contract and one team decides what it means. Ambiguity gets resolved by asking the people who wrote the thing.

A protocol like ONDC doesn't have that. It's a shared specification that buyer apps and seller apps implement independently, without a central service in the middle enforcing behavior. Nobody runs "the ONDC server" the way Stripe runs the Stripe API. There's a network of participants, each running their own systems, agreeing to speak the same schema. When you integrate, you're not talking to one implementation of the spec. You're talking to however many other teams decided to interpret it.

I built gift card integrations on both sides, buyer and seller, plus a B2B retail seller implementation. Same spec, three different seats at the table, and three different flavors of "technically compliant but not what I expected." I'd also helped shape the taxonomy for the gift card domain itself, the category structure that decides how a gift card gets described and discovered on the network in the first place. That gave me an angle most integrators don't get. I wasn't just consuming the spec, I'd argued over parts of it. It's a different kind of humbling to watch three separate teams implement a schema you helped write and still end up with three different interpretations of it.

## The requests don't come back. They come around.

The other adjustment was structural. Most APIs are request and response: you call, you wait, you get an answer on the same connection. ONDC is built on asynchronous callbacks. You send a search, and the response doesn't come back to you, it comes to a callback endpoint you registered, sometimes from a different participant than the one you called, sometimes later than you'd like.

That changes what "the integration is broken" means. It's rarely a stack trace. It's usually a callback that never arrived, or arrived with a transaction ID that doesn't match anything you're tracking, or arrived twice. You stop debugging your code and start debugging a conversation between two systems that don't share logs, don't share a timeline, and don't share an owner you can call.

## Every field is optional until proven otherwise

Working against one company's API, you can mostly trust the schema. The team that wrote the docs also wrote the validation, so the two tend to agree. On a protocol implemented by dozens of independent parties, that assumption is dangerous. Some participant somewhere will send you a field that's technically present but semantically empty, or omit something the spec calls mandatory, because their implementation shipped before that part of the spec was locked, or was just built by a team reading the same wall of text a little differently than you did.

The only sane response is defensive parsing everywhere and logging the raw payload before you touch it. Not your parsed model of what arrived. The literal bytes. When something breaks three integrations away from where you're standing, the raw payload is the only evidence that actually tells you the truth.

## One transaction ID, five services, zero shared logs

None of this happened inside one tidy application, either. The gift card integration ran across a set of internal microservices: one handling search, another handling order state, another sitting there just to catch callbacks and route them to whoever needed them next. A single ONDC transaction could touch four or five of our own services before it touched the network at all.

That's where the protocol problem and the microservice problem started to look like the same problem. Externally, I couldn't trust that a callback would arrive in order or arrive once. Internally, I couldn't afford to lose the transaction ID as a request hopped between services, or debugging would mean reconstructing a timeline from five separate log streams by hand. That internal propagation problem is exactly what I wrote [Smoke Context](/blog/async-context-mental-model) to solve, keeping a transaction ID attached to a request as it moved through the async chain inside our own services, so that when a callback from the network finally landed, I could grep one ID and see the entire path it had taken, not just the last hop.

## What this changes about how you build

Once that clicked, a few things followed naturally:

I stopped writing code that assumes success on the happy path and started writing code that assumes the network is a little bit hostile by default, not because anyone's acting in bad faith, but because independent implementations drift.

I got a lot more serious about idempotency. If a callback can arrive twice, or late, or out of order, your system has to be able to shrug that off instead of quietly double-processing an order.

And I started reading specs differently. Not "what does this field mean" but "what happens to my system if every participant on the network interprets this field slightly differently." That second question is the one that actually matters when you don't control the other side.

The interesting part is that this isn't unique to ONDC. Any time you're building against a specification instead of a service, whether it's SMTP, webhooks, or some other open standard, you inherit the same problem: you're not integrating with a product, you're integrating with everyone's best guess at a shared agreement. The scale is 3Cr+ transactions and 1M+ users a day moving through that agreement on ONDC. Treat it like an API and it'll work right up until it doesn't. Treat it like a protocol and you build the paranoia in from day one instead of learning it the hard way.

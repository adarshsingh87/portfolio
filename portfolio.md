# Portfolio Website Development Brief

## 1. Objective

Build a polished, production-ready personal portfolio website for **Adarsh Singh**, currently CTO at **SmokeTrees Digital**.

The website should position Adarsh as a strong technical leader and hands-on software engineer, while providing a clean way to showcase:

- Professional experience
- Technical skills
- Projects
- Engineering interests and expertise
- Open-source work
- Blog posts
- Contact information

The final website will be deployed to:

**adarshsingh87.com**

Contact email:

**me@adarshsingh87.com**

The final implementation should feel like a portfolio built by an experienced engineer — not a generic AI-generated developer portfolio.

---

# 2. Before Development: Grill Me

Before implementing the final website, use the available **grill-me skill** to identify and resolve ambiguities, missing information, weak content, and design/product decisions.

Do not blindly make assumptions where missing information could materially affect the quality of the portfolio.

The grilling process should investigate areas such as:

- Target audience
- Desired personal brand
- Whether the portfolio should emphasize CTO/leadership or hands-on engineering
- Preferred visual personality
- Whether professional experience should be presented in detail
- Project prioritization
- GitHub/open-source presentation
- Blog structure
- Contact/CTA strategy
- Whether testimonials or client work should be included
- Whether metrics/results are available for projects
- Whether a resume/CV should be downloadable
- SEO requirements
- Social links
- Missing project details
- Any other information required to make the website feel genuinely personal

Ask only questions that are useful. Avoid asking for information that can reasonably be inferred from this brief.

If information remains unavailable after the grilling process, use sensible placeholders or carefully written copy rather than inventing specific achievements, numbers, clients, or facts.

---

# 3. Personal Information

## Name

Adarsh Singh

## Current Role

CTO at SmokeTrees Digital

Company website:

https://smoketrees.in/

## Education

Computer Science, VIT Vellore

## GitHub

Username:

adarshsingh87

Profile:

https://github.com/adarshsingh87

## LinkedIn

https://www.linkedin.com/in/adarshsingh87/

## Website

https://adarshsingh87.com/

## Contact

me@adarshsingh87.com

---

# 4. Professional Positioning

The website should communicate that Adarsh is:

- A hands-on CTO
- A software engineer who works across the stack
- Experienced in building production systems
- Comfortable with product development, management and infrastructure/cloud
- Experienced with startups and client-facing engineering
- Interested in developer productivity and engineering quality
- Comfortable building everything from frontend applications to backend systems, integrations, automation, and cloud infrastructure

Avoid generic positioning such as:

> "Passionate developer who loves turning ideas into reality."

The copy should feel specific, understated, technical, and credible.

Do not exaggerate experience or invent accomplishments.

---

# 5. Technical Skills

Present skills in a visually interesting but restrained way.

## Frontend / Mobile

- React
- Next.js
- Tailwind CSS
- React Native
- Flutter

## Backend

- Go
- JavaScript
- TypeScript
- Express
- Hono
- Flask

## Databases

- PostgreSQL / PSQL

## Cloud / Deployment

- AWS
- Azure
- Vercel
- Cloudflare where appropriate for the portfolio infrastructure

## Development Tools

- Arch + Hyprland
- Neovim
- OpenCode

The technology list can be expanded if appropriate based on information discovered during the grilling process.

Do not turn the skills section into a wall of technology logos.

Prioritize technologies and concepts that communicate engineering breadth and experience.

---

# 6. Projects and Engineering Work

The following projects/work should be represented on the website.

## Smoke Context

A context-management library for Express.

Key concepts:

- Uses async storage
- Enables better request/context propagation
- Useful for log tracing
- Designed to work well in both monolithic/single-server systems and microservices architectures

Present this as an engineering/tooling project rather than simply another application.

---

## SmokeTrees Backend Template

A mildly opinionated backend project template.

Goals:

- Increase development speed
- Reduce common implementation errors
- Provide sensible defaults
- Give developers a consistent starting point for backend projects

Avoid describing it as revolutionary or overly sophisticated.

---

## SmokeTrees Frontend Template

A mildly opinionated frontend project template based around Next.js.

Goals:

- Increase development speed
- Reduce common errors
- Establish sensible project conventions
- Provide a repeatable starting point for frontend projects

---

## Fomofy / MyFomo

Website:

https://myfomo.in/

An e-commerce platform focused on:

- Reducing scrolling fatigue
- Personalized recommendations
- Improving product discovery
- Creating a more focused shopping experience

Present this as a product-focused project rather than merely an e-commerce implementation.

---

## ONDC Integrations

Adarsh has worked with ONDC and successfully implemented applications for:

- Gift cards — buyer side
- Gift cards — seller side
- B2B retail seller implementation for a client

Where appropriate, explain the engineering complexity of integrating with an ecosystem such as ONDC without inventing specific implementation details.

---

## AI Chatbots

Experience building AI-powered chatbots for clients.

Do not invent specific models, architectures, user counts, or performance metrics unless they are subsequently provided.

---

## Shopify Integrations

Experience building Shopify connectors and applications for clients.

---

## Reconciliation & Financial Automation

Experience building:

- Reconciliation systems
- Operational automations
- Financial automations
- Workflow automation

The portfolio should communicate the practical business impact of this category of engineering without fabricating metrics.

---

## Other Applications

Experience includes building:

- Learning management systems
- CRM systems
- Employee rewards and recognition software
- Other custom business applications

These can be grouped into an **Other Work** or **Selected Experience** section if displaying each as an individual project would make the portfolio unnecessarily long.

---

# 7. Blog System

Create a blog section as part of the portfolio.

The blog should support posts written in **Markdown**.

No CMS or database is required.

The intended workflow is:

1. Create a Markdown file in the codebase.
2. Add frontmatter/metadata.
3. Build/deploy the website.
4. The post appears automatically on the blog.

The exact implementation is up to the agent, but it should be simple and maintainable.

A blog post should support at least:

- Title
- Description/excerpt
- Publication date
- Slug
- Tags/categories
- Markdown content

The blog UI should follow the same visual language as the selected portfolio design.

Markdown rendering should support common technical-writing requirements such as:

- Headings
- Paragraphs
- Lists
- Links
- Inline code
- Code blocks
- Blockquotes
- Tables where practical
- Images where practical

Code blocks should have appropriate syntax highlighting if feasible.

The blog should feel like part of the portfolio rather than a separate application.

---

# 8. Design Exploration

Create **five distinct portfolio design templates** before selecting the final one.

The five designs must be genuinely different visual systems, not the same page with five different color palettes.

---

## Template 1 — Neumorphism

Follow the design language specified in:

Neumorphism.md

Use the provided reference document as the source of truth for the neumorphic design direction.

The design should use neumorphic principles intentionally rather than simply adding large shadows to a conventional UI.

---

## Template 2 — Glassmorphism

Follow the design language specified in:

Glassmorphism.md

Use the provided reference document as the source of truth.

The implementation should feel like a deliberate glassmorphic interface rather than a generic dark website with transparency.

Pay attention to:

- Layering
- Blur
- Contrast
- Background composition
- Accessibility
- Readability

---

## Template 3 — Modern Minimal / Art-Directed

Create a highly polished contemporary portfolio with strong art direction.

This design can use:

- Bold typography
- Generous whitespace
- Subtle animations
- Strong visual composition
- Carefully selected accent colors
- Editorial-style project presentation

Avoid the common "developer portfolio" aesthetic of:

- Giant gradient blobs
- Excessive glass cards
- Random floating icons
- Overuse of rounded cards
- Generic AI-generated copy
- Excessive animations

---

## Template 4 and 5 is upto you, choose anything you feel fits this use case

---

# 9. Design Selection Process

All five designs should be implemented enough to make a meaningful comparison.

Each should include the major portfolio sections:

- Hero
- About
- Skills
- Selected projects
- Experience/work categories
- Blog preview
- Contact
- Footer

The goal is to compare actual working designs, not five static mockups.

After implementation, provide a concise comparison explaining:

- Visual identity
- Strengths
- Weaknesses
- Suitability for Adarsh's personal brand
- Mobile experience
- Content readability
- Long-term maintainability

Then recommend the strongest option.

Do not automatically assume the most visually flashy design is the best.

---

# 10. Copywriting

Use the available **unslop skill** whenever generating portfolio copy.

The writing must:

- Sound human
- Avoid generic AI phrasing
- Avoid exaggerated claims
- Avoid corporate buzzwords
- Avoid empty statements
- Be concise
- Be technically credible
- Reflect an experienced engineer
- Prefer concrete descriptions over adjectives

Avoid phrases such as:

- "passionate about technology"
- "turning ideas into reality"
- "building the future"
- "innovative solutions"
- "cutting-edge technology"
- "results-driven"
- "digital transformation"
- "leveraging the power of technology"

Unless there is a genuinely specific reason to use similar language.

The portfolio should sound like Adarsh wrote it — or like an excellent designer/editor helped him express his work.

---

# 11. SVGs and Visual Assets

Use **SVGL** when appropriate for technology/company/tool SVG assets.

Reference:

https://svgl.app/

Repository:

https://github.com/pheralb/svgl

Prefer official or appropriately licensed SVG assets.

Do not fill the portfolio with logos merely to demonstrate technology familiarity.

Technology logos should only be used where they improve comprehension or visual hierarchy.

---

# 12. Technical Requirements

## Framework

Build the website using:

**TanStack Start**

Use modern, idiomatic TanStack Start architecture.

## Styling

Use an appropriate styling solution compatible with the project, with a strong preference for maintainable, component-driven styling.

Tailwind CSS may be used where appropriate.

## Deployment

The website will be deployed to:

**Cloudflare**

Domain:

**adarshsingh87.com**

Design and implementation should take Cloudflare deployment/runtime considerations into account.

---

# 13. Architecture Expectations

Structure the project so that it is easy to maintain and extend.

Prefer:

- Reusable components
- Clear route organization
- Typed data structures
- Data-driven project/skill definitions
- Markdown-driven blog content
- Minimal duplication
- Sensible separation between content and presentation

Portfolio content should not be unnecessarily hardcoded throughout UI components.

For example, projects should ideally be represented through structured data and rendered by reusable project components.

---

# 14. Responsive Design

The website must work exceptionally well across:

- Mobile phones
- Tablets
- Laptops
- Large desktop displays

Do not treat mobile as an afterthought.

Pay particular attention to:

- Typography scaling
- Navigation
- Project cards/layouts
- Code/blog readability
- Horizontal overflow
- Touch targets
- Animations and motion
- Performance on mobile devices

---

# 15. Accessibility

Build the site with good accessibility practices.

Include:

- Semantic HTML
- Keyboard navigation
- Appropriate focus states
- Sufficient color contrast
- Meaningful link text
- Accessible navigation
- Appropriate heading hierarchy
- Alt text for meaningful images
- Reduced-motion support where animations are used

Do not sacrifice accessibility for visual effects.

---

# 16. Performance

The portfolio should be fast.

Prioritize:

- Minimal JavaScript where practical
- Optimized assets
- Efficient font loading
- Avoiding unnecessary dependencies
- Good rendering performance
- Minimal layout shift
- Appropriate caching
- Optimized images

The design should remain impressive without requiring excessive client-side animation or heavy libraries.

---

# 17. SEO

Implement sensible technical SEO.

Include:

- Page titles
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter/X metadata where appropriate
- Sitemap
- robots.txt
- Structured metadata where appropriate
- Proper semantic markup

The site should be optimized around the personal brand/name:

**Adarsh Singh**

and relevant terms such as:

- Software engineer
- CTO
- Full-stack engineer
- Software architecture
- React
- Next.js
- Go
- TypeScript
- Cloud
- Developer tooling

Only use keywords that are genuinely represented by the portfolio.

Do not keyword-stuff.

---

# 18. Professional Experience

The portfolio should communicate that Adarsh currently works as CTO at SmokeTrees Digital.

The presentation should balance:

- Technical leadership
- Hands-on engineering
- Architecture
- Product development
- Developer productivity
- Client/project delivery

Avoid creating an exaggerated executive persona if the actual work is heavily technical.

---

# 19. GitHub and LinkedIn

Include clear links to:

- GitHub: adarshsingh87
- LinkedIn: adarshsingh87

These should be easy to find but should not dominate the design.

Where useful, GitHub activity or selected repositories can be integrated, but do not introduce unnecessary runtime API dependencies just for the sake of showing contribution graphs.

---

# 20. Contact

Create a simple contact section.

Primary contact:

**me@adarshsingh87.com**

Include relevant social links.

A contact form is optional.

If a contact form is implemented, it must have a clear backend/email delivery strategy compatible with Cloudflare deployment.

Do not create a non-functional form that simply looks real.

---

# 21. Animations

Use animation deliberately.

Good candidates include:

- Page transitions
- Subtle entrance animations
- Hover states
- Project interactions
- Navigation transitions
- Scroll-based reveals where appropriate

Avoid:

- Excessive parallax
- Constant movement
- Distracting background animations
- Long page-load animations
- Animation on every component

---

# 22. Content Accuracy

This is critical.

Never fabricate:

- Companies
- Clients
- Job titles
- Dates
- Metrics
- Revenue
- User counts
- Performance improvements
- Open-source adoption
- Project URLs
- Awards
- Certifications
- Responsibilities
- Technologies not actually provided or confirmed

If additional information is needed, ask during the grilling phase.

---

# 23. Quality Bar

The final website should feel comparable to a carefully designed personal site belonging to a senior engineer/CTO.

It should **not** feel like:

- A generic portfolio template
- A Tailwind component showcase
- An AI-generated landing page
- A SaaS startup homepage
- A collection of cards
- A résumé dumped onto a webpage

The strongest qualities should be:

- Strong typography
- Clear information hierarchy
- Excellent spacing
- Distinctive visual identity
- Technical credibility
- Fast performance
- Excellent mobile UX
- Thoughtful micro-interactions
- Concise, human copy
- Easy maintainability

---

# 24. Deliverables

The development process should produce:

1. Five functional portfolio design variants.
2. A comparison of all five designs.
3. A recommended design.
4. A production-ready TanStack Start implementation of the selected design.
5. Markdown-based blog infrastructure.
6. Responsive layouts.
7. Accessibility considerations.
8. SEO configuration.
9. Cloudflare-compatible deployment configuration.
10. Clean, maintainable source code.
11. Seed content for the portfolio based only on the information provided or subsequently confirmed.
12. Clear instructions for adding future Markdown blog posts.
13. Any required setup/deployment documentation.

---

# 25. Definition of Done

The project is complete when:

- All five design directions have been meaningfully implemented.
- The five variants are visually and structurally distinct.
- The portfolio clearly communicates Adarsh's technical profile.
- Projects are presented professionally.
- The blog can be extended by adding Markdown files.
- The site is responsive.
- Accessibility basics are covered.
- SEO metadata is implemented.
- External links work correctly.
- The site can be deployed to Cloudflare.
- The final design does not contain fabricated claims.
- The UI feels intentionally designed rather than template-generated.
- The codebase is maintainable and understandable.
- The selected design is ready to be deployed at `adarshsingh87.com`.

---

# 26. Important Instructions for the Agent

Before making major design or content assumptions:

**Use the `grill-me` skill.**

When generating or rewriting portfolio copy:

**Use the `unslop` skill.**

When designing the visual language:

**Use `Neumorphism.md` for the neumorphism variant.**

**Use `Glassmorphism.md` for the glassmorphism variant.**

When technology/tool SVGs are useful:

**Consult SVGL:**

https://svgl.app/

Repository:

https://github.com/pheralb/svgl

Prioritize:

1. Authenticity
2. Technical credibility
3. Visual quality
4. Excellent UX
5. Performance
6. Accessibility
7. Maintainability

Do not optimize for feature count.

The final result should look like a thoughtful personal portfolio belonging to an experienced engineer and CTO.

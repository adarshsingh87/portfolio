# Icons — vendored from SVGL

All brand SVGs in this folder come from [SVGL](https://svgl.app/)
([repo](https://github.com/pheralb/svgl), MIT-licensed catalog).

- Tech icons: dark-mode variants chosen where SVGL offers light/dark pairs,
  since this portfolio is dark-only.
- Brand marks belong to their respective owners and are used here solely to
  identify technologies and profiles. No endorsement implied.
- `React Native` and `OpenCode` have no SVGL entry at the
  time of vendoring, so they render as text-only (React Native reuses React
  where an icon slot requires one).
- `Liquid Templating` (Shopify Liquid) has no standalone brand mark, so it
  renders as text-only.
- `archlinux.svg` and `hyprland.svg` come from
  [Simple Icons](https://simpleicons.org/) (CC0, no SVGL entry), recolored
  `fill="#e4e4e7"` for this dark-only site. Brand marks belong to their
  respective owners.

| File                | SVGL source                                            |
| ------------------- | ------------------------------------------------------ |
| `react.svg`         | `static/library/react_dark.svg`                        |
| `nextjs.svg`        | `static/library/nextjs_icon_dark.svg`                  |
| `tailwind.svg`      | `static/library/tailwindcss.svg`                       |
| `flutter.svg`       | `static/library/flutter.svg`                           |
| `go.svg`            | `static/library/golang_dark.svg`                       |
| `typescript.svg`    | `static/library/typescript.svg`                        |
| `javascript.svg`    | `static/library/javascript.svg`                        |
| `express.svg`       | `static/library/expressjs_dark.svg`                    |
| `hono.svg`          | `static/library/hono.svg`                              |
| `fastapi.svg`       | `static/library/fastapi.svg`                           |
| `langchain.svg`     | `static/library/langchain-logo.svg`                    |
| `kubernetes.svg`    | `static/library/kubernetes.svg`                        |
| `elasticsearch.svg` | Simple Icons `elasticsearch.svg` (recolored `#e4e4e7`) |
| `flask.svg`         | `static/library/flask-dark.svg`                        |
| `postgresql.svg`    | `static/library/postgresql.svg`                        |
| `mysql.svg`         | `static/library/mysql-icon-dark.svg`                   |
| `mongodb.svg`       | `static/library/mongodb-icon-dark.svg`                 |
| `aws.svg`           | `static/library/aws_dark.svg`                          |
| `azure.svg`         | `static/library/azure.svg`                             |
| `vercel.svg`        | `static/library/vercel_dark.svg`                       |
| `cloudflare.svg`    | `static/library/cloudflare.svg`                        |
| `tanstack.svg`      | `static/library/tanstack_dark.svg`                     |
| `github.svg`        | `static/library/github_dark.svg`                       |
| `linkedin.svg`      | `static/library/linkedin.svg`                          |
| `x.svg`             | `static/library/x_dark.svg`                            |
| `neovim.svg`        | `static/library/neovim.svg`                            |
| `archlinux.svg`     | Simple Icons `archlinux.svg` (recolored `#e4e4e7`)     |
| `hyprland.svg`      | Simple Icons `hyprland.svg` (recolored `#e4e4e7`)      |
| `nodejs.svg`        | `static/library/nodejs.svg`                            |
| `python.svg`        | `static/library/python.svg`                            |

To refresh: download the same paths from
`https://raw.githubusercontent.com/pheralb/svgl/main/static/library/` and keep
filenames stable — `src/components/icons.tsx` maps names to these files.

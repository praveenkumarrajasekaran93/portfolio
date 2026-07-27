# Resume template field guide

Your downloadable resumes are generated from **one master file** — `profile-data.js` —
poured into a **Word `.docx` template** you choose. This guide lists the merge fields
you can use when designing your own template.

## How it works

```
profile-data.js  (your details, edited in ONE place)
        │
        ▼   poured into the chosen template
templates/your-template.docx   (layout + {merge fields})
        │
        ▼
Downloaded resume  (editable .docx, always your latest details)
```

Edit your details in `profile-data.js` only. The website **and** every resume update
automatically — you never touch `index.html` for content again.

## Adding your own template (e.g. Amazon, Flipkart)

1. In **Microsoft Word** (or Google Docs → download as `.docx`), design the resume
   exactly how you want it to look.
2. Type the **merge fields** below where the data should appear (curly braces included).
3. Save the file into the **`templates/`** folder, e.g. `templates/amazon.docx`.
4. Add one entry to `resume-templates.js`:
   ```js
   { id: 'amazon', label: 'Amazon', description: 'Tailored to Amazon.',
     file: 'templates/amazon.docx', icon: '📦', isDefault: false }
   ```
5. Done — it appears in the download menu. No upload button, no rebuild.

> ⚠️ Keep each merge field inside a single, uniform run — i.e. type it in one go without
> changing font/size/bold **midway through the braces**. If Word splits `{fullName}` across
> formatting runs it won't be replaced. (Tip: type the field in plain text first, then
> format the whole field at once.)

## Simple fields

| Field | Becomes |
|---|---|
| `{fullName}` | Praveen Kumar Rajasekaran |
| `{title}` | DevOps Cloud Engineer |
| `{summary}` | Professional summary paragraph |
| `{email}` | Email address |
| `{phone}` | Phone number |
| `{location}` | City, region, country |
| `{linkedin}` | LinkedIn URL |
| `{github}` | GitHub URL |
| `{skillsInline}` | All tools as one line, separated by • |

## Repeating sections (loops)

Wrap the repeating block between an opening `{#name}` and closing `{/name}` tag.
Everything between them repeats once per item.

### Experience (with nested bullet loop)
```
{#experience}
{role} — {company}   ({dates})
{#bullets}{.}{/bullets}
{/experience}
```
- `{role}`, `{company}`, `{dates}` — per job
- `{#bullets}{.}{/bullets}` — one line per responsibility (`{.}` = the bullet text).
  Put this on a bulleted-list paragraph in Word to get real bullets.

### Skills, grouped
```
{#skillGroups}{label}: {items}{/skillGroups}
```
- `{label}` — group name (e.g. "devops tools")
- `{items}` — comma-separated tools in that group

### Projects
```
{#projects}{name} — {description} ({techInline}){/projects}
```
- `{name}`, `{description}`, `{techInline}` (comma-separated tech tags)

### Certifications
```
{#certifications}{name} — {detail}{/certifications}
```

### Education
```
{#education}{degree}, {field} — {institution} ({dates}){/education}
```
- also available: `{notesInline}` (e.g. "Graduated with distinction, GPA: 7.5")

## Starter templates included

- `templates/standard-ats.docx` — clean single column, ATS-friendly
- `templates/modern-two-column.docx` — sidebar + main column
- `templates/compact-one-page.docx` — condensed one page

Open any of them in Word to see the fields in a real layout, then copy/adapt.

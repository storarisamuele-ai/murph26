#!/usr/bin/env python3
"""Generate a page-based printable dossier from an existing Mission Brief."""

import argparse
import re
import sys
from pathlib import Path

# Page allocation per mission. Cards are matched by title text.
PAGE_ALLOCATIONS = {
    "mission-00": [
        [
            "Primary Mission Target",
            "Secondary Mission Objectives",
            "Honor Code",
            "Rules of Engagement",
            "Operation Protocol",
            "Authorized Standard",
        ],
        [
            "Safety Team",
            "Equipment Check",
            "Mission Intel",
            "Classified Notes",
        ],
    ],
    "mission-01": [
        [
            "MISSION IDENTIFICATION",
            "MISSION OBJECTIVE",
            "MISSION WORKOUT",
            "AUTHORIZED STANDARDS",
        ],
        [
            "MOVEMENT STANDARDS",
            "MISSION HAZARDS",
            "MISSION INTEL",
            "SCORECARD",
        ],
    ],
}


def extract_meta(html: str) -> dict:
    meta = {}

    # Header table (right side of the dossier header)
    table_match = re.search(
        r"<dl class='mb-document-table'>(.*?)</dl>", html, re.DOTALL
    )
    if table_match:
        for dt, dd in re.findall(
            r"<dt>(.*?)</dt>\s*<dd>(.*?)</dd>", table_match.group(1), re.DOTALL
        ):
            meta[dt.strip()] = re.sub(r"<[^>]+>", "", dd).strip()

    # Header meta row
    meta_match = re.search(
        r"<section class='mb-document-meta'>(.*?)</section>", html, re.DOTALL
    )
    if meta_match:
        for label, value in re.findall(
            r"<b>([^<]+)</b>\s*([^<]+)", meta_match.group(1), re.DOTALL
        ):
            clean = re.sub(r"<[^>]+>", "", value).strip()
            if clean:
                meta[label.strip()] = clean

    return meta


def extract_header(html: str) -> dict:
    header = {}

    # Logo
    logo_match = re.search(
        r"<img[^>]*class='mb-document-logo-mark'[^>]*>", html, re.DOTALL
    )
    if logo_match:
        src_match = re.search(r"src='([^']+)'", logo_match.group(0))
        header["logo_src"] = src_match.group(1) if src_match else ""
    else:
        header["logo_src"] = ""

    # Wordmark
    wordmark_match = re.search(
        r"<span class='mb-document-logo-wordmark'>(.*?)</span>", html, re.DOTALL
    )
    header["wordmark"] = wordmark_match.group(1).strip() if wordmark_match else ""

    # Title block
    title_block_match = re.search(
        r"<div class='mb-document-title'>(.*?)</div>", html, re.DOTALL
    )
    if title_block_match:
        block = title_block_match.group(1)
        h1_match = re.search(r"<h1>(.*?)</h1>", block, re.DOTALL)
        subtitle_match = re.search(
            r"<p class='mb-document-subtitle'>(.*?)</p>", block, re.DOTALL
        )
        header["title"] = h1_match.group(1).strip() if h1_match else ""
        header["subtitle"] = subtitle_match.group(1).strip() if subtitle_match else ""

        stamp_match = re.search(r"<img[^>]*class='mb-stamp'[^>]*>", block, re.DOTALL)
        if stamp_match:
            src_match = re.search(r"src='([^']+)'", stamp_match.group(0))
            header["stamp_src"] = src_match.group(1) if src_match else ""
        else:
            header["stamp_src"] = ""
    else:
        header["title"] = ""
        header["subtitle"] = ""
        header["stamp_src"] = ""

    return header


def extract_cards(html: str) -> list[tuple[str, str]]:
    cards = []
    for match in re.finditer(
        r"(<article\s+class='mission-card[^']*'[^>]*>.*?</article>)",
        html,
        re.DOTALL,
    ):
        card = match.group(1)
        title_match = re.search(
            r"<h2 class='mission-card-title'>(.*?)</h2>", card, re.DOTALL
        )
        title = title_match.group(1).strip() if title_match else ""
        cards.append((title, card))
    return cards


def build_header(header: dict) -> str:
    return f"""<header class="print-header">
  <div class="print-header-left">
    <img src="{header['logo_src']}" alt="Murph26" class="print-header__logo-mark">
    <span class="print-header__logo-wordmark">{header['wordmark']}</span>
  </div>
  <div class="print-header-center">
    <div class="print-title-wrapper">
      <h1 class="print-header__title">{header['title']}</h1>
      <h2 class="print-header__subtitle">{header['subtitle']}</h2>
    </div>
  </div>
  <div class="print-header-right">
    <img src="../assets/declassified-print-document.png" alt="DECLASSIFIED" class="print-declassified-stamp">
  </div>
</header>"""


def build_footer(meta: dict, total_pages: int) -> str:
    reference = meta.get("Reference", "—")
    archive = meta.get("Archive", "—")
    revision = meta.get("Revision", "—")
    classification = meta.get("Classification", meta.get("Security Level", "—"))

    return f"""<footer class="print-footer" data-total="{total_pages}">
  <ul class="print-footer__meta">
    <li>Ref: {reference}</li>
    <li>Archive: {archive}</li>
    <li>Rev: {revision}</li>
    <li>{classification}</li>
  </ul>
  <span class="print-footer__page"></span>
</footer>"""


def allocate_cards(
    cards: list[tuple[str, str]], mission_name: str
) -> list[list[tuple[str, str]]]:
    plan = PAGE_ALLOCATIONS.get(mission_name)
    if not plan:
        # Fallback: one card per page in order
        return [[card] for card in cards]

    lookup = {title.strip().casefold(): (title, html) for title, html in cards}
    pages = []
    for page_titles in plan:
        page = []
        for title in page_titles:
            key = title.strip().casefold()
            if key in lookup:
                original, html = lookup.pop(key)
                page.append((original, html))
            else:
                print(f"Warning: card '{title}' not found in source", file=sys.stderr)
        pages.append(page)

    # Place any unplanned cards on a new page, preserving original order
    if lookup:
        extra = [(original, html) for original, html in cards if original.strip().casefold() in lookup]
        if extra:
            pages.append(extra)
        print(
            f"Warning: {len(extra)} unplanned cards added to extra page(s)",
            file=sys.stderr,
        )

    return pages


def _rebuild_section_header(card_html: str, index: int) -> str:
    title_match = re.search(
        r"<h2[^>]*class=['\"]mission-card-title['\"][^>]*>(.*?)</h2>",
        card_html,
        re.DOTALL | re.IGNORECASE,
    )
    title = title_match.group(1).strip() if title_match else ""
    icon_match = re.search(
        r"<img[^>]*class=['\"]mission-card-icon['\"][^>]*>",
        card_html,
        re.IGNORECASE,
    )
    icon = icon_match.group(0) if icon_match else ""
    ref = f"SECT. {index:02d} — REF JTO-{index:02d}"
    return f'''<div class="section-header">
  <div class="section-icon">
    {icon}
  </div>
  <div class="section-heading">
    <div class="section-ref">{ref}</div>
    <h3>{title}</h3>
  </div>
</div>'''


def build_page(
    header: str,
    footer: str,
    cards: list[tuple[str, str]],
    start_index: int = 1,
) -> str:
    rebuilt_cards = []
    for i, (_, card) in enumerate(cards):
        new_header = _rebuild_section_header(card, start_index + i)
        new_card = re.sub(
            r"<header[^>]*class=['\"]mission-card-header['\"][^>]*>.*?</header>",
            new_header,
            card,
            count=1,
            flags=re.DOTALL | re.IGNORECASE,
        )
        rebuilt_cards.append(new_card)
    cards_html = "\n".join(rebuilt_cards)
    return f"""<section class="print-page">
{header}
  <main class="print-content">
{cards_html}
  </main>
{footer}
</section>"""


def generate_print_html(source_path: Path, output_path: Path) -> None:
    html = source_path.read_text(encoding="utf-8")

    # Remove any previously injected print document so it is not re-extracted
    html = re.sub(
        r'<div class="print-document"[^>]*>.*?</div>\s*</body>',
        "</body>",
        html,
        flags=re.DOTALL,
    )

    header = extract_header(html)
    meta = extract_meta(html)
    cards = extract_cards(html)

    if not cards:
        raise ValueError("No mission cards found in source file")

    mission_name = source_path.stem
    pages = allocate_cards(cards, mission_name)
    total_pages = len(pages)

    footer = build_footer(meta, total_pages)
    header_block = build_header(header)

    card_index = 1
    page_blocks = []
    for page in pages:
        page_blocks.append(build_page(header_block, footer, page, card_index))
        card_index += len(page)
    document = "\n".join(page_blocks)

    result = f"""<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{header['title']} | Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/print-dossier.css">
</head>
<body class="print-dossier">
  <div class="print-document">
{document}
  </div>
</body>
</html>
"""

    output_path.write_text(result, encoding="utf-8")
    print(f"Generated {output_path}")
    return document


def indent_html(html: str, spaces: int) -> str:
    prefix = " " * spaces
    return "\n".join(
        prefix + line if line.strip() else line for line in html.splitlines()
    )


def inject_into_source(source_path: Path, document_html: str) -> None:
    html = source_path.read_text(encoding="utf-8")

    # Add dedicated print stylesheet if missing
    if "print-dossier.css" not in html:
        html = html.replace(
            "</head>",
            '  <link rel="stylesheet" href="../css/print-dossier.css" media="print">\n</head>',
        )

    # Remove any previous print-document injected by this script
    html = re.sub(
        r'<div class="print-document"[^>]*>.*?</div>\s*</body>',
        "</body>",
        html,
        flags=re.DOTALL,
    )

    # Inject the page-based print document before </body>
    indented = indent_html(document_html, 4)
    html = html.replace(
        "</body>",
        f'  <div class="print-document" aria-hidden="true">\n{indented}\n  </div>\n</body>',
    )

    source_path.write_text(html, encoding="utf-8")
    print(f"Updated {source_path}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate a page-based printable dossier from a Mission Brief."
    )
    parser.add_argument("input", help="Source mission brief HTML file")
    parser.add_argument(
        "--output",
        "-o",
        help="Output file for the dedicated print page (defaults to <mission>-print.html)",
    )
    parser.add_argument(
        "--inline",
        "-i",
        action="store_true",
        help="Also embed the printable pages in the source HTML for Ctrl+P",
    )
    args = parser.parse_args()

    source = Path(args.input)
    if not source.exists():
        raise FileNotFoundError(f"Source file not found: {source}")

    output = (
        Path(args.output)
        if args.output
        else source.with_stem(f"{source.stem}-print")
    )

    document = generate_print_html(source, output)

    if args.inline:
        inject_into_source(source, document)


if __name__ == "__main__":
    main()

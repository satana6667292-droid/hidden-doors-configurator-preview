from pathlib import Path

p = Path('v33.html')
text = p.read_text(encoding='utf-8')
old = r"replace(/\\D/g,'')"
new = r"replace(/\D/g,'')"
if old not in text:
    raise SystemExit('Expected doubled RAL escape not found')
text = text.replace(old, new, 1)
p.write_text(text, encoding='utf-8')
print('Fixed RAL numeric input escape in v33.html')

export function formatCode(code: string) {
  const lines = code.split("\n");

  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

  const minIndent = lines.reduce((min, line) => {
    if (line.trim() === "") return min;
    const match = line.match(/^(\s*)/);
    const indent = match ? match[0].length : 0;
    return indent < min ? indent : min;
  }, Infinity);

  return lines
    .map((line) => line.slice(minIndent === Infinity ? 0 : minIndent))
    .join("\n");
}

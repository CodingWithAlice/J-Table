export type QuestionSegment =
    | { type: 'text'; content: string }
    | { type: 'code'; content: string };

export interface ParsedQuestion {
    boxLabel?: string;
    stem: string;
    segments: QuestionSegment[];
    shortTitle: string;
    hasCode: boolean;
}

export type HighlightKind = 'plain' | 'keyword' | 'string' | 'comment' | 'number' | 'punct';

export interface HighlightToken {
    type: HighlightKind;
    value: string;
}

const BOX_RE = /^【?\s*BOX\s*(\d+)\s*】?\s*/i;
const EXAMPLE_SPLIT_RE = /\s*(?:-{2,}|[—–－]+)(?:\s*(?:-{2,}|[—–－]+))*\s*/;
const CODE_START_RE = /(?:^|\s)(?=function\b|var\s+\w|let\s+\w|const\s+\w|class\s+\w|console\.|document\.|window\.|\(function\b|\(\s*function\b|```)/;
const LEADING_CODE_RE = /^(?:function\b|var\s+\w|let\s+\w|const\s+\w|class\s+\w|console\.|document\.|window\.|\(function\b|\(\s*function\b|```)/;
const CODE_HINT_RE = /\b(?:function|console\.(?:log|error|warn|info)|typeof|document\.|window\.|class\s+\w+|import\s+|export\s+|=>\s*\{)\b|\b(?:var|let|const)\s+\w+/;
const JS_KEYWORDS = new Set([
    'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
    'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'typeof',
    'instanceof', 'in', 'of', 'class', 'extends', 'this', 'void', 'delete', 'default',
    'true', 'false', 'null', 'undefined', 'async', 'await', 'yield', 'with',
]);

function looksLikeHtml(text: string): boolean {
    return /<\/?[a-zA-Z][\w-]*[\s>/]/.test(text);
}

function looksLikeCode(text: string): boolean {
    const s = text.trim();
    if (!s) return false;
    if (/```/.test(s) || LEADING_CODE_RE.test(s) || looksLikeHtml(s)) return true;
    if (CODE_HINT_RE.test(s) && /[{};()]/.test(s)) return true;
    const punct = (s.match(/[{};=()]/g) || []).length;
    return punct >= 5 && /[{}]/.test(s) && s.length > 24;
}

function cleanPart(text: string): string {
    return text.replace(/^[\s\-—–－]+/, '').replace(/[\s\-—–－]+$/, '').trim();
}

function formatCode(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (looksLikeHtml(trimmed)) return trimmed;
    if (trimmed.split(/\r?\n/).length >= 3) return trimmed.replace(/\t/g, '  ');
    return prettyPrintJs(trimmed);
}

function extractBox(title: string): { boxLabel?: string; rest: string } {
    const match = title.trim().match(BOX_RE);
    if (!match) return { rest: title.trim() };
    return {
        boxLabel: `BOX${match[1]}`,
        rest: title.trim().slice(match[0].length).trim(),
    };
}

function splitStemAndRest(text: string): { stem: string; rest: string } {
    const s = text.trim();
    if (!s) return { stem: '', rest: '' };
    if (LEADING_CODE_RE.test(s) && !/^[\u4e00-\u9fff]/.test(s)) {
        return { stem: '', rest: s };
    }

    const codeStart = s.search(CODE_START_RE);
    if (codeStart > 0) {
        const stem = s.slice(0, codeStart).trim();
        const rest = s.slice(codeStart).trim();
        if (stem && looksLikeCode(rest)) {
            return { stem, rest };
        }
    }

    if (looksLikeCode(s) && /^[\u4e00-\u9fff]/.test(s)) {
        const punct = s.search(/[？?！!。]\s+/);
        if (punct >= 0) {
            const stem = s.slice(0, punct + 1).trim();
            const rest = s.slice(punct + 1).trim();
            if (stem && looksLikeCode(rest)) return { stem, rest };
        }
    }

    return { stem: looksLikeCode(s) ? '' : s, rest: looksLikeCode(s) ? s : '' };
}

function consumeString(src: string, i: number): number {
    const quote = src[i];
    i += 1;
    while (i < src.length) {
        if (src[i] === '\\') {
            i += 2;
            continue;
        }
        if (src[i] === quote) return i + 1;
        i += 1;
    }
    return i;
}

/** 笔记里 `// 注释` 后面常常还接着下一句代码，只吃掉短标注。 */
function consumeInlineNote(src: string, i: number): number {
    i += 2;
    while (i < src.length && src[i] === ' ') i += 1;
    if (src[i] === "'" || src[i] === '"') {
        return consumeString(src, i);
    }
    while (i < src.length && !/[\s{};()]/.test(src[i])) i += 1;
    return i;
}

function isIdentStart(ch: string | undefined): boolean {
    return !!ch && /[A-Za-z_$]/.test(ch);
}

function prettyPrintJs(raw: string): string {
    const src = raw.replace(/\s+/g, ' ').trim();
    if (!src) return '';

    let out = '';
    let indent = 0;
    let paren = 0;
    let i = 0;
    let atLineStart = true;

    const pad = () => '  '.repeat(Math.max(indent, 0));
    const newline = () => {
        if (!out.length || out.endsWith('\n')) {
            atLineStart = true;
            return;
        }
        out += '\n';
        atLineStart = true;
    };
    const emit = (text: string) => {
        if (atLineStart) {
            out += pad();
            atLineStart = false;
        }
        out += text;
    };
    const skipSpaces = () => {
        while (i < src.length && src[i] === ' ') i += 1;
    };
    const peekWord = () => {
        let j = i;
        while (j < src.length && /[A-Za-z_$]/.test(src[j])) j += 1;
        return src.slice(i, j);
    };

    while (i < src.length) {
        const ch = src[i];
        const next = src[i + 1];

        if (ch === ' ') {
            i += 1;
            continue;
        }

        if (ch === '/' && next === '/') {
            const end = consumeInlineNote(src, i);
            emit(' // ' + src.slice(i + 2, end).trim());
            i = end;
            skipSpaces();
            newline();
            continue;
        }

        if (ch === '/' && next === '*') {
            const end = src.indexOf('*/', i + 2);
            const close = end >= 0 ? end + 2 : src.length;
            emit(src.slice(i, close));
            i = close;
            continue;
        }

        if (ch === "'" || ch === '"' || ch === '`') {
            const end = consumeString(src, i);
            emit(src.slice(i, end));
            i = end;
            continue;
        }

        if (ch === '{') {
            emit('{');
            indent += 1;
            i += 1;
            skipSpaces();
            newline();
            continue;
        }

        if (ch === '}') {
            indent = Math.max(indent - 1, 0);
            newline();
            emit('}');
            i += 1;
            skipSpaces();
            const follow = src[i];
            if (follow === ')' || follow === ';' || follow === ',') {
                continue;
            }
            const word = peekWord();
            if (word === 'catch' || word === 'else' || word === 'finally' || word === 'while') {
                emit(' ');
                continue;
            }
            newline();
            continue;
        }

        if (ch === '(') {
            paren += 1;
            emit('(');
            i += 1;
            continue;
        }

        if (ch === ')') {
            paren = Math.max(paren - 1, 0);
            emit(')');
            i += 1;
            skipSpaces();
            if (src[i] === '{') emit(' ');
            continue;
        }

        if (ch === ';') {
            emit(';');
            i += 1;
            skipSpaces();
            if (src[i] === '/' && src[i + 1] === '/') continue;
            if (src[i] === '}') continue;
            newline();
            continue;
        }

        if (ch === ',') {
            emit(',');
            i += 1;
            skipSpaces();
            if (paren === 0) newline();
            else emit(' ');
            continue;
        }

        if (ch === '=' && next !== '=' && next !== '>') {
            const prev = out[out.length - 1];
            if (prev && prev !== ' ' && prev !== '!' && prev !== '<' && prev !== '>' && prev !== '=') emit(' ');
            emit('=');
            i += 1;
            skipSpaces();
            emit(' ');
            continue;
        }

        if (ch === ':') {
            emit(':');
            i += 1;
            skipSpaces();
            emit(' ');
            continue;
        }

        if (isIdentStart(ch)) {
            const word = peekWord();
            emit(word);
            i += word.length;
            if (src[i] === ' ') {
                skipSpaces();
                if (src[i] && !/[;,)}.]/.test(src[i])) emit(' ');
            }
            if (src[i] === '(' && (word === 'if' || word === 'for' || word === 'while' || word === 'catch' || word === 'switch' || word === 'function')) {
                if (!out.endsWith(' ')) emit(' ');
            }
            if (src[i] === '{') {
                if (!out.endsWith(' ')) emit(' ');
            }
            continue;
        }

        emit(ch);
        i += 1;
    }

    return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function unwrapFence(text: string): string {
    const m = text.trim().match(/^```(?:\w+)?\n?([\s\S]*?)\n?```$/);
    return m ? m[1].trim() : text.trim();
}

function toSegment(text: string): QuestionSegment {
    const isCode = looksLikeCode(text);
    return {
        type: isCode ? 'code' : 'text',
        content: isCode ? formatCode(text) : text,
    };
}

export function parseQuestionTitle(title: string): ParsedQuestion {
    const raw = (title || '').trim();
    if (!raw) {
        return { stem: '', segments: [], shortTitle: '题目', hasCode: false };
    }

    const { boxLabel, rest } = extractBox(raw);
    const parts = rest.split(EXAMPLE_SPLIT_RE).map(cleanPart).filter(Boolean);

    let stem = '';
    const segments: QuestionSegment[] = [];

    parts.forEach((part, idx) => {
        const unfenced = unwrapFence(part);
        if (idx === 0) {
            const split = splitStemAndRest(unfenced);
            if (split.stem) stem = split.stem;
            if (split.rest) {
                segments.push(toSegment(split.rest));
            } else if (!split.stem) {
                segments.push(toSegment(unfenced));
            }
            return;
        }

        segments.push(toSegment(unfenced));
    });

    const hasCode = segments.some((s) => s.type === 'code');
    const shortTitle = [boxLabel, stem || (hasCode ? '代码题' : rest)].filter(Boolean).join(' ');

    return { boxLabel, stem, segments, shortTitle, hasCode };
}

export function highlightJs(code: string): HighlightToken[] {
    const tokens: HighlightToken[] = [];
    let i = 0;
    const push = (type: HighlightKind, value: string) => {
        if (!value) return;
        const last = tokens[tokens.length - 1];
        if (last && last.type === type) last.value += value;
        else tokens.push({ type, value });
    };

    while (i < code.length) {
        const ch = code[i];
        const next = code[i + 1];

        if (ch === '/' && next === '/') {
            const end = code.indexOf('\n', i);
            const close = end >= 0 ? end : code.length;
            push('comment', code.slice(i, close));
            i = close;
            continue;
        }
        if (ch === '/' && next === '*') {
            const end = code.indexOf('*/', i + 2);
            const close = end >= 0 ? end + 2 : code.length;
            push('comment', code.slice(i, close));
            i = close;
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            const end = consumeString(code, i);
            push('string', code.slice(i, end));
            i = end;
            continue;
        }
        if (/[0-9]/.test(ch)) {
            let j = i;
            while (j < code.length && /[0-9._]/.test(code[j])) j += 1;
            push('number', code.slice(i, j));
            i = j;
            continue;
        }
        if (isIdentStart(ch)) {
            let j = i;
            while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j += 1;
            const word = code.slice(i, j);
            push(JS_KEYWORDS.has(word) ? 'keyword' : 'plain', word);
            i = j;
            continue;
        }
        if (/[{}();,=]/.test(ch)) {
            push('punct', ch);
            i += 1;
            continue;
        }
        push('plain', ch);
        i += 1;
    }

    return tokens;
}

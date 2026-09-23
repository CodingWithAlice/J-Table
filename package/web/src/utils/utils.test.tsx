import { render } from '@testing-library/react';
import { renderTextWithLinks } from './utils';

function renderLinks(text: string) {
    return render(<>{renderTextWithLinks(text)}</>);
}

describe('renderTextWithLinks', () => {
    it('只把 [标题](url) 渲染成链接', () => {
        const answer = [
            '参考 [MDN JSON.stringify](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)',
            "fetch('https://example.com/api', options)",
        ].join('\n');

        const { container } = renderLinks(answer);
        const links = Array.from(container.querySelectorAll('a'));

        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAttribute(
            'href',
            'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify',
        );
        expect(links[0]).toHaveTextContent('MDN JSON.stringify');
        expect(container.textContent).toContain("fetch('https://example.com/api', options)");
        expect(container.textContent).not.toContain('](');
    });

    it('裸 URL 和题干都保持普通字符串', () => {
        const text = 'https://example.com/api 详见说明';
        const { container } = renderLinks(text);
        expect(container.querySelector('a')).toBeNull();
        expect(container.textContent).toBe(text);
    });

    it('一段里可以有多个 markdown 链接', () => {
        const { container } = renderLinks('见 [甲](https://a.example/1) 和 [乙](https://b.example/2)。');
        const links = Array.from(container.querySelectorAll('a'));
        expect(links.map((el) => el.textContent)).toEqual(['甲', '乙']);
        expect(links.map((el) => el.getAttribute('href'))).toEqual([
            'https://a.example/1',
            'https://b.example/2',
        ]);
        expect(container.textContent).toBe('见 甲 和 乙。');
    });
});

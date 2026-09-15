import { highlightJs, parseQuestionTitle } from './formatQuestionTitle';

const SAMPLE =
    "【BOX4】作业23：写出js代码的执行顺序。词法作用域的特点是什么？ function bar(){ console.log(myName); } function foo(){ var myName = 'hi 坑'; bar(); } var myName = 'bye 坑'; foo(); -- var name = \"global name\"; var obj = { name: 'Alice', getName: function() { console.log(this.name) } } var getName = obj.getName; getName(); -- --- (function(){ try{ console.log(1, a); // undefined var a=\"a\"; console.log(a); // 'a' b(); // 'b' c(); // Error function b(){ console.log(\"b\"); } var c=function(){ console.log(\"c\"); } console.log(\"d\"); // 没有被执行 }catch(e){ console.log('err') } })()";

describe('parseQuestionTitle', () => {
    it('splits box / stem / code examples for mixed JS notes', () => {
        const parsed = parseQuestionTitle(SAMPLE);
        expect(parsed.boxLabel).toBe('BOX4');
        expect(parsed.stem).toContain('作业23');
        expect(parsed.stem).toContain('词法作用域');
        expect(parsed.hasCode).toBe(true);
        expect(parsed.segments.filter((s) => s.type === 'code')).toHaveLength(3);

        const [first, second, third] = parsed.segments.map((s) => s.content);
        expect(first).toContain('function bar() {');
        expect(first).toContain('console.log(myName);');
        expect(first).toMatch(/function foo\(\) \{/);
        expect(second).toContain("name: 'Alice'");
        expect(third).toContain('try {');
        expect(third).toContain('} catch (e) {');
        expect(third).toContain('// undefined');
        expect(third).toContain("var a = \"a\";");
        expect(third.split('\n').length).toBeGreaterThan(8);
    });

    it('keeps existing newlines and strips leftover dash separators', () => {
        const title = `【BOX4】作业23：写出js 代码的执行顺序。词法作用域的特点是什么？
function bar(){
    console.log(myName);
}
--
—-
(function(){ console.log(1); })()`;
        const parsed = parseQuestionTitle(title);
        expect(parsed.segments).toHaveLength(2);
        expect(parsed.segments[0].content).toContain('function bar(){');
        expect(parsed.segments[1].content.startsWith('(function')).toBe(true);
    });

    it('keeps plain Chinese titles readable without inventing code blocks', () => {
        const parsed = parseQuestionTitle('【BOX1】请解释什么是闭包');
        expect(parsed.boxLabel).toBe('BOX1');
        expect(parsed.stem).toBe('请解释什么是闭包');
        expect(parsed.hasCode).toBe(false);
        expect(parsed.segments).toEqual([]);
    });

    it('highlights comments and strings', () => {
        const tokens = highlightJs("console.log('x'); // hi");
        expect(tokens.some((t) => t.type === 'string' && t.value.includes('x'))).toBe(true);
        expect(tokens.some((t) => t.type === 'comment' && t.value.includes('hi'))).toBe(true);
        expect(tokens.some((t) => t.type === 'keyword' && t.value === 'console') === false);
    });
});

import 'jsdom-global';
import {diff1} from './diff';
import { assert, expect } from 'chai';

const htmlToElement = <T extends HTMLElement>(str: string): T => Object.assign(document.createElement('div'), {innerHTML: str}).firstElementChild as T;

describe('Parent\'s first element child', () => {
  let parent: HTMLElement;
  let root: HTMLElement;
  let newRoot: HTMLElement;

  before(() => {
    parent = document.createElement('div');
    root = htmlToElement(`
      <div id="root">
        <h1>Heading</h1>
        <span>Test text</span>
      </div>
    `);
    parent.append(root);
    newRoot = htmlToElement(`
      <section id="root">
        <h1>Heading</h1>
        <span>Test text</span>
      </section>
    `);
    diff1(parent, root, newRoot);
  });

  it('should be different from root.', () => {
    expect(parent.firstElementChild).to.not.equal(root);
  });

  it('should be equal from newRoot.', () => {
    expect(parent.firstElementChild).to.equal(newRoot);
  });
});

describe('All the elements', () => {
  let parent: HTMLElement;
  let root: HTMLElement;
  let newRoot: HTMLElement;

  const newId = 'root2';
  const newHeading = 'Heading Changed';
  const newSpanText = 'Test text1';
  const newSpanClass = 'content';

  before(() => {
    parent = document.createElement('div');
    root = htmlToElement(`
      <div id="root">
        <h1>Heading</h1>
        <span>Test text</span>
      </div>
    `);
    parent.append(root);
    newRoot = htmlToElement(`
      <div id="${newId}">
        <h1>${newHeading}</h1>
        <span class="${newSpanClass}">${newSpanText}</span>
      </div>
    `);
    diff1(parent, root, newRoot);
  });
  it('should not change.', () => {
    expect(parent.firstElementChild).to.equal(root);
    assert.deepEqual((parent.firstElementChild as HTMLElement).children, root.children);
  });
  it('should change attributes or innerText.', () => {
    const root = parent.firstElementChild as HTMLElement;
    const h1 = root.children[0];
    const span = root.children[1];
    expect(root.id).to.equal(newId);
    expect(h1.textContent).to.equal(newHeading);
    expect(span.textContent).to.equal(newSpanText);
    expect(span.className).to.equal(newSpanClass);
  });
});
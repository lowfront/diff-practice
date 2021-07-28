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

describe('Attributes' , () => {
  let parent: HTMLElement;
  let root: HTMLElement;
  let newRoot: HTMLElement;
  const joinAttributes = (obj: {[key: string]: string}) => Object.keys(obj).map((key) => `${key}="${obj[key]}"`).join(' ');
  const sameLengthAttributes: {[key: string]: string} = {id: 'root-1', class: 'container-1', 'data-next': 'test-1'};
  const smallerLengthAttributes: {[key: string]: string} = {id: 'head-1'};
  const attrs2Array = (attrs: NamedNodeMap) => [...attrs as unknown as Attr[]];
  before(() => {
    parent = document.createElement('div');
    root = htmlToElement(`
      <div id="root" class="container" data-custom="test">
        <h1 class="center" title="title" name="title">Heading</h1>
        <span>Test text</span>
      </div>
    `);
    parent.append(root);
    newRoot = htmlToElement(`
      <div ${joinAttributes(sameLengthAttributes)}>
        <h1 ${joinAttributes(smallerLengthAttributes)}>Heading</h1>
        <span>Test text</span>
      </div>
    `);
    diff1(parent, root, newRoot);
  });

  it('should be changed in value.', () => {
    expect(parent.firstElementChild).to.equal(root); // 같은 엘리먼트 유지

    const attrs = attrs2Array((parent.firstElementChild as HTMLElement).attributes);
    attrs.forEach(attr => expect(attr.value).to.equal(sameLengthAttributes[attr.name]));
  });

  it('should be reduced and synchronized.', () => {
    const attrs = attrs2Array((parent.firstElementChild?.getElementsByTagName('h1')[0] as HTMLElement).attributes);
    expect(attrs.length).to.equal(1);
    attrs.forEach(attr => expect(attr.value).to.equal(smallerLengthAttributes[attr.name]));
  });
});
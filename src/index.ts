import {div, h1, span} from 'element-mold/dist/html';

const diff1 = (parent: HTMLElement, currentElement: HTMLElement, nextElement: HTMLElement) => {

  const attrsChanged = (el1: HTMLElement, el2: HTMLElement) => {
    if (el1.attributes.length !== el2.attributes.length) return true;
    else if (!el1.children.length && !el2.children.length && el1.textContent !== el2.textContent) return true;
    else if (Array.from(el1.attributes).some(({name, value}) => el2.getAttribute(name) !== value)) return true;
    return false;
  };

  const diff = (parent: HTMLElement, currentElement: HTMLElement, nextElement: HTMLElement) => {
    if (!currentElement && nextElement) parent.append(nextElement);
    else if (currentElement && !nextElement) return currentElement.remove();
    else if (currentElement.tagName !== nextElement.tagName) return currentElement.replaceWith(nextElement); // children 유지에 따른 performance차이 확인 필요
    else if (attrsChanged(currentElement, nextElement)) return currentElement.replaceWith(nextElement); // attribute만 업데이트 시키는 방법으로 개선

    const currentChildren = currentElement.children;
    const nextChildren = nextElement.children;
    const maxLength = Math.max(currentChildren.length, nextChildren.length);
  
    for (let i = 0; i < maxLength; i++) diff(currentElement, currentChildren[i] as HTMLElement, nextChildren[i] as HTMLElement);
  };

  diff(parent, currentElement, nextElement);
};

diff1(
  document.body,
  document.getElementById('test') as HTMLElement,
  div({id: 'test'}, [
    h1(['Title']),
    span({className: 'new-context'}, ['Text']),
  ]),
);

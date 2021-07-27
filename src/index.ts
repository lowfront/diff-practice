import {diff1} from './diff';
import {div, h1, span} from 'element-mold/dist/html';

let headRef;
let spanRef;
diff1(
  document.body,
  document.getElementById('test') as HTMLElement,
  div({id: 'test'}, [
    headRef = h1(['Title 10']),
    spanRef = span({className: 'new-context'}, ['Text']),
  ]),
);
console.log(headRef);
console.log(spanRef);
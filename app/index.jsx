const { updateElement, render, element } = require('../src/virtual-dom');

const log = e  => console.log(e.target.value);

const $root = document.getElementById('root');

const f = (
  <div>
    <button
      id="update"
      onClick={() => updateElement($root, g, f)}
    >Update</button>
    <ul style="list-style: none;">
      <li className="item" onClick={() => alert('hi!')}>item 1</li>
      <li className="item">
        <input type="checkbox" checked={true} />
        <input type="text" onInput={(e) => log(e)} />
      </li>
      <li forceUpdate={true}>text</li>
    </ul>
  </div>
);

const g = (
  <div>
    <button
      id="update"
      onClick={() => updateElement($root, g, f)}
    >Update</button>
    <ul style="list-style: none;">
      <li className="item item2" onClick={() => alert('hi!')}>item 1</li>
      <li style="background: red;">
        <input type="checkbox" checked={false} />
        <input type="text" onInput={(e) => log(e)} />
      </li>
      <li forceUpdate={true}>text</li>
    </ul>
  </div>
);


render(f, $root)

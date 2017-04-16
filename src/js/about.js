import nav from 'js/nav';
import 'styles/about';


const contentHtml = `
  ${nav()}
  <h2>About</h2>
`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = contentHtml;
});

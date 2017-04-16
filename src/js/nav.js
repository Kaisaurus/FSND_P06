import 'styles/nav';

export default () => `
<footer class="footer">
  <div class="container">
    <div class="content has-text-centered">
      <nav>
        <ul>
          <li>
            <a href="/">home</a>
          </li>
          <li>
            <a href="/about.html">about</a>
          </li>
        </ul>
      </nav>
      <p>
        The data used in this site is from  <a href="http://www.unhcr.org/" >The UN Refugee Agency</a>
        This project was made by Kai Gotoh as an assignment for the <a href="http://www.udacity.com" >Udacity</a> Nanodegree.
      </p>
      <p>
        <a class="icon" href="https://github.com/jgthms/bulma">
          <i class="fa fa-github"></i>
        </a>
      </p>
    </div>
  </div>
</footer>
`;

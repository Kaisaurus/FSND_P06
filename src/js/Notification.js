import 'styles/notification.scss';

export default class Notification {
  init() {
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('notification');
    this.containerDiv.classList.add('is-warning');
    this.containerDiv.classList.add('column');
    this.containerDiv.classList.add('is-half');
    this.containerDiv.classList.add('is-offset-one-quarter');
    this.containerDiv.classList.add('hide');
    this.containerDiv.addEventListener('click', () => {
      this.containerDiv.classList.add('hide');
    });

    this.closeBtn = document.createElement('button');
    this.closeBtn.classList.add('delete');
    this.closeBtn.addEventListener('click', () => {
      this.containerDiv.classList.add('hide');
    });

    this.contentDiv = document.createElement('div');
    this.contentDiv.classList.add('content');

    this.containerDiv.appendChild(this.contentDiv);
    this.containerDiv.appendChild(this.closeBtn);
    document.body.appendChild(this.containerDiv);
  }

  logError(error, location) {
    this.containerDiv.classList.remove('hide');
    const text = `ERROR: ${error} in ${location}`;
    this.contentDiv.innerHTML = text;
  }

  notify(notification) {
    this.containerDiv.classList.remove('hide');
    const text = `Alert: ${notification}`;
    this.contentDiv.innerHTML = text;
  }
}

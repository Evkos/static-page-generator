const fs = require('fs');

class HTMLProcessor {

  eventEmitter;
  data;
  content;

  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  setData = data => this.data = data;
  setStructure = content => this.content = content;

  run = () => {
    console.log(this.data);
    console.log(this.content);

    const path = this.data.slug.split('/');

    fs.mkdirSync(`public/${path[0]}`, { recursive: true });
    fs.writeFile(`public/${path[0]}/${path[1]}.html`, this.data.title, (err) => {
      if (err) {
        console.error(err.stack);
      }
    });


  };
}

module.exports = HTMLProcessor;
function loadEmbeds() {
  const style = document.createElement('link');
  style.href = 'https://assets.juicer.io/embed.css';
  style.media = 'all';
  style.rel = 'stylesheet';
  style.type = 'text/css';
  document.head.append(style);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://assets.juicer.io/embed.js';
  document.head.append(script);

  // const script = document.createElement('script');
  // script.type = 'text/partytown';
  // script.innerHTML = `
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   script.src = 'https://assets.juicer.io/embed.js';
  //   document.head.append(script);
  // `;
  // document.head.append(script);
  // window.dispatchEvent(new Event('ptupdate'));
}

loadEmbeds();

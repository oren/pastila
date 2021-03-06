const
  React = require('react'),
  qs = require('querystring');

module.exports = class AuthIframe extends React.Component {

  render () {
    const
      styles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      },
      query = {
        client_id: '4e73f807eaa53c1b7661',
        scope: 'gist',
        redirect_uri: 'http://localhost:5678/'
      },
      url = 'https://github.com/login/oauth/authorize?' + qs.stringify(query);
    return (
      <div style={styles} dangerouslySetInnerHTML={{__html: '<webview id="auth-component" src="' + url + '"></webview>'}}></div>
    );
  }
};

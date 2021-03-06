const
  React = require('react'),
  dispatcher = require('../dispatcher'),
  _ = require('lodash');

module.exports = class EditNoteForm extends React.Component {

  constructor(options) {
    super(options);
    const note = this.props.note;
    this.state = {
      fileName: this.getFileName(note),
      description: note ? note.description: ''
    };
    dispatcher.on('focus', this.focusForm.bind(this));
  }

  componentWillReceiveProps(props) {
    const note = props.note;
    if (note) {
      this.setState({
        fileName: this.getFileName(note),
        description: note ? note.description: ''
      });
    }
  }

  getFileName(note) {

    if (!note) {
      note = {};
    }

    const
      files = note.files || {},
      fileNames = Object.keys(files);
    return fileNames[0];
  }

  onFieldChange(e) {
    const
      el = e.target,
      {name, value} = el;

    let
      payload = {};

    payload[name] = value;
    this.setState(payload);
    dispatcher.emit('form:update', this.state);
  }

  focusForm(id) {
    if (this.props.id === id) {
      let input = React.findDOMNode(this.refs.fileName);
      if (input && typeof input.focus === 'function') {
        input.focus();
      }
    }
  }

  onSubmitForm(e) {
    // think about moving this into the store.
    e.preventDefault();
    if (this.props.note) {
      let
        payload = _.clone(this.props.note),
        files = _.clone(this.props.note.files),
        fileNames = Object.keys(files);

      if (this.state.fileName !== fileNames[0]) {
        files[this.state.fileName] = {
          content: files[fileNames[0]].content
        }; // transfer data to new file name
        files[fileNames[0]] = null; // set old file to null eqv of deleting
      }

      payload.files = files;
      payload.description = this.state.description;
      return dispatcher.emit('gist:update', this.props.note.id, payload);
    }

    const
      name = this.state.fileName.trim(),
      fileName = name.match(/.md$/) ? name : name + '.md';

    let payload = {
      description: this.state.description,
      files: {},
      public: false // this is just the default for now
    };

    payload.files[fileName] = {
      content: '. '
    };

    dispatcher.emit('gist:create', payload);
    this.setState({
      fileName: '',
      description: ''
    });
  }

  render() {
    const
      cta = this.props.cta || 'Submit',
      onFieldChange = this.onFieldChange.bind(this);
    return (
      <form onSubmit={this.onSubmitForm.bind(this)} className="form-block form--createGist u-textAlign--left">
        {this.props.children}
        <div className="input-group u-verticalSpacing--default">
          <label className="input-group--label u-verticalSpacing--small">File Name</label>
          <input name="fileName" className="input-group--input" type="text" value={this.state.fileName} onChange={onFieldChange} ref="fileName" />
          <small className="input-group--small">File name will be suffixed with .md</small>
        </div>
        <div className="input-group u-verticalSpacing--default">
          <label className="input-group--label u-verticalSpacing--small">Description</label>
          <textarea name="description" className="input-group--input" type="text" value={this.state.description} onChange={onFieldChange}></textarea>
        </div>
        <div className="input-group u-textAlign--right">
          <button className="btn btn-primary">{cta}</button>
        </div>
      </form>
    );
  }
};

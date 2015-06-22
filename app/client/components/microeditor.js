const
  React = require('react'),
  Prism = require('prismjs');

require('../lib/prismjs-markdown');

class MicroEditor extends React.Component {

  constructor(options) {
    super(options);

    this.state = {
      value: options.value
    };
  }

  onChange(e) {
    const
      input = this.refs.inputCode.getDOMNode(),
      selStartPos = input.selectionStart;

    let
      inputVal = input.value;

    if(e.keyCode === 9){
      input.value = inputVal.substring(0, selStartPos) + "    " + inputVal.substring(selStartPos, input.value.length);
      input.selectionStart = selStartPos + 4;
      input.selectionEnd = selStartPos + 4;
      e.preventDefault();
    }

    inputVal = inputVal
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;") +
      '\n';

    this.setState({
      value: inputVal
    });
    if (this.props.onChange) {
      this.props.onChange(inputVal, this.props.id);
    }
  }

  onScroll() {
    const
      input = this.refs.inputCode.getDOMNode(),
      output = this.refs.outputCode.getDOMNode();

    output.scrollTop = input.scrollTop;
  }

  generateCode() {
    return {
      __html: `<code class="language-${this.props.language}">${this.state.value}</code>`
    };
  }

  componentDidMount() {
    const output = this.refs.outputCode.getDOMNode();
    Prism.highlightElement(output);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  componentDidUpdate() {
    const output = this.refs.outputCode.getDOMNode();
    Prism.highlightElement(output);
  }

  render() {

    const
      onChange = this.onChange.bind(this),
      onScroll = this.onScroll.bind(this);

    return (
      <div className={"microeditor-container " + this.props.className}>
        <textarea value={this.state.value} className="microeditor-input" ref="inputCode" onChange={onChange} onScroll={onScroll}></textarea>
    		<pre className="microeditor-output" ref="outputCode" dangerouslySetInnerHTML={this.generateCode()}></pre>
      </div>
    );
  }
}

MicroEditor.propTypes = {
  onLoad: React.PropTypes.func,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  language: React.PropTypes.string,
  id: React.PropTypes.string,
  className: React.PropTypes.string
};

MicroEditor.defaultProps = {
  value: '',
  language: 'markdown',
  id: '0',
  className: ''
};

module.exports = MicroEditor;

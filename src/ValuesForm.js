import React from 'react';
import ReactDOM from 'react-dom';
import JsonFormLinkList from './JsonForm';

export default class ValuesFormLinkList extends React.Component {
  constructor(props) {
    super(props)
    this.handleShow = this.handleShow.bind(this)
  }

  handleShow = id => e => {
    e.preventDefault();

    fetch("http://localhost:3000/json_forms/" + id + "/values_forms", {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      ReactDOM.render(<ValuesFormList data={data} json_form_id={this.props.json_form_id} />, document.getElementById('root'));
    })
    .catch((err)=>console.log(err));
  }

  render() {
    return (
      <a className="btn btn-sm btn-info" href={"/json_forms/" + this.props.json_form_id + "/values_forms"} onClick={this.handleShow(this.props.json_form_id)}>Form Values</a>
    );
  }
}

class ValuesFormList extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Form for Values</h1>

          <div className="row">
            <div className="col col-lg-2">
              <ValuesFormLinkNew json_form_id={this.props.json_form_id}/>
            </div>
            <div className="col col-lg-3">
              <a className="btn btn-sm btn-light" href="/">Back to JSON forms</a>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">YAML</th>
                <th scope="col">Inputs</th>
              </tr>
            </thead>
            <ValuesFormTableBody data={this.props.data} />
          </table>

          <a className="btn btn-sm btn-light" href="/">Back to JSON forms</a>
        </div>
      </div>
    );
  }
}

class ValuesFormTableBody extends React.Component {
  render() {
    return (
      <tbody>
      {this.props.data.map(item => (
        <tr key={item.id}>
          <td>
            <pre>
              {item.content_yaml}
            </pre>
          </td>
          <td>
            <ul>
              {item.inputs.map(val => (
                <li>{val}</li>
              ))}
            </ul>
          </td>
        </tr>
      ))}
      </tbody>
    );
  }
}

class ValuesFormLinkNew extends React.Component {
  constructor(props) {
    super(props)
    this.handleNew = this.handleNew.bind(this)
  }

  handleNew(e) {
    e.preventDefault();

    fetch("http://localhost:3000/json_forms/" + this.props.json_form_id + "/generate_structure_for_html_form", {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      ReactDOM.render(<ValuesFormForm structure={data} json_form_id={this.props.json_form_id} />, document.getElementById('root'));
    })
    .catch((err)=>console.log(err));

  }

  render() {
    return (
      <a className="btn btn-sm btn-success" href="/" onClick={this.handleNew}>New</a>
    );
  }
}

class ValuesFormLinkSave extends React.Component {
  constructor(props) {
    super(props)
    this.handleNew = this.handleNew.bind(this)
  }

  handleNew(e) {
    e.preventDefault();

    var inputs = document.getElementsByClassName('inputs')
    var input_values = []
    for(var i=0; i < inputs.length; i++) {
      input_values.push(inputs[i].value)
    }

    fetch("http://localhost:3000/json_forms/" + this.props.json_form_id + "/values_forms", {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ "values_form": { "inputs": input_values } }),
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data.errors !== undefined) {
        ReactDOM.render(<ValuesFormDivErrors data={data.errors.inputs} />, document.getElementById('error-messages'))
      } else {
        ReactDOM.render(<ValuesFormShow data={data} json_form_id={this.props.json_form_id} />, document.getElementById('root'));
      }


    })
    .catch((err)=>console.log(err));

  }

  render() {
    return (
      <a className="btn btn-sm btn-success" href="/" onClick={this.handleNew}>Salvar</a>
    );
  }
}

class ValuesFormShow extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Form Values</h1>
        </div>
        <div className="row">
          <b>Values:</b>
          <ul>
            {this.props.data.inputs.map(item => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
        <div className="row">
          <b>YAML:</b>
          <pre>
            {this.props.data.content_yaml}
          </pre>
        </div>
        <div className="row">
          <ValuesFormLinkList json_form_id={this.props.json_form_id} />
        </div>
      </div>
    );
  }
}

class ValuesFormForm extends React.Component {
  render() {
    let index = 0
    return (
      <div className="container">
        <div className="row">
          <h1>Values</h1>
        </div>

        <div className="row" id="error-messages">
        </div>

        <div className="row">
          <pre>---</pre>
        </div>

        <div className="row">
          <form>
          {this.props.structure.map(item => (
            <ValuesFormFormLine item={item} index={++index} />
          ))}
          </form>
        </div>

        <div className="row">
          &nbsp;
        </div>

        <div className="row">
          <ValuesFormLinkSave json_form_id={this.props.json_form_id} />
          <ValuesFormLinkList json_form_id={this.props.json_form_id} />
        </div>

      </div>
    );
  }
}

class ValuesFormFormLine extends React.Component {
  render() {
    let paddingLeft
    paddingLeft  = "invisible"
    if (this.props.item.level > 0) {
      paddingLeft  = "col col-lg-" + (this.props.item.level)
    }

    return (
      <div className="row">
        <div className={paddingLeft}>
        </div>
        <div className="col col-lg-1">
          <ValuesFormFormInput value={this.props.item.key} index={this.props.index} />:
        </div>
        <div className="col col-lg-1">
          <ValuesFormFormInput value={this.props.item.value} index={this.props.index}/>
        </div>
      </div>
    );
  }
}

class ValuesFormFormInput extends React.Component {
  render() {
    let inputId = "input_" + this.props.index
    if (this.props.value === null) {
      return (
        ""
      );
    } else if (this.props.value.match(/(?<=\<)(.*?)(?=\>)/) !== null) {
      return (
        <input type="text" className="inputs" id={inputId} key={inputId}/>
      );
    } else {
      return (
        this.props.value
      );
    }
  }
}

class ValuesFormDivErrors extends React.Component {
  render() {
    return (
      <div className="alert alert-danger d-flex align-items-center alert-dismissible fade show" role="alert">
        <ul>
        {this.props.data.map(error => (
          <li>{error}</li>
        ))}
        </ul>
      </div>
    );
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import ValuesFormLinkList from './ValuesForm';

export default class JsonFormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], loading: false };
    this.setLastUpdate = this.setLastUpdate.bind(this)
  }

  setLastUpdate(e) {
    this.componentDidMount();
  }

  render() {
    const { items, loading } = this.state

    if (loading) {
      return "<p>Loading...</p>"
    }

    return (
      <div className="container">
        <div className="row">
          <h1>Forms for JSON</h1>

          <JsonFormLinkNew />

          <table className="table">
            <thead>
              <tr>
                <th scope="col">JSON</th>
                <th scope="col">YAML</th>
                <th scope="col" colSpan="4">Actions</th>
              </tr>
            </thead>
          <JsonFormTableBody items={items} updateList={this.setLastUpdate}/>
          </table>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.setState({ loading: true });

    fetch("http://localhost:3000/json_forms", {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      this.setState({ items: data, loading: false })
    })
    .catch((err)=>console.log(err));
  }

}

class JsonFormTableBody extends React.Component {
  render() {
    return (
      <tbody>
      {this.props.items.map(item => (
        <tr key={item.id}>
          <td>
            <pre>
              {item.content}
            </pre>
          </td>
          <td>
            <pre>
              {item.content_yaml}
            </pre>
          </td>
          <td>
            <JsonFormLinkDestroy id={item.id} updateList1={this.props.updateList}/>
          </td>
          <td>
            <ValuesFormLinkList json_form_id={item.id} />
          </td>
        </tr>
      ))}
      </tbody>
    );
  }
}

class JsonFormLinkDestroy extends React.Component {
  constructor(props) {
    super(props)
    this.handleDestroy = this.handleDestroy.bind(this)
  }

  handleDestroy = id => e => {
    e.preventDefault();

    if (window.confirm('Confirm destroy?')) {
      fetch("http://localhost:3000/json_forms/" + id, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        // console.log(data);
        this.props.updateList1(this);
      })
      .catch((err)=>console.log(err));

      ReactDOM.render(<JsonFormList />, document.getElementById('root'));
    }
  }

  render() {
    return (
      <a className="btn btn-sm btn-danger" href="/" onClick={this.handleDestroy(this.props.id)}>Destroy</a>
    );
  }
}

class JsonFormLinkNew extends React.Component {
  constructor(props) {
    super(props)
    this.handleNew = this.handleNew.bind(this)
  }

  handleNew(e) {
    e.preventDefault();

    ReactDOM.render(<JsonFormForm data={""} title={"New JSON"} />, document.getElementById('root'));
  }

  render() {
    return (
      <a className="btn btn-sm btn-success" href="/" onClick={this.handleNew}>New</a>
    );
  }
}

class JsonFormLinkList extends React.Component {
  constructor(props) {
    super(props)
    this.handleList = this.handleList.bind(this)
  }

  handleList(e) {
    e.preventDefault();

    ReactDOM.render(<JsonFormList />, document.getElementById('root'));
  }

  render() {
    return (
      <a className="btn btn-sm btn-light" href="/" onClick={this.handleList}>{this.props.linkName}</a>
    );
  }
}

class JsonFormLinkSave extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave = id => e => {
    e.preventDefault();

    var method = "POST"
    var url = "http://localhost:3000/json_forms"

    if ((id !== null) && (id !== undefined)) {
      method = "PUT"
      url = "http://localhost:3000/json_forms/" + id
    }

    fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: method,
      body: JSON.stringify({ "json_form": { "content": document.getElementById("json-form-content").value } }),
      }).then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.errors !== undefined) {
          ReactDOM.render(<JsonFormDivErrors data={data.errors.content} />, document.getElementById('error-messages'))
        } else {
          ReactDOM.render(<JsonFormShow data={data} />, document.getElementById('root'))
        }
      })
    .catch((err)=>console.log(err));
  }

  render() {
    return(
      <a href="/" className="btn btn-sm btn-success" onClick={this.handleSave(this.props.data.id)}>Save</a>
    )
  }
}

class JsonFormShow extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1>Show</h1>
        </div>
        <div className="row">
          <b>JSON:</b>
          <pre>
            {this.props.data.content}
          </pre>
        </div>
        <div className="row">
          <b>YAML:</b>
          <pre>
            {this.props.data.content_yaml}
          </pre>
        </div>
        <div className="row">
          <JsonFormLinkList linkName={"Back"} />
        </div>
      </div>
    );
  }
}

class JsonFormForm extends React.Component {
  render() {
    return (
      <div className="container">

        <div className="row">
          <h1>{this.props.title}</h1>
        </div>

        <div className="row" id="error-messages">
        </div>

        <div className="row">
          <form>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea className="form-control" id="json-form-content" rows="20" defaultValue={this.props.data.content}/>
            </div>
          </form>
        </div>

        <div className="row">
          &nbsp;
        </div>

        <div className="row">
          <JsonFormLinkSave data={this.props.data} />
          <JsonFormLinkList linkName={"Back"} />
        </div>
      </div>
    );
  }
}

class JsonFormDivErrors extends React.Component {
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

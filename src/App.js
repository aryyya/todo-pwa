import React, { Component, useState } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'
import ConnectionBadge from './connection-badge'
import GreyProfile from './grey_profile.png'
import Back from './back.png'

const ITEMS_URL = 'http://localhost:4567/items.json'

class List extends Component {

  state = {
    items: [],
    loading: true,
    todoItem: '',
    offline: !navigator.onLine
  }

  componentDidMount () {
    fetch(ITEMS_URL)
      .then(response => response.json())
      .then(items => {
        this.setState({ items, loading: false })
      })

      window.addEventListener('online', this.setOfflineStatus)
      window.addEventListener('offline', this.setOfflineStatus)
  }

  componentWillUnmount () {
    window.removeEventListener('online', this.setOfflineStatus)
    window.removeEventListener('offline', this.setOfflineStatus)
  }

  setOfflineStatus = () => {
    this.setState({ offline: !navigator.onLine })
  }

  addItem = (e) => {
    e.preventDefault()

    fetch(ITEMS_URL, {
      method: 'POST',
      body: JSON.stringify({ item: this.state.todoItem }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(items => {
        if (items.error) {
          alert(items.error)
        } else {
          this.setState({ items })
        }
      })

    this.setState({ todoItem: '' })
  }

  deleteItem = (itemId) => {
    fetch(ITEMS_URL, {
      method: 'DELETE',
      body: JSON.stringify({ id: itemId }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(items => {
        if (items.error) {
          alert(items.error)
        } else {
          this.setState({ items })
        }
      })
  }

  render () {
    return (
      <div className="App">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">
            <img src={logo} className="App-logo" alt="logo" />
            My Todo List
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>
              <Link to="/profile">Profile</Link>
            </span>
            <ConnectionBadge isOnline={!this.state.offline} />
          </span>
        </nav>

        <div className="px-3 py-2">

          <form className="form-inline my-3" onSubmit={this.addItem}>
            <div className="form-group mb-2 p-0 pr-3 col-8 col-sm-10">
              <input 
                className="form-control col-12"
                placeholder="What do you need to do?"
                value={this.state.todoItem}
                onChange={e => this.setState({ 
                  todoItem: e.target.value 
                })}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary mb-2 col-4 col-sm-2">
              Add
            </button>
          </form>

          { this.state.loading && <p>Loading...</p> }

          { 
            !this.state.loading && this.state.items.length === 0 && 
            <div className="alert alert-secondary">
              No items - all done!
            </div>
          }

          {
            !this.state.loading && this.state.items && 
            <table className="table table-striped">
              <tbody>
                {
                  this.state.items.map((item, i) => {
                    return (
                      <tr key={item.id} className="row">
                        <td className="col-1">{i+1}</td>
                        <td className="col-10">{item.item}</td>
                        <td className="col-1">
                          <button 
                            type="button" 
                            className="close" 
                            aria-label="Close"
                            onClick={() => this.deleteItem(item.id)}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }

        </div>

      </div>
    )
  }
}

const Profile = () => {

  const [image, setImage] = useState(null)
  const [supportsCamera] = useState('mediaDevices' in navigator)
  const [enableCamera, setEnableCamera] = useState()

  const changeImage = event => {
    setImage(URL.createObjectURL(event.target.files[0]))
  }

  const startChangeImage = () => {
    setEnableCamera(!enableCamera)
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          <Link to="/">
            <img src={Back} alt="logo" style={{ height: 30 }}/>
          </Link>
        </span>
      </nav>
      <div style={{ textAlign: 'center' }}>
        <img
          src={image || GreyProfile}
          alt="profile"
          style={{ height: 200, marginTop: 50 }}
        />
        <p style={{ color: '#888', fontSize: 20 }}>username</p>
        <div>
          {
            supportsCamera &&
            <button onClick={startChangeImage}>
              Toggle Camera
            </button>

            // <input
            //   type="file"
            //   accept="image/*"
            //   onChange={changeImage}
            //   capture="user"
            // />
          }
        </div>
      </div>
    </div>
  )
}

export default () => {
  return (
    <Router>
      <div>
        <Route path="/" exact component={List} />
        <Route path="/profile" exact component={Profile} />
      </div>
    </Router>
  )
}

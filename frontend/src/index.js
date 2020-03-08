import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Menu extends React.Component {
    render() {
        return (
        <div>
            <p>this is menu</p> 
            <button onClick={this.props.onReturn}>BACK</button>
        </div>);
    }
}

class Login extends React.Component {
    render() {
        return (
            <form onSubmit={this.props.onSubmit}>
                <p>User ID</p>
                <input type="text" name="id" />
                <br />
                <p>Password</p>
                <input type="text" name="passwd" />
                <input type="submit" />
            </form>    
        );
    }
}

// the container of all components, FSM controller
class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credential: {
                id: "",
                passwd: "",
            }, // credential from 
            state: "login", // states: login, menu, post, get, processing post, processing get
            key: "", // a key to identify user from server
        };
    }

    // handle "back" behavior from each panel
    goBack(name) {
        if (name === "menu") {
            this.logOut();
            this.setState({
                state: "login",
                key: "",
            })
        }
    }

    // send a request to backend server for a session key (with fetch API)
    // for now just settle for plain text, tho the key would be a random hash
    logIn(credential = {}) {
        const url = "http://localhost:9000/login";
        fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify(credential),
        })
            .then((res) => res.text())
            .then((res) => {
                if (res === "yes") {
                    this.setState({
                        key: res,
                        state: "menu",
                    })
                }
                else {
                    alert("Login failed: wrong credentials!")
                }
            });
    }

    // TODO: tell server to delete current session key
    logOut() {
        console.log("log out");
    }

    loginSubmitHandler = (event) => {
        event.preventDefault();
        const passwd = event.target.passwd.value;
        const uid = event.target.id.value;
        console.log("id: " + uid + " password: " + passwd);

        const credential = {
            id: uid,
            passwd: passwd,
        };

        this.logIn(credential);
    }

    render() {
        let toDisplay;
        const state = this.state.state;
        if (state === "login") {
            toDisplay = <Login onSubmit={this.loginSubmitHandler}/>;
        }
        else if (state === "menu") {
            toDisplay = <Menu onReturn={() => this.goBack("menu")} />;
        }
        // else if (state === "post") {

        // }
        // else if (state === "get") {

        // }
        // else if (state === "processing post") {

        // }
        // else if (state === "processing get") {

        // }
        return toDisplay;
    }
}

//===================================
ReactDOM.render(
    <MainPanel />,
    document.getElementById("root")
);
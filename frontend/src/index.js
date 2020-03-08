import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Editor extends React.Component {
//     render() {
//         return <div>editor</div>;
//     }
// }

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

class MainPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credential: {
                id: "",
                passwd: "",
            }, // credential from 
            state: "login", // state of application (e.g. before login)
            key: "", // a key to identify user from server
        };
    }

    // send a request to backend server for a session key
    // for now just settle for plain text, tho the key would be a random hash
    requestKey(credential = {}) {
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
            .then((res) => this.setState({key: res}));
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

        this.requestKey(credential);
    }

    render() {
        let toDisplay;
        if (this.state.key !== "") {
            toDisplay = <div>{this.state.key}</div>;
        }
        else {
            toDisplay = <Login onSubmit={this.loginSubmitHandler}/>;
        }
        return toDisplay;
    }
}

//===================================
ReactDOM.render(
    <MainPanel />,
    document.getElementById("root")
);

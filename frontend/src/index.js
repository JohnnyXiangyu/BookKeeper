import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// some function components, including button
function GpButton(props) {
    return <button 
            onClick={props.onClick}
            className="general_purpose">
                {props.text}
            </button>
}

class GetPanel extends React.Component {
    render() {
        return (
            <div>
                <p>this is get panel</p>
                <GpButton text="BACK TO MENU" onClick={() => this.props.onReturn()} />
            </div>
        );
    }
}

class PostPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: "init", // states include: init, pending, done
        }
    }

    submit() {

    }

    render() {
        let message;
        if (this.state.state === "init") {
            message = "WAITING FOR INPUT";
        }
        else if (this.state.state === "pending") {
            message = "PROCESSING NEW SUBMISSION";
        }
        else if (this.state.state === "done") {
            message = "RECORDS SUBMITTED";
        }
        else {
            alert("unrecoganized state: " + this.state.state);
        }
        return (
            <div>
                <p>{message}</p>
                <GpButton text="BACK TO MENU" onClick={this.props.onReturn} />
            </div>
        );
    }
}

class Menu extends React.Component {
    render() {
        return (
            <div>
                <p>THIS IS MENU</p>
                <GpButton text="UPLOAD RECORD" onClick={() => this.props.nav("post")} /> <br />
                <GpButton text="VIEW RECORDS" onClick={() => this.props.nav("get")} /> <br />
                <GpButton text="LOG OUT" onClick={this.props.onReturn} />
            </div>
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state: "login", // login, processing, fail
            credential: {
                id: "",
                passwd: "",
            }
        };
    }

    resetLogin = () => {
        this.setState({
            state: "login", // login, processing, fail
            credential: {
                id: "",
                passwd: "",
            }
        });
    }

    loginSubmitHandler = (event) => {
        event.preventDefault();
        const passwd = event.target.passwd.value;
        const uid = event.target.id.value;
        console.log("id: " + uid + " password: " + passwd);

        this.setState({
            credential: {
                id: uid,
                passwd: passwd,
            },
            state: "processing",
        })
    }

    registerSubmitHandler = (event) => {
        
    }

    // send a request to backend server for a session key (with fetch API)
    // for now just settle for plain text, tho the key would be a random hash
    logIn(credential = {}) {
        const url = "/login";
        fetch(url, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-type": "application/json",
            },
            redirect: "follow",
            body: JSON.stringify(credential),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.valid === "yes") {
                    this.props.onSuccess(res.key, credential);
                }
                else {
                    this.setState({state: "loginFail"});
                }
            });
        // before promise returns: goto processing page
        this.setState({
            state: "processing",
        })
    }

    render() {
        if (this.state.state === "login") {
            return (
                <form onSubmit={this.loginSubmitHandler} className="login_panel" autoComplete="off">
                    <input type="text" name="id" placeholder="[username]"/>
                    <input type="text" name="passwd" placeholder="[password]"/>
                    <input type="submit" value="LOGIN"/>
                </form>
            );
        }
        else if (this.state.state === "processing") {
            this.logIn(this.state.credential);
            return <p>CONTACTING SERVER...</p>;
        }
        else if (this.state.state === "loginFail") {
            return (
                <div>
                    <p>GIVEN PASSWORD AND USERNAME DON'T MATCH</p>
                    <GpButton text="BACK" onClick={this.resetLogin} />
                </div>
            )
        }
    }
}

// the container of all components, FSM controller
// store data here
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
    goBack(state) {
        if (state === "menu") {
            this.setState({
                state: "login",
                key: "",
            })
        }
        else if (state === "post" || state === "get") {
            this.setState({ state: "menu" });
        }
    }

    // handle navigation from menu
    goFromMenu(state) {
        if (state === "post" || state === "get") {
            this.setState({
                state: state,
            });
        }
        else {
            alert("goto state: " + state + " not registered");
        }
    }

    // let login component respond a session key
    loginSuccessHandler = (session_key="", cred={}) => {
        console.log(cred);
        this.setState({
            key: session_key,
            state: "menu",
            credential: cred,
        });
    }

    render() {
        let toDisplay;
        const state = this.state.state;
        if (state === "login") {
            toDisplay = <Login onSuccess={this.loginSuccessHandler}/>;
        }
        else if (state === "menu") {
            toDisplay = <Menu
                onReturn={() => this.goBack("menu")}
                nav={(i) => this.goFromMenu(i)}
            />;
        }
        else if (state === "post") {
            toDisplay = <PostPanel
                onReturn={() => this.goBack("post")}
                sessionKey={this.state.key}
            />;
        }
        else if (state === "get") {
            toDisplay = <GetPanel
                onReturn={() => this.goBack("get")}
                sessionKey={this.state.key}
            />;
        }
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

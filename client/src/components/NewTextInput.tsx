import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
// import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
import "../utilities.css";
import Player from "../../../shared/Player";
import PlayerBlock from "./Player";
import "./NewTextInput.css";
import { Button, Input } from 'semantic-ui-react';


// Based on NewPostInput from Catbook

interface NewTextInputProps {
    defaultText: string;
    onSubmit: (value: string) => void;
}

interface NewTextInputState {
    value: string;
}

class NewTextInput extends Component<NewTextInputProps, NewTextInputState>{
    constructor(props) {
        super(props)

        this.state = {
            value: ""
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
          value: event.target.value,
        });
      };
    
    handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      this.props.onSubmit && this.props.onSubmit(this.state.value);
      this.setState({
        value: "",
      });
    };

    render() {
        return (
            <div className="input_text">
                <input id="input"
                    type="text"
                    placeholder={this.props.defaultText}
                    value={this.state.value}
                    onChange={this.handleChange}
                    // className="NewPostInput-input"
                />
                <Button id="button"
                    type="submit"
                    // className="NewPostInput-button u-pointer"
                    value="Submit"
                    onClick={this.handleSubmit}
                >
                    Submit
                </Button>
            </div>
        );
    }
}

interface NewQuestionInputProps {
    //code :
    isAskingPlayer: boolean;
    answerer: Player;
    disableQuestionSubmit: () => void;
}

interface NewQuestionInputState {
    hasAskedQuestion: boolean;
}

class NewQuestionInput extends Component<NewQuestionInputProps, NewQuestionInputState>{
    constructor(props){
        super(props)
        this.state = {
            hasAskedQuestion : false,
        }
    }
    askQuestion = (questionText:string) => {
        const questionBody = {answerer: this.props.answerer, questionText: questionText};
        // this.setState({hasAskedQuestion:true});
        this.props.disableQuestionSubmit();
        post("/api/question", questionBody);
    }
    render() {
        return (
            this.props.isAskingPlayer && !(this.state.hasAskedQuestion)) ? (<NewTextInput defaultText={`Ask a question to ${this.props.answerer.name}`} onSubmit={this.askQuestion}/>): null;
    }
}

interface NewCodeInputProps {
    setCode: (code:string) => void;
}

class NewCodeInput extends Component<NewCodeInputProps, {}> {
    constructor(props) {
        super(props);
    }
    moveToGame = (code:string) => {
        this.props.setCode(code);
    }
    render() {
        return (
            <div className = "enter">
                <NewTextInput defaultText='Enter game code' onSubmit={this.moveToGame}/>
            </div>
        )
    }
}

interface NewMessageProps {
    gameCode: string;
    name: String;
  }
  
class NewMessage extends Component<NewMessageProps> {
    sendMessage = (value: string) => {
      const body = { content: value , gameCode: this.props.gameCode, name:this.props.name};
      post("/api/message", body);
    };
  
    render() {
      return <NewTextInput defaultText="New Message" onSubmit={this.sendMessage} />;
    }
}

export {NewQuestionInput, NewCodeInput, NewMessage};
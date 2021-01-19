import React, { Component } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
//import {Player} from "./Player";
import Player from "../../../shared/Player";
import PlayerList from "./PlayerList";
import NewQuestionInput from "./NewTextInput";
import "../utilities.css";
import PlayerButtonList from "./PlayerButtonList";


type State = {
  userId: String;
  currentPlayer: Player;
  answeringPlayer: Player;
  activePlayers: Player[];
  loggedIn: boolean;
  gameStarted: boolean;
  isAskingPlayer: boolean;
  isAnsweringPlayer: boolean;
  isChosenPlayer: boolean;
};

class App extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      currentPlayer: {
        name:"",
        _id: undefined
      },
      answeringPlayer: {
        name:"",
        _id: undefined
      },
      activePlayers: [],
      loggedIn: false,
      gameStarted: false,
      isAskingPlayer: false,
      isAnsweringPlayer: false,
      isChosenPlayer: false,
    };
  }

  componentDidMount() {
    get("/api/whoami")
      .then((user: User) => {
        if (user._id) {
          // TRhey are registed in the database and currently logged in.
          const currentPlayer: Player = {
            name:user.name,
            _id:user._id
          };
          this.setState({ userId: user._id, currentPlayer: currentPlayer, loggedIn: true});
        }
      })
      .then(() =>
        socket.on("connect", () => {
          post("/api/initsocket", { socketid: socket.id });
        })
      )

      get("/api/activeUsers").then((data) => {
        const playerList : Player[] = [];
        for (let i = 0; i < data.activeUsers.length; i++) {
          const newPlayer: Player = {name: data.activeUsers[i].name, _id: data.activeUsers[i]._id}
          playerList.push(newPlayer)
        }
        this.setState({
          activePlayers: playerList,
        });
      })
      
      socket.on("activeUsers", (data) => {
        const playerList : Player[] = [];
        for (let i = 0; i < data.activeUsers.length; i++) {
          const newPlayer: Player = {name: data.activeUsers[i].name, _id: data.activeUsers[i]._id}
          playerList.push(newPlayer)
        }
        this.setState({
          activePlayers: playerList,
        });
        if (this.state.activePlayers.length > 1 && !(this.state.gameStarted)) {
          post("/api/update", {});
        }
      });

      socket.on("question", (data) => {
        //TODO: implement me 
        console.log(`${data.gameState.asker.name} asks: ${data.questionText}`);
        this.setState({isAnsweringPlayer:true});
      });

      socket.on("choose", (data) => {
        //TODO: implement me
        console.log(`${data.gameState.answerer.name} chose you!`)
        this.setState({isChosenPlayer:true});
        post("/api/update", {})
      })

      socket.on("update", (data) => {
        //TODO: implement me
        this.setState({isAskingPlayer:data.askingPlayer._id ===this.state.userId, gameStarted:true, answeringPlayer:data.answeringPlayer});
        console.log()
      })
  }

  handleLogin = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ("tokenObj" in res) {
      console.log(`Logged in as ${res.profileObj.name}`);
      const userToken = res.tokenObj.id_token;
      post("/api/login", { token: userToken }).then((user: User) => {
        const currentPlayer: Player = {
          name:res.profileObj.name,
          _id:user._id
        };
        this.setState({ userId: user._id, currentPlayer: currentPlayer, loggedIn:true});
        post("/api/initsocket", { socketid: socket.id });
      });
    }
  };

  handleLogout = () => {
    const blankPlayer: Player = {
      name:"",
      _id:undefined
    };
    this.setState({ userId: undefined, currentPlayer: blankPlayer , loggedIn:false});
    post("/api/removeSocket", { socketid: socket.id }).then(()=>{
      post("/api/logout");
    });
  };

  render() {
    // NOTE:
    // All the pages need to have the props defined in RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
    return (
      <>
        <Router>
          <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <NotFound default={true} />
        </Router>
        <PlayerList playerList={this.state.activePlayers}/>
        <NewQuestionInput isAskingPlayer={this.state.loggedIn && this.state.isAskingPlayer} answerer={this.state.answeringPlayer}/>
        <PlayerButtonList isAnsweringPlayer={this.state.loggedIn && this.state.isAnsweringPlayer} playerList={this.state.activePlayers}/>
      </>
    );
  }
}

export default App;
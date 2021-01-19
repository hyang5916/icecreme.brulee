import React, { Component } from "react";
import { Router } from "@reach/router";
import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { socket } from "../client-socket";
import User from "../../../shared/User";
//import PlayerBlock, {Player} from "./Player";
import PlayerBlock from "./Player";
import Player from "../../../shared/Player";
import "../utilities.css";



interface Props {
    playerList: Player[];
    isAnsweringPlayer: boolean;
    // code: String; TODO: implement multiple rooms, not sure where
}
interface State {
    chosenPlayer: Player;
    hasChosenPlayer: boolean;
}

class PlayerButtonList extends Component<Props, State>
{
    constructor(props) {
        super(props)
        this.state = {
            chosenPlayer: {name:'', _id: ''},
            hasChosenPlayer: false,
        }
    }

    resetPlayer = () =>{
        this.setState({chosenPlayer: {name:'', _id: ''}});
    }

    render() {
        if (this.props.isAnsweringPlayer && !this.state.hasChosenPlayer) {
        return (
            <>
                {this.state.chosenPlayer._id.length === 0 ? <h3>Choose a player...</h3>:<h3>{`Chose ${this.state.chosenPlayer.name}`}</h3>}
                {this.props.playerList.map((player, i) => (
                    <>
                        <button 
                            type='button'
                            onClick = {() => {
                                this.setState({chosenPlayer:player, hasChosenPlayer: true});
                                post("/api/choose", {chosenPlayer:player});
                            }}
                            disabled={this.state.hasChosenPlayer}
                        >   
                        </button>
                        <PlayerBlock
                            player={player}
                            key={i}
                        />
                    </>
                )
                )
                }
                {/* <button type='reset' onClick={this.resetPlayer}>
                    Reset player
                </button> */}
            </>
        )}
        else if (this.state.hasChosenPlayer) {
            return this.state.chosenPlayer._id.length === 0 ? (<h3>Choose a player...</h3>):(<h3>{`Chose ${this.state.chosenPlayer.name}`}</h3>);
        }
        return null;
    }
}
export default PlayerButtonList;
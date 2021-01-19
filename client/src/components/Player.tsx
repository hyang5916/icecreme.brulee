import React, { Component } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";

// export interface Player {
//     _id: String;
//     name: String;
// }

interface Props {
    player: Player
}
class PlayerBlock extends Component<Props> {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.player.name}
            </div>
        )
    }
}

export default PlayerBlock;
/*
class Player extends Component{
    constructor(props) = {
        super(props);
        this.props = {
            name: 
        }
    }
}*/
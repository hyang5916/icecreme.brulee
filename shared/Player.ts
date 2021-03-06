import PlayerBlock from "../client/src/components/Player";

export interface Player {
    _id: String;
    name: String;
    color?: String;
    gameCode?: string;
}

export default Player;
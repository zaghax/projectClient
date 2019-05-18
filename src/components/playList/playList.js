import React, {Component} from 'react'

class PlayList extends Component {

    state = {
        playListVideos: []
    }

    componentDidMount (){
        this.props.onRef(this);
        this.getPlaylist();
    }

    getPlaylist = () => {

        const {fullPlayList, currentPlayingData} = this.props;

        if(Object.keys(fullPlayList).length !== 0){

            const playListKeys = Object.keys(fullPlayList);
            const currentObjKey = playListKeys.indexOf(currentPlayingData.playing.objectKey) + 1;
            const playListExtractKeys = playListKeys.slice(currentObjKey);
            const listVideos = [];

            playListExtractKeys.map( item => {
                return (
                    listVideos.push(fullPlayList[item])
                )
            });

            this.setState({
                playListVideos: listVideos
            });

        }
    }

    getPlaylistVideos = (videos) => {

        return videos.map((item, index) => {

            return (
                <div className="videoItem" key={index} >

                    <img className="videoImage" src={item.snippet.thumbnails.medium.url} alt=""/>

                    <div className="videoTitle" >
                        <p dangerouslySetInnerHTML={{__html: item.snippet.title}} />
                    </div>

                </div>
            )

        })

    }

    render(){

        const  {playListVideos} = this.state;

        return(
            <div className="playList">
                <p className="playListText">PLAYLIST</p>
                <div className="playListWrapper">
                    {this.getPlaylistVideos(playListVideos)}
                </div>
            </div>
        )

    }
}

export default PlayList;
import React, {Component} from 'react'

class PlayList extends Component {

    state = {
        playListVideos: []
    }

    componentDidMount (){
        this.props.onRef(this);
        this.getPlaylist();
    }

    scrollTop = () => {
        document.querySelector('.playListWrapper').scrollTop = 0;
    }

    scrollBottom = () => {
        let scrollHeight = document.querySelector('.playListWrapper').scrollHeight;
        document.querySelector('.playListWrapper').scrollTop = scrollHeight;
    }

    scrollListener = () => {
        if(document.querySelector('.playListWrapper').scrollTop > 200){
            document.querySelector('.icon-chevrons-up').classList.add('active');
        }else{
            document.querySelector('.icon-chevrons-up').classList.remove('active');
        }
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
                <div className="playListHead">
                    <span>PLAYLIST</span>
                    <div className="scrollControls">
                        <button className="icon-chevrons-up scroll__btn" onClick={this.scrollTop}/>
                        <button className="icon-chevrons-down scroll__btn" onClick={this.scrollBottom}/>
                    </div>
                </div>
                <div className="playListWrapper" onScroll={this.scrollListener}>
                    {this.getPlaylistVideos(playListVideos)}
                </div>
            </div>
        )

    }
}

export default PlayList;
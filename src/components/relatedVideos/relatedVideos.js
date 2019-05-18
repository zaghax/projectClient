import React, {Component} from 'react';
import {getVideos} from '../getVideos/getVideos';
import {dbRefPlaylist} from '../appContainer/appContainer';


class RelatedVideos extends Component {

    state = {
        relatedVideos: []
    }

    addPlaylistItem = (item) => {
        dbRefPlaylist.push(item);
    }

    componentDidMount (){
        this.props.onRef(this);
    }

    getRelatedResults = () => {

        const {currentPlayingData} = this.props;

        const params = [
            `&maxResults=${4}`,
            `&relatedToVideoId=${currentPlayingData.playing.videoData.id.videoId}`
            ];

        getVideos(params)
        .then((response) => response.json())
        .then(response => {
            this.setState({
                relatedVideos: response.items
            })
        })
        .catch((error) => {
            console.log('error', error)
        })

    }

    getRelatedVideos = (videos) => {

        return videos.map((item, index) => {

            return (
                <div className="videoItem" key={index} >

                    <div className="videoCover">
                        <img className="videoImage" src={item.snippet.thumbnails.medium.url} alt=""/> 
                        <div className="videoTitle" >
                            <p dangerouslySetInnerHTML={{__html: item.snippet.title}} />
                        </div>
                        <button className="icon-playlist_add addVideo" onClick={() => { this.addPlaylistItem(item)}} />
                    </div>
                    
                
                </div>
            )
        })

    }

    render(){

        const {relatedVideos} = this.state;

        return (

            <div className="relatedVideosWrap">
                <p className="relatedVideosText">SUGGESTED VIDEOS</p>
                <div className="relatedVideos">
                    {relatedVideos && relatedVideos !== undefined && this.getRelatedVideos(relatedVideos)}
                    {relatedVideos === undefined && 
                        <p className="errorMessage">Ohh shit... <br/> The suggested videos are fucked</p>
                    }
                </div>
            </div> 
            
        ) 
    }

}

export default RelatedVideos;
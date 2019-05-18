import React, {Component} from 'react'

class CurrentlyPlaying extends Component {
    
    render(){
        
        let currentPlayingData = this.props.currentPlayingData;

        return(
            <div>

                { currentPlayingData && currentPlayingData.playing !== undefined &&

                    <div className="currentlyPlaying">

                        <div className="videoCover" style={{backgroundImage: `url(${currentPlayingData.playing.videoData.snippet.thumbnails.high.url})`}}/>

                        <div className="playingInfo">
                            <div className="infoTitle">Currently playing</div>
                            <div
                                className="videoName"
                                dangerouslySetInnerHTML={{ __html: currentPlayingData.playing.videoData.snippet.title }} />
                        </div>

                    </div>
                
                }
            
            </div>
            
            
        )
    }
}


export default CurrentlyPlaying;
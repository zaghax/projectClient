import React, {Component} from 'react';
import {dbRefPlaylist} from '../appContainer/appContainer';
import {checkButtonStatus, getVideos} from '../common/commonFunctions';


class RelatedVideos extends Component {

    state = {
        relatedVideos: []
    }

    constructor(props){
        super(props);
        this.btnRefs = [];
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    checkStatus = () => {
        checkButtonStatus(this.props.addVideoButtonStatus, this.btnRefs);
    }

    addRemovePlaylistItem = (item, index) => {
        
        if(this.btnRefs[index].classList.contains('icon-playlist_add') && this.props.addVideoButtonStatus === false){
            
            dbRefPlaylist.push(item).then((snap)=> {

                this.btnRefs[index].classList.remove("icon-playlist_add");
                this.btnRefs[index].setAttribute("id", snap.key);
                this.btnRefs[index].classList.add("icon-check");
                this.props.addVideoCounter();

                setTimeout(()=>{
                    this.btnRefs[index].classList.remove("icon-check");
                    this.btnRefs[index].classList.add("icon-trash-2");
                }, 500)

            });

        }
        else if(this.btnRefs[index].classList.contains('icon-trash-2')) {
            
            const fbId = this.btnRefs[index].getAttribute("id");
            dbRefPlaylist.child(fbId).remove();
            this.btnRefs[index].classList.remove("icon-trash-2");
            this.btnRefs[index].classList.add("icon-playlist_add");
            this.props.removeVideoCounter();

        }
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
        }, setTimeout(() => {this.checkStatus()}, 1000))
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
                        <button className="icon-playlist_add addVideo" onClick={() => { this.addRemovePlaylistItem(item, index)}} ref={((addBtn) => {this.btnRefs[index] = addBtn})}/>
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
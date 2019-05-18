import React, {Component} from 'react';
import RelatedVideos from '../relatedVideos/relatedVideos';
import PlayList from '../playList/playList';
import CurrentlyPlaying from '../currentlyPlaying/currentlyPlaying';
import SearchVideos from '../searchVideos/searchVideos';
import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCkwdRv1u2LSarAY152iZgWL3H5RroueqM",
    authDomain: "playlist-ca585.firebaseapp.com",
    databaseURL: "https://playlist-ca585.firebaseio.com",
    projectId: "playlist-ca585",
    storageBucket: "playlist-ca585.appspot.com",
    messagingSenderId: "850788790457"
}

firebase.initializeApp(config);

const refDB = firebase.database().ref();

export const dbRefPlaylist = refDB.child('playlist');
const dbRefCurrentPlaying = refDB.child('currentPlaying');
// const dbRefAPI_KEY = refDB.child('API_KEY');

class AppContainer extends Component {

    state = {
        // API_KEY: '',
        fullPlayList: {},
        currentPlayingData: {},
        isSearchClosed: true,
        isDataReady: false
    }

    componentDidMount() {

        // dbRefAPI_KEY.on('value', snap => {
        //     this.setState({
        //         API_KEY: snap.val()
        //     })
        // });

        refDB.on('value', () => {
            setTimeout(()=>{
                this.setState({
                    isDataReady: true
                })
            },2000)
        })

        dbRefCurrentPlaying.on('value', snap => {
            this.setState({
                currentPlayingData: snap.val()
            }, ()=> {
                this.childRelated.getRelatedResults();
                this.childPlaylist.getPlaylist();
            })
        });

        dbRefPlaylist.on('value', snap => {
            this.setState({
                fullPlayList: snap.val()
            }, () => {
                this.childPlaylist.getPlaylist();
            })
        });

    }

    toggleSearchWindow = () => {
        this.setState({
            isSearchClosed: !this.state.isSearchClosed
        })
    }

    render(){

        const {
            isSearchClosed,
            currentPlayingData,
            fullPlayList,
            isDataReady
        } = this.state;

        return (
            <div className="appContainer">

                <div className="header">
                    <p>ZAGHAX PLAYER</p>
                    {isSearchClosed && <button className="icon-search searchButton" onClick={this.toggleSearchWindow}/>}
                </div>

                {!isDataReady && 
                    <div className="loader">
                        <i className="icon-loader"/>
                    </div>
                }
                
                <div className={`mainApp ${isDataReady ? 'ready' : 'notReady'}`}>

                    <SearchVideos 
                        isSearchClosed={isSearchClosed} 
                        closeSearchWindow={this.toggleSearchWindow}
                    />

                    <CurrentlyPlaying 
                        currentPlayingData={currentPlayingData}
                    />

                    <RelatedVideos 
                        currentPlayingData={currentPlayingData}
                        onRef={ref => (this.childRelated = ref)}
                    />
                    
                    <PlayList 
                        currentPlayingData={currentPlayingData}
                        fullPlayList={fullPlayList}
                        onRef={ref => (this.childPlaylist = ref)}
                    />

                </div>

            </div>

        );
    }
}

export default AppContainer;


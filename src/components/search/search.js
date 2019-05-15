import React, {Component} from 'react';
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

const dbRefPlaylist = refDB.child('playlist');
const dbRefCurrentPlaying = refDB.child('currentPlaying');
const dbRefAPI_KEY = refDB.child('API_KEY');

class Search extends Component {

    state = {
        searchValue: '',
        API_KEY: '',
        searchResults: [],
        fullPlayList: {},
        currentPlayingData: {},
        relatedVideos: [],
        playListVideos: [],
        selectedTab: 'playlist'
    }

    componentDidMount() {

        dbRefAPI_KEY.on('value', snap => {
            this.setState({
                API_KEY: snap.val()
            })
        });

        dbRefCurrentPlaying.on('value', snap => {
            this.setState({
                currentPlayingData: snap.val()
            })
            this.getRelatedResults();
            this.getPlaylist();
        });

        dbRefPlaylist.on('value', snap => {
            this.setState({
                fullPlayList: snap.val()
            })
            this.getPlaylist();
        });

    }

    setSearch = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }

    tabSelected = (currentTab) => {
        this.setState({
            selectedTab: currentTab
        })
    }

    getVideos = (params, storeIn) => {

        const {API_KEY} = this.state;

        const defaultParams = [
            'https://www.googleapis.com/youtube/v3/search',
            '?part=snippet',
            '&type=video',
            '&videoDuration=medium',
            `&key=${API_KEY}`,
        ]

        const URL = defaultParams.join('') + params.join('');

        fetch(URL)
            .then((response) => response.json())
            .then(response => {
                this.setState({
                    [`${storeIn}`]: response.items
                })
            })
    }

    getRelatedResults = () => {

        const {currentPlayingData} = this.state;

        const params = [
            `&maxResults=${4}`,
            `&relatedToVideoId=${currentPlayingData.playing.videoData.id.videoId}`
            ];

        this.getVideos(params, 'relatedVideos');

    }

    getSearchResults = (e) => {

        e.preventDefault();

        const {searchValue} = this.state;

        const params = [
            `&maxResults=${10}`,
            `&q=${searchValue}`
            ];

        this.getVideos(params, 'searchResults');

        this.setState({
            selectedTab: 'search'
        })

    }

    addPlaylistItem = (item) => {

        dbRefPlaylist.push(item);

        this.getPlaylist();

    }

    getPlaylist = () => {

        const {fullPlayList, currentPlayingData} = this.state;

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

    currentlyPlaying = () => {

        const {currentPlayingData} = this.state;

        if(currentPlayingData && currentPlayingData.playing !== undefined){

            return (
                <div className="currentlyPlaying">
                    <img
                        className="videoThumnail"
                        src={currentPlayingData.playing.videoData.snippet.thumbnails.high.url} alt=""/>

                    <div className="playingInfo">
                        <div className="infoTitle">Currently playing</div>
                        <div
                            className="videoName"
                            dangerouslySetInnerHTML={{ __html: currentPlayingData.playing.videoData.snippet.title }} />
                    </div>

                </div>
            )

        }

    }

    printVideos = (videos, isPlaylist) => {

        return videos.map((item, index) => {

            return (
                <div className={`videoItem ${isPlaylist ? 'playListItem' : ''}`} key={index} >

                    <img className="videoImage" src={item.snippet.thumbnails.medium.url} alt=""/>

                    <div className="videoTitle" >
                        <p dangerouslySetInnerHTML={{__html: item.snippet.title}} />
                    </div>

                    {!isPlaylist && (
                        <button className="icon-plus addVideo" onClick={() => { this.addPlaylistItem(item)}} />
                    )}

                </div>
            )
        })

    }

    render(){

        const {
            relatedVideos,
            playListVideos,
            searchResults,
            selectedTab
        } = this.state;

        return (
            <div className="search">

                <div className="header">
                    <p>ZAGHAX PLAYER</p>
                </div>

                {this.currentlyPlaying()}

                <div className="relatedVideosWrap">
                    <p className="relatedVideosText">SUGGESTED VIDEOS</p>
                    <div className="relatedVideos">
                        {this.printVideos(relatedVideos)}
                    </div>
                </div>

                <form
                    className="searchForm"
                    onSubmit={this.getSearchResults}>

                    <input
                        className="searchInput"
                        type="text"
                        placeholder="Find your video"
                        onChange={this.setSearch}/>

                    <button className="icon-search searchButton" type="submit" value="Buscar"/>

                </form>

                <div className="tabList">
                    <ul className="tabItems">
                        <li className={`tabItem ${selectedTab === 'playlist' ? 'active' : ''}`} onClick={() => {this.tabSelected('playlist')}}>
                            <span>PLAYLIST</span>
                        </li>
                        <li className={`tabItem ${selectedTab === 'search' ? 'active' : ''}`} onClick={() => {this.tabSelected('search')}}>
                            <span>SEARCH RESULTS</span>
                        </li>
                    </ul>
                </div>

                {selectedTab === 'playlist' && (
                    <div className="playList">
                        {this.printVideos(playListVideos, true)}
                    </div>
                )}

                {selectedTab === 'search' && (
                    <div className="searchResults">
                        {this.printVideos(searchResults)}
                    </div>
                )}

            </div>

        );
    }
}

export default Search;


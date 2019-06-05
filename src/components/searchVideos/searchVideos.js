import React, {Component} from 'react';
import {getVideos} from '../getVideos/getVideos';
import {dbRefPlaylist} from '../appContainer/appContainer';

class SearchVideos extends Component {

    state = {
        searchValue: '',
        searchResults: []
    }

    constructor(props){
        super(props);
        this.btnRefs = [];
    }

    componentDidMount(){
        this.props.onRef(this);
    }

    checkStatus = () => {
        console.log('confirmo check', this.btnRefs.length);
        if(this.props.addVideoButtonStatus){
            this.btnRefs.map((item) => {
                if(item.classList.contains('icon-playlist_add')){
                    item.classList.remove('icon-playlist_add');
                    item.classList.add('icon-clock');
                }
            });
        }else{
            this.btnRefs.map((item) => {
                if(item.classList.contains('icon-clock')){
                    item.classList.remove('icon-clock');
                    item.classList.add('icon-playlist_add');
                }
            });
        }
    }

    consoleLog = () => {
        console.log('test')
    }


    // checkStatus = () => {
    //     console.log(document.getElementsByClassName('icon-playlist_add'))
    //     // if(this.props.addVideoButtonStatus){
    //     //     if(document.getElementsByClassName('icon-playlist_add')){
    //     //         document.getElementsByClassName('icon-playlist_add').classList.remove('icon-playlist_add').add('icon-clock');
    //     //     }
    //     // }else{
    //     //     if(document.getElementsByClassName('icon-clock')){
    //     //         document.getElementsByClassName('icon-clock').classList.remove('icon-clock').add('icon-playlist_add');
    //     //     }
    //     // }
    // }


    addRemovePlaylistItem = (item, index) => {
        
        // if(this.btnRefs[index].classList.contains('icon-trash-2') && this.props.addVideoButtonStatus === false){

        //     const fbId = this.btnRefs[index].getAttribute("id");
        //     dbRefPlaylist.child(fbId).remove();
        //     this.btnRefs[index].classList.remove("icon-trash-2");
        //     this.btnRefs[index].classList.add("icon-playlist_add");
        //     this.props.removeVideoCounter();

        // }else{
        //     dbRefPlaylist.push(item).then((snap)=> {

        //         this.btnRefs[index].classList.remove("icon-playlist_add");
        //         this.btnRefs[index].setAttribute("id", snap.key);
        //         this.btnRefs[index].classList.add("icon-check");
        //         this.props.addVideoCounter();

        //         setTimeout(()=>{
        //             this.btnRefs[index].classList.remove("icon-check");
        //             this.btnRefs[index].classList.add("icon-trash-2");
        //         }, 1000)

        //     });
        // }

        if(this.btnRefs[index].classList.contains('icon-playlist_add') && this.props.addVideoButtonStatus === false){
            
            dbRefPlaylist.push(item).then((snap)=> {

                this.btnRefs[index].classList.remove("icon-playlist_add");
                this.btnRefs[index].setAttribute("id", snap.key);
                this.btnRefs[index].classList.add("icon-check");
                this.props.addVideoCounter();

                setTimeout(()=>{
                    this.btnRefs[index].classList.remove("icon-check");
                    this.btnRefs[index].classList.add("icon-trash-2");
                    this.checkStatus();
                }, 500)

            });

        }
        else if(this.btnRefs[index].classList.contains('icon-trash-2')) {
            
            const fbId = this.btnRefs[index].getAttribute("id");
            dbRefPlaylist.child(fbId).remove();
            this.btnRefs[index].classList.remove("icon-trash-2");
            this.btnRefs[index].classList.add("icon-playlist_add");
            this.props.removeVideoCounter();

            setTimeout(()=>{
                this.checkStatus();
            }, 500)

        }

    }

    setSearch = (e) => {
        this.setState({
            searchValue: e.target.value
        })
    }

    getSearchResults = (e) => {

        e.preventDefault();

        const {searchValue} = this.state;

        const params = [
            `&maxResults=${20}`,
            `&q=${searchValue} musica`
            ];

        this.btnRefs = [];

        this.setState({
            searchResults: []
        })

        getVideos(params)
        .then((response) => response.json())
        .then(response => {
            this.setState({
                searchResults: response.items
            })
        }, setTimeout(() => {this.checkStatus()}, 500));

    }

    getVideoResults = (videos) => {

        return videos.map((item, index) => {

            return (
                <div className="videoItem" key={index} >

                    <img className="videoImage" src={item.snippet.thumbnails.medium.url} alt=""/>

                    <div className="videoTitle" >
                        <p dangerouslySetInnerHTML={{__html: item.snippet.title}} />
                    </div>

                    <button className="icon-playlist_add addVideo" onClick={() => { this.addRemovePlaylistItem(item, index)}} ref={((addBtn) => {this.btnRefs[index] = addBtn})} />
                    
                </div>
            )

        })
        
    }

    render(){

        const { searchResults } = this.state;
        const { isSearchClosed } = this.props;

        return(
            <div className={`searchVideosWrapper ${!isSearchClosed ? 'active' : ''}`}>

                <button className="icon-x closeSearch" onClick={this.props.closeSearchWindow}/>

                <form
                    className="searchForm"
                    onSubmit={this.getSearchResults}>

                    <input
                        className="searchInput"
                        type="text"
                        placeholder="Find your video"
                        onChange={this.setSearch}/>

                    <button className="icon-search searchButton" type="submit" value="Search"/>
                    
                </form>

                <div className="searchResults">
                    {searchResults && searchResults !== undefined && this.getVideoResults(searchResults)}
                    {searchResults === undefined && 
                        <p className="errorMessage">Ohh fuck... <br/> Sorry, you can't search for videos now</p>
                    }
                </div>

            </div>
        )
    }
}

export default SearchVideos;
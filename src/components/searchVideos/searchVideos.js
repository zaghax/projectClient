import React, {Component} from 'react';
import {dbRefPlaylist} from '../appContainer/appContainer';
import {checkButtonStatus, getVideos} from '../common/commonFunctions';

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
        }, setTimeout(() => {this.checkStatus()}, 1000));

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
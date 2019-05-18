import React, {Component} from 'react';
import {getVideos} from '../getVideos/getVideos';
import {dbRefPlaylist} from '../appContainer/appContainer';

class SearchVideos extends Component {

    state = {
        searchValue: '',
        searchResults: []
    }

    addPlaylistItem = (item) => {

        dbRefPlaylist.push(item);

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

        getVideos(params)
        .then((response) => response.json())
        .then(response => {
            this.setState({
                searchResults: response.items
            })
        })

    }

    getVideoResults = (videos) => {
        return videos.map((item, index) => {

            return (
                <div className="videoItem" key={index} >

                    <img className="videoImage" src={item.snippet.thumbnails.medium.url} alt=""/>

                    <div className="videoTitle" >
                        <p dangerouslySetInnerHTML={{__html: item.snippet.title}} />
                    </div>

                    <button className="icon-playlist_add addVideo" onClick={() => { this.addPlaylistItem(item)}} />
                    
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
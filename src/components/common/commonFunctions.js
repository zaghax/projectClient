export const getVideos = async (params)  => {

    const defaultParams = [
        'https://www.googleapis.com/youtube/v3/search',
        '?part=snippet',
        '&type=video',
        '&videoDuration=medium',
        // `&key=${API_KEY}`,
        '&key=AIzaSyC68vEAmg9rnK58aoTP2yePI7FcWgJinFw'
        //'&key=AIzaSyAUWZUfmzfGrPsvtxZ_RdnTWX3alQUaEJo'
        
    ]

    const URL = defaultParams.join('') + params.join('');

    const response = await fetch(URL);
    
    return response;

}

export const checkButtonStatus = (status, refs) => {
    if(status){
        refs.map((item) => {
            if(item.classList.contains('icon-playlist_add')){
                item.classList.remove('icon-playlist_add');
                item.classList.add('icon-clock');
            }
        });
    }else{
        refs.map((item) => {
            if(item.classList.contains('icon-clock')){
                item.classList.remove('icon-clock');
                item.classList.add('icon-playlist_add');
            }
        });
    }
}

export const formatTime = (time) => {   

    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    let timeFormated = "";

    if (hrs > 0) {
        timeFormated += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    timeFormated += "" + mins + ":" + (secs < 10 ? "0" : "");
    timeFormated += "" + secs;

    return timeFormated;
}

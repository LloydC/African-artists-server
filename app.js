require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors')
// require spotify-web-api-node package here:

const app = express();

app.use(cors())
// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => {
        console.log('The access token expires in ' + data.body['expires_in']);
      spotifyApi.setAccessToken(data.body['access_token']);
    })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/search', (req, res)=>{
    const { country } = req.query;

    spotifyApi
    .search(country, ['artist', 'playlist', 'track'], { limit : 10, offset : 1 })
    .then(data => {
        const {artists, tracks, playlists } = data.body;
        const result = {artists, playlists, tracks};
        res.json(result)
      
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/search-artists', (req, res) =>{
    const { artist } = req.query;

    spotifyApi
    .searchArtists(artist)
    .then(data => {
        const result = JSON.stringify(data.body)
        console.log('The received data from the API: ', result);
        res.json(data.body.artists.items)
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params;

    spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
        const result = JSON.stringify(data.body)
        res.send(data.body.items)
        });
})

app.get('/tracks/:albumId', (req, res, next) => {
    const { albumId } = req.params;

    spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
        const result = JSON.stringify(data.body)
        console.log('The received data from the API: ', result);
        res.send(data.body.items)
        });
})

app.listen(port, () => console.log(`African artists server running on port ${port} 🎧 🥁 🎸 🔊`));

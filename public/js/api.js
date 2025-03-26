const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const refreshToken = urlParams.get('refresh_token');

// Save to localStorage
if (accessToken && refreshToken) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  

}

if(localStorage.getItem('access_token')) {
  const recommendationMenu = document.getElementById('genres-list');

  const a = document.createElement('a');
  a.setAttribute('href', './recommendations.html');
  a.innerHTML = `
    <li>Recommendations</li>
  `
  if( window.location.href == "http://localhost:8080/recommendations.html") a.setAttribute("class", "pressed");
  recommendationMenu.appendChild(a);
}

async function getProfile() {
    let accessToken = localStorage.getItem('access_token');
  
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
  
    await response.json();
   
}

async function getAlbumsFromUser() {
  let accessToken = localStorage.getItem('access_token');

  const response = await fetch('https://api.spotify.com/v1/me/albums?limit=16', {
    method: "GET",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  return response.json();
}

async function displayAlbums() {
  try {
    // Fetch the user's albums
    const albumsResponse = await getAlbumsFromUser();
    const albums = albumsResponse.items;

    // Get the <ul> container for the album list
    const albumList = document.getElementById('album-list');

    albums.forEach((item) => {
      const album = item.album; // Access the album object
      const prices = ['25.90', '27.00', '35.00', '37.99', '45.50', '44.99', '20.90', '28.95', '40.95', '43.95'];
      const tracklist = album.tracks.items.map(item => {
        return item.name;
      })

      const randomIndex = Math.floor(Math.random() * (9 - 0 + 1) + 0);
      console.log('random ', randomIndex);
      
      console.log(album);
      // Create the <li> element
      const li = document.createElement('li');

      // Add the inner HTML structure
      li.innerHTML = `
        <a href="../item-page.html">
          <div class="image-container">
            <img 
              src="${album.images[0]?.url || './img/default_cover.webp'}" 
              alt="Cover of ${album.name} by ${album.artists[0].name}">
            <button class="add-basket" type="submit" ">add to basket</button>
          </div>
          <div class="album-info">
            <p class="artist">${album.artists[0]?.name || 'Unknown Artist'}</p>
            <p class="album-name">${album.name || 'Unknown Album'} (Vinyl)</p>
            <p class="price">€${prices[randomIndex]}</p> 
          </div>
        </a>
      `;

      li.querySelector('a').addEventListener('click', () => {
        const albumData = {
          cover: album.images[0]?.url || './img/default_cover.webp',
          artist: album.artists[0]?.name || 'Unknown Artist',
          name: album.name || 'Unknown Album',
          price: '€' + prices[randomIndex], // Replace with dynamic price if available
          description: '', // Replace with actual description if provided
          tracklist: tracklist, // Replace with actual tracklist if provided
        };
        localStorage.setItem('selectedAlbum', JSON.stringify(albumData));
      });

      // Append the <li> to the album list
      albumList.appendChild(li);
    });
  } catch (error) {
    console.error("Error displaying albums:", error);
  }
}
displayAlbums();


async function getTopAlbumsFromUser() {
  let accessToken = localStorage.getItem('access_token');

  const response = await fetch('https://api.spotify.com/v1/me/top/albums', {
    method: "GET",
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  return response.json();
}

async function displayTopAlbums() {
  try {
    const albumsResponse = await getAlbumsFromUser();
    console.log(albumsResponse);
  }
  catch(error) {
    console.log("babou");
  }
}

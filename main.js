// let API_KEY = 'b971c2f0de8767f08d2bb84160ba24b7'

let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e'

let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1` 
let tokenPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
let tokenUpComing = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=1`


const btns = document.querySelectorAll('.btns')
const header = document.querySelector('.append')
const search = document.querySelector('.btn')
const pg = document.querySelector('.pn')
let limit = 1

search.onclick = () => {
    let input = document.querySelectorAll('input')
    let name = input[0].value.trim()
    let min = input[1].value
    let max = input[2].value
    let score = input[3].value
    filter(name,min,max,score,limit)
    pg.innerHTML=null
}

btns[0].onclick = async () => {
    let response = await fetch(tokenTop)
    response = await response.json()
    renderFilm(response,response.page)
    saveActionLocal('top_rated')
    pages(1)
    limit=0
    clearInput()
}

btns[1].onclick = async () => {
    let response = await fetch(tokenPopular)
    response = await response.json()
    renderFilm(response,response.page)
    saveActionLocal('popular')
    clearInput()
    pages(1)
    limit=0
}

btns[2].onclick = async () => {
    let response = await fetch(tokenUpComing)
    response = await response.json()
    renderFilm(response,response.page)
    saveActionLocal('upcoming')
    clearInput()
    pages(1)
    limit=0
}

function clearInput (){
    let input = document.querySelectorAll('input')
    for(let i of input){
        i.value = ''
    }
    return 
}

async function filter (name,min,max,score,limit){
    let url = `https://api.themoviedb.org/3/movie/${getAction()}?api_key=dcea1fd7b3e65d34387ad6de7ef9cc5e&page=${limit}`
    let response = await fetch(url)
    response = await response.json()
    let store = { results: []}
    name.toLowerCase()
    let results=''

    results = response['results'].filter( (data) => {
        let filter1 = data.title.toLowerCase().includes(name) || false
        let filter2 = data.release_date.slice(0,4) >= min ?? false
        let filter3 = max ? data.release_date.slice(0,4) <= max : true    
        let filter4 = score ? data.vote_average >= score : true
        return filter1 && filter2 && filter3 && filter4
    }) 
    store['results'] =results
    renderFilm(store)
}

async function getMovie(page){
    let url = `https://api.themoviedb.org/3/movie/${getAction()}?api_key=dcea1fd7b3e65d34387ad6de7ef9cc5e&page=${page}`
    let response = await fetch(url)
    response = await response.json()
    renderFilm(response)
    return pages(page)
}

function pages(num){
    pg.innerHTML =null
    const [prev,next] = createElement('button','next')
    
    prev.classList.add('prev')
    prev.textContent='Prev'
    prev.onclick = () => {
        return getMovie(limit <= 1 ? 1: --limit)
    }
    pg.append(prev)
    for(let i=num; i<num+10;i++){
        const [span] = createElement('span')
        
        span.classList.add('title')
        span.textContent=i
        pg.append(span)
        span.onclick = () => {
            limit = +span.textContent
            getMovie(limit)
        }
        
    }
    next.classList.add('next')
    next.textContent = 'Next'
    next.onclick = () => {
        return getMovie(limit > 50 ? 50: ++limit)
    }
    pg.append(next)  
    return
}

async function renderFilm(response){
    if(!response.results.length) alert('Film not found, reload this page')
    header.innerHTML = null
    for(let data in response.results){
        let imageLink = response.results[data]['poster_path']
        let imageAlt = response.results[data]['title']
        let movieRate = response.results[data]['vote_average']
        let movieDate = response.results[data]['release_date']

        const [divHead,img,divMovieInfo,h3,spanRate,spanDate] = createElement('div','img','div','h3','span','span')

        divHead.classList.add('movie')

        img.setAttribute('src','https://image.tmdb.org/t/p/w500/'+ imageLink)
        img.setAttribute('alt', imageAlt)

        divMovieInfo.classList.add('movie-info')

        h3.textContent = imageAlt

        spanRate.classList.add('orange')
        spanRate.textContent = movieRate

        spanDate.classList.add('date')
        spanDate.textContent = movieDate

        divMovieInfo.append(h3,spanRate)

        divHead.append(img,divMovieInfo,spanDate)

        header.append(divHead)
    }
}

;( async ()=> {
    let url = `https://api.themoviedb.org/3/movie/${getAction()}?api_key=dcea1fd7b3e65d34387ad6de7ef9cc5e&page=1`
    let response = await fetch(url)
    response = await response.json()
    pages(1)
    renderFilm(response)
})()

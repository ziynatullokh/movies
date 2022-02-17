let lastAction = window.localStorage.getItem('lastAction')

lastAction = lastAction || 'top_rated'

function getAction (){
    let lastAction = window.localStorage.getItem('lastAction')
    lastAction = lastAction || 'top_rated'
    return lastAction
}

function saveActionLocal (str){
    return window.localStorage.setItem('lastAction',str)
}